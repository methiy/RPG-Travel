import { getUserAIConfig } from '../../utils/ai-auth'
import { callAI } from '../../utils/ai-client'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '请先登录' })
  }

  const body = await readBody(event)
  const { tasks, city, country } = body

  if (!tasks?.length || !city || !country) {
    throw createError({ statusCode: 400, statusMessage: '缺少参数' })
  }

  const config = await getUserAIConfig(user.id)

  const taskList = tasks.map((t: { name: string; difficulty: string; exp: number }, i: number) =>
    `${i + 1}. ${t.name}（难度: ${t.difficulty}，经验: ${t.exp}）`
  ).join('\n')

  const systemPrompt = `你是一个专业的旅行行程规划师。请根据用户选择的景点，优化行程安排。

要求：
1. 将景点合理分配到不同天数
2. 考虑地理位置的远近（相邻景点安排在同一天）
3. 考虑游览所需时间（难度越高通常需要越多时间）
4. 每天安排3-5个景点为宜
5. 给出每天的建议游览顺序和时间安排
6. 用中文回复

请按以下格式输出：

### Day 1: [主题名称]
**上午**
- 9:00 - [景点名] - [简短建议]
- 11:00 - [景点名] - [简短建议]

**下午**
- 14:00 - [景点名] - [简短建议]

**傍晚**
- 17:00 - [景点名] - [简短建议]

💡 当日贴士: [实用建议]

---

### Day 2: [主题名称]
...

最后给出总结和注意事项。`

  try {
    const result = await callAI(config, {
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `我计划去${country}的${city}旅行，已选择以下景点：\n\n${taskList}\n\n请帮我优化行程安排。`,
        },
      ],
      maxTokens: 4096,
      temperature: 0.7,
    })

    return { result: result.content }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI 行程优化失败'
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
