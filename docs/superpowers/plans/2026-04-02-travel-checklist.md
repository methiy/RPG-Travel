# 旅行清单 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 planner 页面新增"出行清单"Tab，根据国家攻略数据自动生成两阶段清单（出发前 + 旅途中），勾选状态存数据库。

**Architecture:** 数据库存勾选状态，清单模板前端从国家攻略数据生成。新增 composable 管理清单逻辑，新增 ChecklistPanel 组件渲染 UI，修改 planner.vue 增加 Tab 切换。

**Tech Stack:** Nuxt 4, Vue 3, Vercel Postgres

---

## File Structure

| File | Responsibility |
|------|---------------|
| `server/database/index.ts` | 修改：新增 checklists 表 + CRUD |
| `server/api/checklist/index.get.ts` | 新建：获取勾选状态 |
| `server/api/checklist/index.put.ts` | 新建：更新勾选状态 |
| `app/composables/useChecklist.ts` | 新建：清单模板生成 + 状态管理 |
| `app/components/ChecklistPanel.vue` | 新建：清单 UI |
| `app/pages/planner.vue` | 修改：新增 Tab 切换 |

---

### Task 1: 数据库 — checklists 表

**Files:**
- Modify: `server/database/index.ts`

- [ ] **Step 1: 在 `initDB()` 函数中添加 checklists 表**

在 `initDB()` 内 shares 表创建之后、`} catch` 之前添加：

```typescript
    await sql`
      CREATE TABLE IF NOT EXISTS checklists (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        country_id VARCHAR(50) NOT NULL,
        completed_items JSONB DEFAULT '[]',
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, country_id)
      )
    `
```

- [ ] **Step 2: 在文件末尾添加 checklist CRUD 函数**

在 `getShareById` 函数之后添加：

```typescript
// ---- Checklist API ----

export async function getChecklist(userId: number, countryId: string): Promise<string[]> {
  await initDB()
  const { rows } = await sql`
    SELECT completed_items FROM checklists
    WHERE user_id = ${userId} AND country_id = ${countryId}
    LIMIT 1
  `
  if (!rows[0]) return []
  const raw = rows[0].completed_items
  return (typeof raw === 'string' ? JSON.parse(raw) : raw) as string[]
}

export async function saveChecklist(userId: number, countryId: string, completedItems: string[]): Promise<void> {
  await initDB()
  const json = JSON.stringify(completedItems)
  await sql`
    INSERT INTO checklists (user_id, country_id, completed_items, updated_at)
    VALUES (${userId}, ${countryId}, ${json}::jsonb, NOW())
    ON CONFLICT (user_id, country_id)
    DO UPDATE SET completed_items = ${json}::jsonb, updated_at = NOW()
  `
}
```

- [ ] **Step 3: Commit**

```bash
git add server/database/index.ts
git commit -m "feat(checklist): add checklists table and DB functions"
```

---

### Task 2: 服务端 API

**Files:**
- Create: `server/api/checklist/index.get.ts`
- Create: `server/api/checklist/index.put.ts`

- [ ] **Step 1: 创建 `server/api/checklist/index.get.ts`**

```typescript
import { getChecklist } from '~/server/database'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const countryId = query.country as string
  if (!countryId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing country parameter' })
  }

  const completedItems = await getChecklist(user.id, countryId)
  return { countryId, completedItems }
})
```

- [ ] **Step 2: 创建 `server/api/checklist/index.put.ts`**

```typescript
import { saveChecklist } from '~/server/database'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { countryId, completedItems } = body

  if (!countryId || !Array.isArray(completedItems)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body: need countryId and completedItems array' })
  }

  // Limit items count
  if (completedItems.length > 100) {
    throw createError({ statusCode: 400, statusMessage: 'Too many items' })
  }

  await saveChecklist(user.id, countryId, completedItems)
  return { ok: true }
})
```

- [ ] **Step 3: Commit**

```bash
mkdir -p server/api/checklist
git add server/api/checklist/index.get.ts server/api/checklist/index.put.ts
git commit -m "feat(checklist): add checklist GET and PUT API endpoints"
```

---

### Task 3: useChecklist composable

**Files:**
- Create: `app/composables/useChecklist.ts`

- [ ] **Step 1: 创建 `app/composables/useChecklist.ts`**

```typescript
import { COUNTRIES } from '~/data/countries'
import { CITIES } from '~/data/cities'

interface ChecklistItem {
  id: string
  text: string
  phase: 'before' | 'during'
  checked: boolean
}

export function useChecklist(countryId: Ref<string>) {
  const completedIds = ref<string[]>([])
  const loading = ref(false)
  let syncTimeout: ReturnType<typeof setTimeout> | null = null

  // Generate template items from country guide data
  const templateItems = computed<Omit<ChecklistItem, 'checked'>[]>(() => {
    const id = countryId.value
    if (!id) return []

    const country = COUNTRIES.find(c => c.id === id)
    if (!country?.guide) return []

    const guide = country.guide
    const items: Omit<ChecklistItem, 'checked'>[] = []

    // ── Before departure ──
    let beforeIdx = 0
    items.push({ id: `${id}-before-${beforeIdx++}`, text: '确认护照有效期（剩余6个月以上）', phase: 'before' })
    items.push({ id: `${id}-before-${beforeIdx++}`, text: '购买旅行保险', phase: 'before' })

    if (guide.visa) {
      items.push({ id: `${id}-before-${beforeIdx++}`, text: `确认签证: ${guide.visa}`, phase: 'before' })
    }
    if (guide.currency) {
      items.push({ id: `${id}-before-${beforeIdx++}`, text: `准备货币: ${guide.currency}`, phase: 'before' })
    }
    if (guide.packingEssentials) {
      for (const item of guide.packingEssentials) {
        items.push({ id: `${id}-before-${beforeIdx++}`, text: `准备${item}`, phase: 'before' })
      }
    }

    // ── During trip ──
    let duringIdx = 0
    items.push({ id: `${id}-during-${duringIdx++}`, text: '确认酒店入住信息', phase: 'during' })
    items.push({ id: `${id}-during-${duringIdx++}`, text: '下载离线地图', phase: 'during' })

    // First city transport tip
    const countryCities = CITIES.filter(c => c.countryId === id)
    if (countryCities.length > 0 && countryCities[0].guide?.transport?.length) {
      items.push({ id: `${id}-during-${duringIdx++}`, text: countryCities[0].guide.transport[0], phase: 'during' })
    }

    if (guide.culturalDos) {
      for (const item of guide.culturalDos) {
        items.push({ id: `${id}-during-${duringIdx++}`, text: `记得${item}`, phase: 'during' })
      }
    }

    return items
  })

  // Merge template with checked state
  const items = computed<ChecklistItem[]>(() => {
    const set = new Set(completedIds.value)
    return templateItems.value.map(t => ({
      ...t,
      checked: set.has(t.id),
    }))
  })

  const beforeItems = computed(() => items.value.filter(i => i.phase === 'before'))
  const duringItems = computed(() => items.value.filter(i => i.phase === 'during'))

  const progress = computed(() => {
    const total = items.value.length
    const done = items.value.filter(i => i.checked).length
    return { done, total, percent: total > 0 ? Math.round(done / total * 100) : 0 }
  })

  // Load from server
  async function load() {
    const id = countryId.value
    if (!id) return
    loading.value = true
    try {
      const data = await $fetch<{ completedItems: string[] }>('/api/checklist', {
        params: { country: id },
      })
      completedIds.value = data.completedItems
    } catch {
      // Silently fail
    } finally {
      loading.value = false
    }
  }

  // Save to server (debounced)
  function syncToServer() {
    if (syncTimeout) clearTimeout(syncTimeout)
    syncTimeout = setTimeout(async () => {
      const id = countryId.value
      if (!id) return
      try {
        await $fetch('/api/checklist', {
          method: 'PUT',
          body: { countryId: id, completedItems: completedIds.value },
        })
      } catch {
        // Silently fail
      }
    }, 500)
  }

  // Toggle item
  function toggle(itemId: string) {
    const idx = completedIds.value.indexOf(itemId)
    if (idx >= 0) {
      completedIds.value.splice(idx, 1)
    } else {
      completedIds.value.push(itemId)
    }
    syncToServer()
  }

  // Watch country change → reload
  watch(countryId, (newId) => {
    completedIds.value = []
    if (newId) load()
  }, { immediate: true })

  return {
    items,
    beforeItems,
    duringItems,
    progress,
    toggle,
    loading,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/composables/useChecklist.ts
git commit -m "feat(checklist): add useChecklist composable with template generation"
```

---

### Task 4: ChecklistPanel 组件

**Files:**
- Create: `app/components/ChecklistPanel.vue`

- [ ] **Step 1: 创建 `app/components/ChecklistPanel.vue`**

```vue
<script setup lang="ts">
const props = defineProps<{
  countryId: string
}>()

const countryRef = computed(() => props.countryId)
const { beforeItems, duringItems, progress, toggle, loading } = useChecklist(countryRef)
</script>

<template>
  <div class="checklist-panel">
    <div v-if="loading" class="checklist-loading">加载中...</div>

    <template v-else>
      <!-- Progress bar -->
      <div class="checklist-progress">
        <div class="progress-info">
          <span>进度: {{ progress.done }}/{{ progress.total }} 已完成</span>
          <span class="progress-pct">{{ progress.percent }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress.percent + '%' }" />
        </div>
      </div>

      <!-- Before departure -->
      <div class="checklist-section">
        <h4 class="checklist-section-title">📋 出发前准备</h4>
        <div class="checklist-items">
          <label
            v-for="item in beforeItems"
            :key="item.id"
            class="checklist-item"
            :class="{ checked: item.checked }"
          >
            <input
              type="checkbox"
              :checked="item.checked"
              class="checklist-checkbox"
              @change="toggle(item.id)"
            />
            <span class="checklist-text">{{ item.text }}</span>
          </label>
        </div>
      </div>

      <!-- During trip -->
      <div class="checklist-section">
        <h4 class="checklist-section-title">🧳 旅途中待办</h4>
        <div class="checklist-items">
          <label
            v-for="item in duringItems"
            :key="item.id"
            class="checklist-item"
            :class="{ checked: item.checked }"
          >
            <input
              type="checkbox"
              :checked="item.checked"
              class="checklist-checkbox"
              @change="toggle(item.id)"
            />
            <span class="checklist-text">{{ item.text }}</span>
          </label>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="beforeItems.length === 0 && duringItems.length === 0" class="checklist-empty">
        该国家暂无攻略数据，无法生成清单
      </div>
    </template>
  </div>
</template>

<style scoped>
.checklist-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.checklist-loading {
  text-align: center;
  color: var(--muted);
  padding: 40px 0;
}
.checklist-progress {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
}
.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 8px;
}
.progress-pct {
  font-weight: 700;
  color: var(--accent);
}
.progress-bar {
  height: 8px;
  background: #1a2540;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent2, #7b5ea7));
  border-radius: 4px;
  transition: width 0.4s ease;
}
.checklist-section-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px 0;
}
.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.checklist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.checklist-item:hover {
  border-color: var(--accent);
}
.checklist-item.checked {
  opacity: 0.55;
}
.checklist-item.checked .checklist-text {
  text-decoration: line-through;
}
.checklist-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--accent, #4a9eff);
  flex-shrink: 0;
  cursor: pointer;
}
.checklist-text {
  font-size: 14px;
  color: var(--text);
  transition: opacity 0.2s;
}
.checklist-empty {
  text-align: center;
  color: var(--muted);
  padding: 40px 0;
  font-size: 14px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/components/ChecklistPanel.vue
git commit -m "feat(checklist): add ChecklistPanel component"
```

---

### Task 5: 修改 planner.vue — 新增 Tab 切换

**Files:**
- Modify: `app/pages/planner.vue`

- [ ] **Step 1: 在 planner.vue 中添加 Tab 状态和清单 Tab**

需要做以下修改：

**1) 在 `<script setup>` 中添加 Tab 状态（在 `step` ref 附近）：**

```typescript
const activeTab = ref<'planner' | 'checklist'>('planner')
```

**2) 在模板中，`<h2>` 和 `<p>` 之间的区域，将标题替换为 Tab 切换器：**

将原来的：
```html
<h2>🗺️ 旅行路线规划器</h2>
<p>{{ stepDescription }}</p>
```

替换为：
```html
<div class="tab-bar">
  <button
    class="tab-btn"
    :class="{ active: activeTab === 'planner' }"
    @click="activeTab = 'planner'"
  >🗺️ 行程规划</button>
  <button
    class="tab-btn"
    :class="{ active: activeTab === 'checklist' }"
    @click="activeTab = 'checklist'"
  >✅ 出行清单</button>
</div>
<p v-if="activeTab === 'planner'">{{ stepDescription }}</p>
```

**3) 将所有 planner 内容（step-bar 到 AIChatPanel）包裹在 `v-if="activeTab === 'planner'"` 中：**

在 step-bar 的 `<div class="step-bar">` 前添加 `<template v-if="activeTab === 'planner'">`，在 AIChatPanel 后关闭 `</template>`。

**4) 在 planner 内容之后添加清单 Tab 内容：**

```html
<!-- ═══ Checklist Tab ═══ -->
<template v-if="activeTab === 'checklist'">
  <ClientOnly>
    <section v-if="!selectedCountry" class="planner-select">
      <div class="planner-search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 搜索国家..."
          class="search-input"
        />
      </div>
      <div class="country-grid">
        <div
          v-for="c in filteredCountries"
          :key="c.id"
          class="country-card"
          @click="selectCountryForChecklist(c.id)"
        >
          <div class="country-emoji">{{ c.emoji }}</div>
          <div class="country-name">{{ c.name }}</div>
        </div>
      </div>
    </section>

    <section v-else class="checklist-content">
      <button class="back-btn" @click="selectedCountry = null">← 选择其他国家</button>
      <div class="route-header">
        <div class="route-country">{{ currentCountry?.emoji }} {{ currentCountry?.name }} 出行清单</div>
      </div>
      <ChecklistPanel :country-id="selectedCountry" />
    </section>

    <template #fallback>
      <div class="planner-loading">加载中...</div>
    </template>
  </ClientOnly>
</template>
```

**5) 在 `<script setup>` 中添加清单国家选择函数：**

```typescript
function selectCountryForChecklist(id: string) {
  selectedCountry.value = id
}
```

**6) 在 `<style scoped>` 中添加 Tab 样式：**

```css
/* Tab bar */
.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.tab-btn {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg2);
  color: var(--muted);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(74, 158, 255, 0.08);
}
.tab-btn:hover:not(.active) {
  border-color: var(--accent);
  color: var(--text);
}
```

- [ ] **Step 2: Commit**

```bash
git add app/pages/planner.vue
git commit -m "feat(checklist): add checklist tab to planner page"
```

---

### Task 6: 构建验证

**Files:** None (verification only)

- [ ] **Step 1: 运行构建确认无错误**

Run: `npm run build 2>&1 | tail -20`
Expected: 构建成功

- [ ] **Step 2: 如有错误则修复**

- [ ] **Step 3: Push**

```bash
git push origin main
```
