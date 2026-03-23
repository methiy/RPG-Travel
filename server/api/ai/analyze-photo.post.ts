import { getUserAIConfig } from '../../utils/ai-auth'
import { callAI, buildVisionMessage } from '../../utils/ai-client'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '请先登录' })
  }

  const body = await readBody(event)
  const { dataUrl, taskName } = body

  if (!dataUrl) {
    throw createError({ statusCode: 400, statusMessage: '缺少照片数据' })
  }

  const config = await getUserAIConfig(user.id)

  // Check if provider supports vision
  if (config.provider === 'deepseek') {
    throw createError({ statusCode: 400, statusMessage: 'DeepSeek 暂不支持图片分析，请切换到 OpenAI 或 Claude' })
  }

  const prompt = `请分析这张旅行照片，返回以下 JSON 格式（不要包含 markdown 代码块标记）：

{
  "scene": "对照片场景的详细描述，包括环境、天气、建筑风格等（2-3句话）",
  "landmarks": ["识别出的地标或建筑名称", "如果有的话"],
  "diary": "以第一人称写一段旅行日记，描述拍下这张照片时的心情和感受（3-5句话，文艺温暖的风格）"
}

${taskName ? `这张照片可能与「${taskName}」景点有关。` : ''}
请用中文回复。`

  try {
    const visionMsg = buildVisionMessage(config, dataUrl, prompt)

    const result = await callAI(config, {
      messages: [
        {
          role: 'system',
          content: '你是一个旅行照片分析专家。分析照片并返回指定的 JSON 格式。确保返回的是有效的 JSON。',
        },
        visionMsg,
      ],
      maxTokens: 1024,
      temperature: 0.7,
    })

    // Parse JSON from response
    let analysis
    try {
      // Try to extract JSON from potential markdown code block
      const jsonMatch = result.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found')
      }
    } catch {
      // If parsing fails, create a structured response from the raw text
      analysis = {
        scene: result.content.slice(0, 200),
        landmarks: [],
        diary: result.content.slice(0, 300),
      }
    }

    return { analysis }
  } catch (err: unknown) {
    if ((err as { statusCode?: number }).statusCode) throw err
    const message = err instanceof Error ? err.message : '照片分析失败'
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
