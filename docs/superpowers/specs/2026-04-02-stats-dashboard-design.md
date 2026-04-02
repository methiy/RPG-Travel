# 旅行统计仪表盘设计

## 概述

替换现有 Profile 页面，在保留用户头部信息的基础上，增加游戏成就风格的统计仪表盘。覆盖地理、时间、成就三个维度，以里程碑和高光时刻为核心，视觉冲击力强。

## 实现方案

纯 CSS 可视化，零额外依赖。进度条用 CSS 渐变，饼图用 `conic-gradient`，日历用 CSS grid，动画用 CSS `@keyframes`。与现有深色主题融合。

## 页面结构

自上而下滚动浏览：

1. **用户头部**（保留原有）— 头像、用户名、等级、EXP 进度条、分享按钮
2. **高光摘要** — 2x2 网格卡片，大号数字 + 描述 + 背景图标，入场 fadeInUp 动画
3. **大洲征服进度** — 每大洲一行进度条
4. **难度分布饼图** — CSS conic-gradient 圆环 + 图例
5. **活跃日历** — 近 90 天 GitHub 风格贡献图
6. **里程碑成就** — 预定义节点，解锁/未解锁状态
7. **最近勋章**（保留原有）— 最近 6 枚
8. **最近照片**（保留原有）— 最近 4 张
9. **退出登录**（保留原有）

## 统计模块细节

### 高光摘要（2x2 网格）

四张卡片：
- 征服 N 个国家（背景图标 🌍）
- 收集 N 枚勋章（背景图标 🏅）
- 足迹遍布 N 大洲（背景图标 🗺️）
- 累计 N EXP（背景图标 ⚡）

每张卡片深色背景 + 渐变边框，数字使用 36px 加粗金色，描述 14px 灰色。入场时 fadeInUp 动画，卡片间有 100ms 延迟形成级联效果。

### 大洲征服进度

每个大洲一行：emoji + 名称 + 进度条 + 百分比文字。

进度 = 该大洲已完成任务数 / 该大洲总任务数。

进度条颜色按大洲区分：
- 亚洲: #ff6b6b 红
- 欧洲: #4a9eff 蓝
- 北美洲: #ffd700 金
- 南美洲: #4ade80 绿
- 非洲: #f59e0b 橙
- 大洋洲: #a78bfa 紫

100% 征服的大洲显示金色边框 + ✅ 标记。

### 难度分布饼图

CSS `conic-gradient` 实现圆环样式（中间镂空显示总任务数）。

四种难度颜色：
- Easy: #4ade80 绿
- Medium: #4a9eff 蓝
- Hard: #f59e0b 橙
- Legendary: #ef4444 红

饼图右侧显示图例：颜色点 + 难度名 + 数量 + 百分比。

### 活跃日历（近 90 天）

CSS grid 布局，7 行（周一到周日）x 13 列（13 周）。每天一个 12x12px 小方块，圆角 2px。

颜色深浅表示当天完成任务数：
- 0 个任务: #0e1424（暗底色）
- 1 个任务: #1a3a5c
- 2 个任务: #2563eb
- 3+ 个任务: #4a9eff（最亮）

数据来源：遍历用户已完成的任务 ID，通过 `usePhotoCheckin().photos` 的 `timestamp` 字段确定完成日期。没有 timestamp 的任务不参与日历统计。

日历上方显示月份标签，下方显示图例（少 → 多）。

### 里程碑成就

预定义 8 个里程碑节点：

| 里程碑 | 条件 | 图标 |
|--------|------|------|
| 初出茅庐 | 完成 1 个任务 | 🎒 |
| 十任达人 | 完成 10 个任务 | 🌟 |
| 百任勇士 | 完成 100 个任务 | 💪 |
| 首国征服 | 完成 1 个国家全部任务 | 🏴 |
| 五国旅行家 | 去过 5 个国家 | 🗺️ |
| 勋章收藏家 | 获得 10 枚勋章 | 🏅 |
| 大洲征服者 | 某大洲任务 100% 完成 | 🌍 |
| EXP 破万 | 累计 10000 EXP | 🚀 |

已解锁：金色边框 + 高亮图标 + 名称 + 解锁描述。
未解锁：灰色边框 + 🔒 图标 + 名称 + 解锁条件。

横向滚动或 2 列网格排列。

## 文件变更

| 文件 | 操作 | 职责 |
|------|------|------|
| `app/pages/profile.vue` | 重写 | 保留头部，中间替换为统计卡片流 |
| `app/composables/useStats.ts` | 新建 | 计算所有统计数据（纯 computed） |
| `app/components/StatsHighlightGrid.vue` | 新建 | 高光摘要 2x2 卡片 |
| `app/components/StatsContinentProgress.vue` | 新建 | 大洲征服进度条 |
| `app/components/StatsDifficultyChart.vue` | 新建 | 难度分布 CSS 饼图 |
| `app/components/StatsActivityCalendar.vue` | 新建 | 90 天活跃日历 |
| `app/components/StatsMilestones.vue` | 新建 | 里程碑成就列表 |

## 数据流

```
useGameState() + usePhotoCheckin()
         ↓
    useStats()  ← 纯计算 composable，无 API 调用
         ↓
  返回所有统计 computed 属性:
  - highlights: { countriesCount, medalCount, continentsCount, exp }
  - continentProgress: Array<{ name, emoji, color, completed, total, percent }>
  - difficultyDistribution: { easy, medium, hard, legendary, total }
  - activityCalendar: Array<{ date, count }> (近90天)
  - milestones: Array<{ id, icon, name, condition, unlocked }>
         ↓
  profile.vue 传给各子组件 via props
```

全部前端计算，无新 API 端点。数据来源：
- `useGameState().state` — exp, completed[], medals[]
- `TASKS` — 任务元数据（国家、城市、难度）
- `CONTINENTS` — 大洲定义
- `COUNTRIES` — 国家列表
- `usePhotoCheckin().photos` — 照片时间戳用于日历
- `ALL_MEDALS` — 勋章总数
