import { getUserAIConfig } from '../../utils/ai-auth'
import { streamAI } from '../../utils/ai-client'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '请先登录' })
  }

  const body = await readBody(event)
  const { type, name, countryName } = body

  if (!type || !name) {
    throw createError({ statusCode: 400, statusMessage: '缺少参数' })
  }

  const config = await getUserAIConfig(user.id)

  const systemPrompt = type === 'country'
    ? `你是一个专业的旅行攻略撰写者。请为用户生成关于「${name}」的国家旅行攻略。

请按照以下格式输出（使用 Markdown）：

## 🛂 签证信息
（签证政策详情）

## 💱 货币汇率
（当地货币和汇率信息）

## 🗣️ 语言提示
- 主要语言
- 旅游区语言情况

## 🆘 紧急联系
- 当地报警电话
- 急救电话
- 中国大使馆电话

## 🌤️ 最佳季节
（最佳旅行时间）

## 💰 预算范围
（每日预算估计）

## ✅ 文化礼仪
- 应该做的事情

## ❌ 文化禁忌
- 不应该做的事情

## 🎒 必备物品
- 推荐携带的物品

## 🛡️ 安全须知
- 安全注意事项

内容要求：
1. 以中国游客视角撰写，使用中文
2. 信息实用、具体、接地气
3. 包含最新的签证政策和汇率参考
4. 每个部分3-5条建议
5. 语言生动有趣但不失专业`
    : `你是一个专业的旅行攻略撰写者。请为用户生成关于「${countryName || ''}·${name}」的城市旅行攻略。

请按照以下格式输出（使用 Markdown）：

## 🚇 城市交通
- 交通方式和建议

## 🌡️ 天气气候
（城市气候特点）

## 🌟 特色亮点
- 当地特色体验

## 🛡️ 安全提示
- 安全注意事项

## 📅 建议天数
（推荐游览天数）

## 🍜 美食推荐
- 必吃美食和餐厅

## 🏨 住宿建议
- 推荐住宿区域

## 💡 实用贴士
- 当地实用小技巧

内容要求：
1. 以中国游客视角撰写，使用中文
2. 信息实用、具体，包含地名和价格参考
3. 推荐当地人真正去的地方
4. 每个部分3-5条建议
5. 语言生动有趣但不失专业`

  await streamAI(config, {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `请生成${type === 'country' ? '国家' : '城市'}攻略：${name}` },
    ],
    maxTokens: 4096,
    temperature: 0.7,
    stream: true,
  }, event)
})
