# 旅行清单功能设计

## 概述

在现有 `/planner` 路线规划页中新增"出行清单"Tab，用户选择目的地国家后自动生成两阶段清单（出发前准备 + 旅途中待办）。清单项从现有国家攻略数据自动生成，用户勾选完成状态，同步存储到服务端数据库。

## 实现方案

整合到 planner 页面，新增 Tab 切换。清单模板前端生成（基于国家攻略数据），只存勾选状态到数据库。

## 页面交互

在 `/planner` 页面新增 Tab：`[🗺️ 行程规划] [✅ 出行清单]`。

清单 Tab 内容：
1. 国家选择器（复用 planner 已选国家，或独立选择）
2. 出发前准备区域 — 勾选列表
3. 旅途中待办区域 — 勾选列表
4. 底部进度条 — 已完成/总数 + 百分比

## 清单模板生成规则

每个国家根据攻略数据自动生成固定清单项。

### 出发前准备

| 来源字段 | 生成规则 |
|---------|---------|
| 固定通用项 | "确认护照有效期"、"购买旅行保险" |
| `guide.visa` | "确认签证: {visa}" |
| `guide.currency` | "准备货币: {currency}" |
| `guide.packingEssentials[]` | 每项一条: "准备{item}" |

### 旅途中待办

| 来源字段 | 生成规则 |
|---------|---------|
| 固定通用项 | "确认酒店入住"、"下载离线地图" |
| 城市 `guide.transport[]` | 第一个城市的第一条交通提示 |
| `guide.culturalDos[]` | 每条一个提醒: "记得{item}" |

每个清单项有唯一 ID，格式为 `{countryId}-{phase}-{index}`，如 `japan-before-0`。

## 数据库

新增 `checklists` 表：

```sql
CREATE TABLE checklists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  country_id VARCHAR(50) NOT NULL,
  completed_items JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, country_id)
);
```

只存已完成项的 ID 数组。清单模板在前端生成，清单内容随攻略数据更新自动变化。

## API

### GET /api/checklist?country={countryId}

需要登录。返回该用户该国家的已勾选项 ID 数组。

响应：`{ countryId: string, completedItems: string[] }`

如果没有记录，返回空数组。

### PUT /api/checklist

需要登录。更新勾选状态。

请求体：`{ countryId: string, completedItems: string[] }`

使用 UPSERT，存在则更新，不存在则创建。

## 文件变更

| 文件 | 操作 | 职责 |
|------|------|------|
| `app/composables/useChecklist.ts` | 新建 | 清单模板生成 + 勾选状态管理 |
| `app/components/ChecklistPanel.vue` | 新建 | 清单 UI（两阶段列表 + 进度条） |
| `app/pages/planner.vue` | 修改 | 新增"出行清单"Tab |
| `server/api/checklist/index.get.ts` | 新建 | 获取勾选状态 |
| `server/api/checklist/index.put.ts` | 新建 | 更新勾选状态 |
| `server/database/index.ts` | 修改 | 新增 checklists 表 + CRUD |

## 数据流

```
国家攻略数据 (guide.visa, packingEssentials, culturalDos, etc.)
         ↓
  useChecklist(countryId)
    → 生成固定模板清单项（前端计算）
    → GET /api/checklist 获取已勾选状态
    → 合并：每项 { id, text, phase, checked }
         ↓
  ChecklistPanel.vue 渲染
    → 用户勾选 → PUT /api/checklist 同步
```

## Composable 接口

```typescript
interface ChecklistItem {
  id: string           // e.g. "japan-before-0"
  text: string         // 清单内容
  phase: 'before' | 'during'
  checked: boolean
}

useChecklist(countryId: Ref<string>) => {
  items: ComputedRef<ChecklistItem[]>
  beforeItems: ComputedRef<ChecklistItem[]>
  duringItems: ComputedRef<ChecklistItem[]>
  progress: ComputedRef<{ done: number, total: number, percent: number }>
  toggle(itemId: string): void
  loading: Ref<boolean>
}
```
