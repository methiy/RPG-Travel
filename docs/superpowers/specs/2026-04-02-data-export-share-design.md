# 数据导出 - 社交分享功能设计

## 概述

为旅行者传说新增数据导出功能，聚焦社交分享方向。用户可选择不同模板生成精美旅行成就卡片，支持下载 PNG 图片和生成公开分享链接。

## 架构

```
用户点击"分享" → 选择模板 → 预览卡片 → 下载图片 / 生成链接
                                         ↓
                              Canvas 渲染 → PNG 下载
                                         ↓
                              POST /api/share → 存数据库 → 返回分享 ID
                                         ↓
                              /share/[id] 公开页面 → 任何人可访问
```

采用纯前端 Canvas 方案生成图片，零额外依赖，契合现有 Nuxt + Vercel 架构。

## 新增文件

| 文件 | 职责 |
|------|------|
| `app/pages/export.vue` | 导出主页面（选模板、预览、操作） |
| `app/pages/share/[id].vue` | 公开分享页面（无需登录） |
| `app/components/ShareCardPreview.vue` | 卡片预览 + Canvas 渲染 |
| `app/components/ShareTemplateSelector.vue` | 模板选择器 |
| `app/composables/useShareCard.ts` | 卡片生成逻辑（Canvas 绘制、下载） |
| `server/api/share/index.post.ts` | 创建分享记录 |
| `server/api/share/[id].get.ts` | 获取分享数据 |

## 卡片模板

三种模板，统一尺寸 720 x 960px，深色主题，底部带 `🌍 旅行者传说` 水印。

### 1. 成就总览

展示用户的整体旅行数据。

内容：头像、用户名、等级、去过的国家/城市数量、完成任务数、勋章数、成就数、称号、累计 EXP。

配色：深色背景（#07090f），金色（#ffd700）强调数字，蓝色（#4a9eff）点缀。

### 2. 单次旅行

聚焦某个国家的旅行记录。

内容：国家名称 + 国旗 emoji、打卡照片拼图（2x2）、访问的城市列表、任务完成进度、获得的相关勋章、用户名和等级。

用户选择国家后自动填充数据。如果没有打卡照片则用默认插图。

### 3. 勋章墙

重点展示已收集的勋章。

内容：勋章图标网格（4x3）、收集进度（已获得/总数）、最稀有勋章名称、用户名和等级。

勋章按稀有度排序，未获得的勋章灰色显示。

## 分享页面 `/share/[id]`

- 无需登录即可访问
- 用 HTML/CSS 渲染，响应式布局，内容比卡片图片更丰富
- 数据是生成时的快照，不随用户后续进度变化
- 底部放「来旅行者传说开始你的冒险」引导按钮
- 设置 Open Graph meta 标签，在微信/Twitter 等平台分享时有预览

## 数据库

新增 `shares` 表：

```sql
CREATE TABLE shares (
  id VARCHAR(8) PRIMARY KEY,        -- nanoid 8位短ID
  user_id INTEGER NOT NULL,
  template VARCHAR(20) NOT NULL,    -- 'overview' | 'trip' | 'medals'
  snapshot JSONB NOT NULL,          -- 生成时的完整数据快照
  created_at TIMESTAMP DEFAULT NOW()
);
```

快照内容根据模板不同而不同：
- overview: `{ user, level, exp, countries, cities, tasks, medals, achievements }`
- trip: `{ user, level, country, cities, tasks, medals, photos }`
- medals: `{ user, level, medals, totalMedals, rarestMedal }`

## 用户交互流程

### 入口

- Profile 页面：「分享」按钮
- 国家详情页：「分享此旅行」按钮（直接进入单次旅行模板并预选该国家）
- 勋章页面：「分享勋章墙」按钮（直接进入勋章墙模板）

### 导出页面流程

1. 进入 `/export` 页面
2. 选择模板（总览 / 单次旅行 / 勋章墙）
3. 如果选"单次旅行"，弹出国家选择器（仅显示有进度的国家）
4. 实时预览卡片
5. 两个操作按钮并排：「保存图片」和「生成链接」

### 保存图片

- Canvas 绘制完成后调用 `toDataURL('image/png')`
- 自动触发浏览器下载
- 文件名格式：`旅行者传说-{模板名}-{日期}.png`

### 生成链接

- POST 到 `/api/share`，服务端存储快照返回 ID
- 显示链接 `{域名}/share/{id}`，带一键复制按钮
- 同一模板 + 相同数据重复生成时复用已有链接，不创建新记录

## 技术细节

### Canvas 渲染

composable `useShareCard` 封装所有 Canvas 绘制逻辑：
- 接收模板类型和数据，返回 Canvas 元素和下载方法
- 文字渲染使用系统字体栈，确保中英文都好看
- 头像和照片先加载为 Image 对象再 drawImage
- 圆角矩形、渐变背景等通过 Canvas API 绘制

### 分享页面 SSR

`/share/[id]` 页面需要服务端渲染以支持 Open Graph meta 标签：
- 在 `nuxt.config.ts` 中为 `/share/**` 路由单独启用 SSR（当前项目全局 `ssr: false`）
- 使用 `useAsyncData` 在服务端获取分享数据
- 设置 `useHead` 动态 meta 标签

### 防滥用

- 每个用户最多保存 50 条分享记录
- 分享创建接口需要登录鉴权
- snapshot 数据大小限制 500KB
