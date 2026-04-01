# 导航重构 + 全局搜索 + 路线规划增强 设计文档

日期: 2026-04-01

## 概述

三个独立子项目，按顺序依次实现：

1. **导航重构** — 底部 Tab + 顶部二级导航，替代当前 13 个平铺页签
2. **全局搜索** — TopBar 搜索图标 + 全屏搜索遮罩，搜索国家和城市
3. **路线规划增强** — 保存多个行程、导出图片、交通时间估算、手动拖拽排序

---

## 子项目一：导航重构

### 布局变化

```
之前: TopBar → MainNav (13个平铺Tab) → 页面内容
之后: TopBar → SubNav (当前分组子页签) → 页面内容 → BottomTabBar (4个主Tab)
```

### 底部 Tab 分组

| Tab | 图标 | 子页面 | 默认路由 |
|-----|------|--------|---------|
| 探索 | 🗺️ | 世界地图(`/`)、路线规划(`/planner`)、目的地天气(`/weather`)、时间线(`/timeline`) | `/` |
| 成就 | 🏆 | 勋章墙(`/medals`)、旅行成就(`/achievements`)、每周挑战(`/challenges`)、排行榜(`/leaderboard`) | `/medals` |
| 社区 | 📸 | 我的照片(`/photos`)、照片社区(`/community`)、小游戏(`/games`) | `/photos` |
| 我的 | 👤 | 个人资料(`/profile`)、设置(`/settings`) | `/profile` |

### 行为规则

- 点击底部 Tab 跳转到该组第一个子页面
- 顶部 SubNav 显示当前 Tab 下的子页签，样式沿用现有 MainNav 风格
- 如果某组只有 1 个子页面则隐藏 SubNav（避免只有一个 Tab）
- 底部 Tab 固定屏幕底部，高亮当前活跃 Tab

### 组件变化

| 文件 | 操作 | 说明 |
|------|------|------|
| `MainNav.vue` | 改造为 `SubNav.vue` | 根据 route 自动判断当前所属组，只显示该组子页签 |
| 新增 `BottomTabBar.vue` | 新建 | 底部 4 个主 Tab，fixed 定位 |
| `default.vue` | 修改 | 布局：TopBar → SubNav → 内容区(底部留空) → BottomTabBar |

### SubNav 实现

- 定义 `NAV_GROUPS` 常量：分组名、图标、子页面列表（路径+名称）
- `computed` 根据 `route.path` 找到当前所属组
- 只渲染该组的子页签

### BottomTabBar 样式

- `position: fixed; bottom: 0; left: 0; right: 0`
- 深色背景 `var(--bg2)`，顶部 `1px solid var(--border)`
- 图标 + 文字纵向排列，选中态 `var(--accent)` 高亮
- `padding-bottom: env(safe-area-inset-bottom)` 适配 iPhone 安全区
- 页面内容区底部加 `padding-bottom: 60px` 避免遮挡

---

## 子项目二：全局搜索

### 交互流程

1. TopBar 右侧新增 🔍 搜索图标按钮
2. 点击弹出全屏搜索遮罩 `SearchOverlay`
3. 顶部搜索输入框自动聚焦，下方实时显示结果
4. 点击结果跳转对应页面并关闭遮罩
5. 点击 × 或 ESC 关闭

### 搜索范围

| 类型 | 匹配字段 | 跳转目标 | 结果样式示例 |
|------|---------|---------|------------|
| 国家 | 国家名、国家ID | `/country/[id]` | 🇯🇵 日本 — 6个城市 · 24个任务 |
| 城市 | 城市名 | `/country/[countryId]` | 🏙️ 东京 — 日本 · 8个任务 |

### 实现细节

- `useGlobalSearch` composable：接收搜索词，返回分组结果
- 纯前端过滤，数据来源 `COUNTRIES` 和 `TASKS`
- 大小写不敏感，中文直接匹配
- 搜索词为空时显示空状态提示

### 文件变化

| 文件 | 操作 |
|------|------|
| 新增 `SearchOverlay.vue` | 全屏搜索组件 |
| 新增 `useGlobalSearch.ts` | 搜索逻辑 composable |
| 修改 `TopBar.vue` | 加搜索图标按钮 |

---

## 子项目三：路线规划增强

### 3a. 保存多个行程

**数据模型：**

```typescript
interface SavedItinerary {
  id: string           // uuid
  name: string         // "东京3日游"
  country: string      // countryId
  city: string         // 城市名
  taskIds: string[]    // 选中的 taskId 列表
  days: ItineraryDay[] // 生成的行程数据
  createdAt: number    // timestamp
  updatedAt: number    // timestamp
}
```

**交互：**

- Step 4（行程展示页）新增「💾 保存行程」按钮
- 保存时弹出命名输入框，默认名 `{城市}行程`
- Step 1 之前新增行程列表入口：显示已保存行程卡片
- 每个行程支持：查看、编辑（重新进入规划流程）、删除

**后端 API：**

- `GET /api/itineraries` — 获取当前用户所有行程
- `POST /api/itineraries` — 新建行程
- `PUT /api/itineraries/:id` — 更新行程
- `DELETE /api/itineraries/:id` — 删除行程

### 3b. 导出图片

- Step 4 新增「📤 导出图片」按钮
- 使用 `html2canvas` 将行程区域截图为 PNG
- 生成带品牌水印的长图（行程摘要 + 每日任务列表 + 地图截图）
- 点击直接触发下载

### 3c. 交通时间估算

- Step 4 每日行程中，相邻任务之间显示交通估算信息
- 格式：`🚶 约X.Xkm · 步行约Xmin` 或 `🚗 约X.Xkm · 驾车约Xmin`
- 基于已有的 Haversine 距离计算（`useCityPlanner` 中的 `calcDistance`）
- 估算规则：
  - 距离 ≤ 3km → 显示步行（5km/h）
  - 距离 > 3km → 显示驾车（40km/h）
- 纯前端计算，不依赖外部 API

### 3d. 手动拖拽排序

- Step 4 每日任务列表支持拖拽排序
- 支持同一天内拖拽调整顺序
- 支持跨天拖拽移动任务
- 调整后自动重新计算交通时间和地图连线
- 使用 HTML5 Drag & Drop 或轻量拖拽库实现

### 文件变化

| 文件 | 操作 |
|------|------|
| 修改 `planner.vue` | 新增行程列表入口(Step 0)、保存/导出按钮 |
| 修改 `useCityPlanner.ts` | 交通时间计算函数 |
| 新增 `useItineraryStore.ts` | 行程 CRUD composable，对接后端 API |
| 新增 `server/api/itineraries/index.get.ts` | 获取行程列表 |
| 新增 `server/api/itineraries/index.post.ts` | 新建行程 |
| 新增 `server/api/itineraries/[id].put.ts` | 更新行程 |
| 新增 `server/api/itineraries/[id].delete.ts` | 删除行程 |
| 修改 `DayItinerary.vue` | 拖拽支持、交通时间显示 |
| 新增依赖 `html2canvas` | 导出图片 |

---

## 实施顺序

1. 导航重构（约 3-4 个文件）
2. 全局搜索（约 2-3 个文件）
3. 路线规划增强（约 8-10 个文件）

每个子项目独立走 plan → 实现 → 验证 周期。
