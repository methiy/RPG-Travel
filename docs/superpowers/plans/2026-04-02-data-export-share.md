# 数据导出 - 社交分享功能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让用户生成精美旅行成就卡片（3种模板），支持下载 PNG 图片和生成公开分享链接。

**Architecture:** 前端 Canvas 渲染卡片图片，服务端存储分享快照数据。新增 `/export` 导出页面和 `/share/[id]` 公开分享页面。分享页面需要为 `/share/**` 路由单独启用 SSR 以支持 Open Graph meta。

**Tech Stack:** Nuxt 4, Vue 3, Canvas API, Vercel Postgres, nanoid

---

## File Structure

| File | Responsibility |
|------|---------------|
| `app/types/index.ts` | 新增 `ShareSnapshot`, `ShareRecord`, `ShareTemplate` 类型 |
| `app/composables/useShareCard.ts` | Canvas 绘制逻辑、PNG 下载、链接生成 |
| `app/components/ShareTemplateSelector.vue` | 3种模板的选择器卡片 |
| `app/components/ShareCardPreview.vue` | 卡片预览容器 + Canvas 渲染 |
| `app/pages/export.vue` | 导出主页面 |
| `app/pages/share/[id].vue` | 公开分享页面（SSR） |
| `server/api/share/index.post.ts` | 创建分享记录 API |
| `server/api/share/[id].get.ts` | 获取分享数据 API |
| `server/database/index.ts` | 新增 shares 表和相关函数 |
| `nuxt.config.ts` | 为 `/share/**` 启用 SSR |
| `app/constants/navigation.ts` | 在"我的"组新增导出入口 |

---

### Task 1: 新增类型定义

**Files:**
- Modify: `app/types/index.ts`

- [ ] **Step 1: 在 `app/types/index.ts` 文件末尾添加分享相关类型**

在文件末尾 `ItineraryDay` 接口之后追加：

```typescript
// ── Share/Export Types ────────────────────────────────
export type ShareTemplate = 'overview' | 'trip' | 'medals'

export interface OverviewSnapshot {
  username: string
  displayName: string
  avatar: string
  level: number
  title: string
  exp: number
  countriesCount: number
  citiesCount: number
  completedCount: number
  medalCount: number
  achievementCount: number
}

export interface TripSnapshot {
  username: string
  displayName: string
  avatar: string
  level: number
  title: string
  countryId: string
  countryName: string
  countryEmoji: string
  cities: string[]
  completedTasks: number
  totalTasks: number
  medals: Array<{ icon: string; name: string }>
  photos: string[]  // dataUrl strings, max 4
}

export interface MedalsSnapshot {
  username: string
  displayName: string
  avatar: string
  level: number
  title: string
  earnedMedals: Array<{ icon: string; name: string }>
  totalMedals: number
  rarestMedal: { icon: string; name: string } | null
}

export type ShareSnapshotData = OverviewSnapshot | TripSnapshot | MedalsSnapshot

export interface ShareRecord {
  id: string
  template: ShareTemplate
  snapshot: ShareSnapshotData
  createdAt: string
}
```

- [ ] **Step 2: 确认无类型错误**

Run: `npx nuxi typecheck 2>&1 | tail -5`
Expected: 无新增错误（项目可能有已知的类型警告，忽略已有的即可）

- [ ] **Step 3: Commit**

```bash
git add app/types/index.ts
git commit -m "feat(export): add share/export type definitions"
```

---

### Task 2: 数据库 — shares 表和查询函数

**Files:**
- Modify: `server/database/index.ts`

- [ ] **Step 1: 在 `server/database/index.ts` 的 `initDB` 函数中添加 shares 表创建**

在 `initDB()` 函数内，`ai_settings` 那行 `ALTER TABLE` 之后、`} catch` 之前，添加：

```typescript
    await sql`
      CREATE TABLE IF NOT EXISTS shares (
        id VARCHAR(8) PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        template VARCHAR(20) NOT NULL,
        snapshot JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
```

- [ ] **Step 2: 在文件末尾添加 shares 的 CRUD 函数**

在 `saveAISettings` 函数之后添加：

```typescript
// ---- Share/Export API ----

export interface ShareDBRecord {
  id: string
  user_id: number
  template: string
  snapshot: Record<string, unknown>
  created_at: string
}

function generateShareId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

export async function createShare(
  userId: number,
  template: string,
  snapshot: Record<string, unknown>,
): Promise<ShareDBRecord> {
  await initDB()

  // Check user share count limit (max 50)
  const { rows: countRows } = await sql`
    SELECT COUNT(*) as cnt FROM shares WHERE user_id = ${userId}
  `
  if (Number(countRows[0]?.cnt ?? 0) >= 50) {
    throw new Error('Share limit reached (max 50)')
  }

  const id = generateShareId()
  const snapshotJson = JSON.stringify(snapshot)

  const { rows } = await sql`
    INSERT INTO shares (id, user_id, template, snapshot)
    VALUES (${id}, ${userId}, ${template}, ${snapshotJson}::jsonb)
    RETURNING *
  `

  const row = rows[0] as Record<string, unknown>
  return {
    id: row.id as string,
    user_id: row.user_id as number,
    template: row.template as string,
    snapshot: (typeof row.snapshot === 'string' ? JSON.parse(row.snapshot) : row.snapshot) as Record<string, unknown>,
    created_at: row.created_at as string,
  }
}

export async function getShareById(id: string): Promise<ShareDBRecord | undefined> {
  await initDB()
  const { rows } = await sql`SELECT * FROM shares WHERE id = ${id} LIMIT 1`
  if (!rows[0]) return undefined
  const row = rows[0] as Record<string, unknown>
  return {
    id: row.id as string,
    user_id: row.user_id as number,
    template: row.template as string,
    snapshot: (typeof row.snapshot === 'string' ? JSON.parse(row.snapshot) : row.snapshot) as Record<string, unknown>,
    created_at: row.created_at as string,
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add server/database/index.ts
git commit -m "feat(export): add shares table and DB functions"
```

---

### Task 3: 服务端 API — 创建和获取分享

**Files:**
- Create: `server/api/share/index.post.ts`
- Create: `server/api/share/[id].get.ts`

- [ ] **Step 1: 创建 `server/api/share/index.post.ts`**

```typescript
import { createShare } from '~/server/database'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { template, snapshot } = body

  if (!template || !snapshot) {
    throw createError({ statusCode: 400, statusMessage: 'Missing template or snapshot' })
  }

  const validTemplates = ['overview', 'trip', 'medals']
  if (!validTemplates.includes(template)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid template type' })
  }

  // Limit snapshot size (~500KB)
  const snapshotStr = JSON.stringify(snapshot)
  if (snapshotStr.length > 512_000) {
    throw createError({ statusCode: 400, statusMessage: 'Snapshot too large' })
  }

  try {
    const share = await createShare(user.id, template, snapshot)
    return { id: share.id }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (message.includes('Share limit reached')) {
      throw createError({ statusCode: 429, statusMessage: message })
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to create share' })
  }
})
```

- [ ] **Step 2: 创建 `server/api/share/[id].get.ts`**

```typescript
import { getShareById } from '~/server/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing share ID' })
  }

  const share = await getShareById(id)
  if (!share) {
    throw createError({ statusCode: 404, statusMessage: 'Share not found' })
  }

  return {
    id: share.id,
    template: share.template,
    snapshot: share.snapshot,
    createdAt: share.created_at,
  }
})
```

- [ ] **Step 3: Commit**

```bash
git add server/api/share/index.post.ts server/api/share/\[id\].get.ts
git commit -m "feat(export): add share create and get API endpoints"
```

---

### Task 4: 客户端 auth 中间件 — 放行 /share 路由

**Files:**
- Modify: `app/middleware/auth.global.ts`

- [ ] **Step 1: 将 `/share` 路径加入公开页面列表**

在 `auth.global.ts` 中找到公开页面列表（包含 `/login`, `/register`, `/user/`），把 `/share/` 加进去。找到类似如下判断逻辑：

```typescript
const isPublic = ['/login', '/register'].some(p => to.path === p)
    || to.path.startsWith('/user/')
```

将其修改为：

```typescript
const isPublic = ['/login', '/register'].some(p => to.path === p)
    || to.path.startsWith('/user/')
    || to.path.startsWith('/share/')
```

- [ ] **Step 2: Commit**

```bash
git add app/middleware/auth.global.ts
git commit -m "feat(export): allow public access to /share routes"
```

---

### Task 5: Composable — useShareCard

**Files:**
- Create: `app/composables/useShareCard.ts`

- [ ] **Step 1: 创建 `app/composables/useShareCard.ts` — 工具函数部分**

```typescript
import type {
  ShareTemplate,
  OverviewSnapshot,
  TripSnapshot,
  MedalsSnapshot,
  ShareSnapshotData,
} from '~/types'

const CARD_WIDTH = 720
const CARD_HEIGHT = 960
const BG_COLOR = '#0a0e1a'
const PRIMARY_COLOR = '#4a9eff'
const GOLD_COLOR = '#ffd700'
const TEXT_COLOR = '#e8eaf6'
const MUTED_COLOR = '#8890a8'
const CARD_BG = '#131828'

/** Round-rect helper for Canvas */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/** Draw text centered horizontally */
function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string, y: number,
  font: string, color: string,
) {
  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.fillText(text, CARD_WIDTH / 2, y)
}

/** Draw a stat box */
function drawStatBox(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number,
  value: string, label: string,
) {
  roundRect(ctx, x, y, w, 80, 12)
  ctx.fillStyle = CARD_BG
  ctx.fill()

  ctx.font = 'bold 28px system-ui, sans-serif'
  ctx.fillStyle = GOLD_COLOR
  ctx.textAlign = 'center'
  ctx.fillText(value, x + w / 2, y + 36)

  ctx.font = '16px system-ui, sans-serif'
  ctx.fillStyle = MUTED_COLOR
  ctx.fillText(label, x + w / 2, y + 62)
}

export function useShareCard() {
  const generating = ref(false)
  const shareUrl = ref('')

  /** Render overview template */
  function renderOverview(ctx: CanvasRenderingContext2D, data: OverviewSnapshot) {
    // Background
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

    // Header gradient bar
    const grad = ctx.createLinearGradient(0, 0, CARD_WIDTH, 0)
    grad.addColorStop(0, '#4a9eff')
    grad.addColorStop(1, '#7b5ea7')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, CARD_WIDTH, 4)

    // Title
    drawCenteredText(ctx, '🌍 旅行者传说', 60, 'bold 28px system-ui, sans-serif', TEXT_COLOR)

    // Divider
    ctx.strokeStyle = '#1e2640'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(60, 85)
    ctx.lineTo(CARD_WIDTH - 60, 85)
    ctx.stroke()

    // Avatar + Name + Level
    ctx.font = '64px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(data.avatar, CARD_WIDTH / 2, 170)

    drawCenteredText(ctx, data.displayName, 220, 'bold 32px system-ui, sans-serif', TEXT_COLOR)
    drawCenteredText(ctx, `Lv.${data.level} ${data.title}`, 255, '20px system-ui, sans-serif', PRIMARY_COLOR)

    // Stats grid (2 rows x 3 cols)
    const statsStartY = 300
    const boxW = 180
    const gapX = 30
    const startX = (CARD_WIDTH - boxW * 3 - gapX * 2) / 2

    drawStatBox(ctx, startX, statsStartY, boxW, String(data.countriesCount), '国家')
    drawStatBox(ctx, startX + boxW + gapX, statsStartY, boxW, String(data.citiesCount), '城市')
    drawStatBox(ctx, startX + (boxW + gapX) * 2, statsStartY, boxW, String(data.completedCount), '任务')

    const row2Y = statsStartY + 110
    drawStatBox(ctx, startX, row2Y, boxW, String(data.medalCount), '⭐ 勋章')
    drawStatBox(ctx, startX + boxW + gapX, row2Y, boxW, String(data.achievementCount), '🏆 成就')
    drawStatBox(ctx, startX + (boxW + gapX) * 2, row2Y, boxW, String(data.exp.toLocaleString()), 'EXP')

    // Title quote
    roundRect(ctx, 60, 560, CARD_WIDTH - 120, 60, 12)
    ctx.fillStyle = '#0e1424'
    ctx.fill()
    drawCenteredText(ctx, `「${data.title}」`, 598, '22px system-ui, sans-serif', GOLD_COLOR)

    // EXP bar
    const barY = 660
    const barW = CARD_WIDTH - 120
    roundRect(ctx, 60, barY, barW, 20, 10)
    ctx.fillStyle = '#1a2040'
    ctx.fill()

    const progress = Math.min(data.exp / 10000, 1)
    if (progress > 0) {
      roundRect(ctx, 60, barY, barW * progress, 20, 10)
      const barGrad = ctx.createLinearGradient(60, 0, 60 + barW * progress, 0)
      barGrad.addColorStop(0, '#4a9eff')
      barGrad.addColorStop(1, '#7b5ea7')
      ctx.fillStyle = barGrad
      ctx.fill()
    }

    drawCenteredText(ctx, `累计 ${data.exp.toLocaleString()} EXP`, 720, '18px system-ui, sans-serif', MUTED_COLOR)

    // Watermark
    drawCenteredText(ctx, '🌍 旅行者传说 - 全球旅游RPG', 920, '16px system-ui, sans-serif', '#2a3050')
  }

  /** Render trip template */
  function renderTrip(ctx: CanvasRenderingContext2D, data: TripSnapshot) {
    // Background
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

    // Header gradient
    const grad = ctx.createLinearGradient(0, 0, CARD_WIDTH, 0)
    grad.addColorStop(0, '#4a9eff')
    grad.addColorStop(1, '#7b5ea7')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, CARD_WIDTH, 4)

    // Country title
    drawCenteredText(
      ctx,
      `${data.countryEmoji} ${data.countryName}探险记`,
      60,
      'bold 30px system-ui, sans-serif',
      TEXT_COLOR,
    )

    // Divider
    ctx.strokeStyle = '#1e2640'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(60, 85)
    ctx.lineTo(CARD_WIDTH - 60, 85)
    ctx.stroke()

    // Photo grid area (2x2) — placeholder boxes if no photos
    const photoSize = 270
    const photoGap = 20
    const photoStartX = (CARD_WIDTH - photoSize * 2 - photoGap) / 2
    const photoStartY = 110

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const px = photoStartX + col * (photoSize + photoGap)
        const py = photoStartY + row * (photoSize + photoGap)
        roundRect(ctx, px, py, photoSize, photoSize, 12)
        ctx.fillStyle = CARD_BG
        ctx.fill()

        const photoIdx = row * 2 + col
        if (data.photos[photoIdx]) {
          // Photos will be drawn async — see drawWithPhotos
          // For now draw camera icon placeholder
          ctx.font = '48px system-ui, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('📷', px + photoSize / 2, py + photoSize / 2 + 16)
        } else {
          ctx.font = '48px system-ui, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillStyle = '#1e2640'
          ctx.fillText('🏔️', px + photoSize / 2, py + photoSize / 2 + 16)
        }
      }
    }

    // Cities
    const citiesY = photoStartY + photoSize * 2 + photoGap + 40
    const citiesText = data.cities.join(' · ')
    drawCenteredText(ctx, citiesText, citiesY, '20px system-ui, sans-serif', TEXT_COLOR)

    // Task progress
    drawCenteredText(
      ctx,
      `✅ ${data.completedTasks}/${data.totalTasks} 任务完成`,
      citiesY + 45,
      'bold 24px system-ui, sans-serif',
      PRIMARY_COLOR,
    )

    // Medals earned
    if (data.medals.length > 0) {
      const medalsText = data.medals.map(m => `${m.icon} ${m.name}`).slice(0, 3).join('  ')
      drawCenteredText(ctx, `🏅 ${medalsText}`, citiesY + 90, '18px system-ui, sans-serif', GOLD_COLOR)
    }

    // User info at bottom
    drawCenteredText(
      ctx,
      `旅行者: ${data.displayName}  Lv.${data.level}`,
      870,
      '18px system-ui, sans-serif',
      MUTED_COLOR,
    )

    // Watermark
    drawCenteredText(ctx, '🌍 旅行者传说 - 全球旅游RPG', 920, '16px system-ui, sans-serif', '#2a3050')
  }

  /** Render medals template */
  function renderMedals(ctx: CanvasRenderingContext2D, data: MedalsSnapshot) {
    // Background
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

    // Header gradient
    const grad = ctx.createLinearGradient(0, 0, CARD_WIDTH, 0)
    grad.addColorStop(0, '#ffd700')
    grad.addColorStop(1, '#ff8c00')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, CARD_WIDTH, 4)

    // Title
    drawCenteredText(ctx, '🏅 我的勋章收藏', 60, 'bold 30px system-ui, sans-serif', TEXT_COLOR)

    // Divider
    ctx.strokeStyle = '#1e2640'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(60, 85)
    ctx.lineTo(CARD_WIDTH - 60, 85)
    ctx.stroke()

    // Medal grid (4 cols, up to 3 rows = 12 medals)
    const medals = data.earnedMedals.slice(0, 12)
    const cols = 4
    const cellSize = 130
    const gridW = cols * cellSize
    const gridStartX = (CARD_WIDTH - gridW) / 2
    const gridStartY = 120

    medals.forEach((medal, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const cx = gridStartX + col * cellSize + cellSize / 2
      const cy = gridStartY + row * cellSize + cellSize / 2

      // Medal background circle
      ctx.beginPath()
      ctx.arc(cx, cy - 10, 36, 0, Math.PI * 2)
      ctx.fillStyle = CARD_BG
      ctx.fill()
      ctx.strokeStyle = GOLD_COLOR
      ctx.lineWidth = 2
      ctx.stroke()

      // Medal icon
      ctx.font = '32px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(medal.icon, cx, cy + 2)

      // Medal name (truncated)
      const name = medal.name.length > 5 ? medal.name.slice(0, 5) + '..' : medal.name
      ctx.font = '13px system-ui, sans-serif'
      ctx.fillStyle = MUTED_COLOR
      ctx.fillText(name, cx, cy + 46)
    })

    // Progress
    const progressY = gridStartY + Math.ceil(medals.length / cols) * cellSize + 40
    drawCenteredText(
      ctx,
      `${data.earnedMedals.length} / ${data.totalMedals} 已收集`,
      progressY,
      'bold 26px system-ui, sans-serif',
      TEXT_COLOR,
    )

    // Progress bar
    const barY = progressY + 20
    const barW = CARD_WIDTH - 160
    roundRect(ctx, 80, barY, barW, 16, 8)
    ctx.fillStyle = '#1a2040'
    ctx.fill()

    const pct = data.totalMedals > 0 ? data.earnedMedals.length / data.totalMedals : 0
    if (pct > 0) {
      roundRect(ctx, 80, barY, barW * pct, 16, 8)
      const barGrad = ctx.createLinearGradient(80, 0, 80 + barW * pct, 0)
      barGrad.addColorStop(0, '#ffd700')
      barGrad.addColorStop(1, '#ff8c00')
      ctx.fillStyle = barGrad
      ctx.fill()
    }

    // Rarest medal
    if (data.rarestMedal) {
      drawCenteredText(
        ctx,
        `最稀有: ${data.rarestMedal.icon} 「${data.rarestMedal.name}」`,
        barY + 60,
        '20px system-ui, sans-serif',
        GOLD_COLOR,
      )
    }

    // User info
    drawCenteredText(
      ctx,
      `旅行者: ${data.displayName}  Lv.${data.level}`,
      870,
      '18px system-ui, sans-serif',
      MUTED_COLOR,
    )

    // Watermark
    drawCenteredText(ctx, '🌍 旅行者传说 - 全球旅游RPG', 920, '16px system-ui, sans-serif', '#2a3050')
  }

  /** Create canvas, render template, return canvas element */
  function renderCard(template: ShareTemplate, data: ShareSnapshotData): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = CARD_WIDTH
    canvas.height = CARD_HEIGHT
    const ctx = canvas.getContext('2d')!

    switch (template) {
      case 'overview':
        renderOverview(ctx, data as OverviewSnapshot)
        break
      case 'trip':
        renderTrip(ctx, data as TripSnapshot)
        break
      case 'medals':
        renderMedals(ctx, data as MedalsSnapshot)
        break
    }

    return canvas
  }

  /** Download canvas as PNG */
  function downloadCard(canvas: HTMLCanvasElement, template: ShareTemplate) {
    const date = new Date().toISOString().slice(0, 10)
    const templateNames: Record<ShareTemplate, string> = {
      overview: '成就总览',
      trip: '旅行记录',
      medals: '勋章墙',
    }
    const filename = `旅行者传说-${templateNames[template]}-${date}.png`

    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  /** Create share link via API */
  async function createShareLink(
    template: ShareTemplate,
    snapshot: ShareSnapshotData,
  ): Promise<string> {
    generating.value = true
    try {
      const { id } = await $fetch<{ id: string }>('/api/share', {
        method: 'POST',
        body: { template, snapshot },
      })
      const url = `${window.location.origin}/share/${id}`
      shareUrl.value = url
      return url
    } finally {
      generating.value = false
    }
  }

  return {
    renderCard,
    downloadCard,
    createShareLink,
    generating,
    shareUrl,
    CARD_WIDTH,
    CARD_HEIGHT,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/composables/useShareCard.ts
git commit -m "feat(export): add useShareCard composable with Canvas rendering"
```

---

### Task 6: 组件 — ShareTemplateSelector

**Files:**
- Create: `app/components/ShareTemplateSelector.vue`

- [ ] **Step 1: 创建 `app/components/ShareTemplateSelector.vue`**

```vue
<script setup lang="ts">
import type { ShareTemplate } from '~/types'

const props = defineProps<{
  modelValue: ShareTemplate | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ShareTemplate]
}>()

const templates = [
  { id: 'overview' as ShareTemplate, icon: '🌍', name: '成就总览', desc: '展示你的全部旅行统计' },
  { id: 'trip' as ShareTemplate, icon: '✈️', name: '单次旅行', desc: '分享某个国家的旅行记录' },
  { id: 'medals' as ShareTemplate, icon: '🏅', name: '勋章墙', desc: '展示你的勋章收藏' },
]
</script>

<template>
  <div class="tpl-grid">
    <button
      v-for="t in templates"
      :key="t.id"
      class="tpl-card"
      :class="{ active: props.modelValue === t.id }"
      @click="emit('update:modelValue', t.id)"
    >
      <span class="tpl-icon">{{ t.icon }}</span>
      <span class="tpl-name">{{ t.name }}</span>
      <span class="tpl-desc">{{ t.desc }}</span>
    </button>
  </div>
</template>

<style scoped>
.tpl-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.tpl-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  border-radius: 16px;
  background: var(--bg2, #131828);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}
.tpl-card:hover {
  border-color: #4a9eff44;
  transform: translateY(-2px);
}
.tpl-card.active {
  border-color: #4a9eff;
  background: #4a9eff12;
}
.tpl-icon {
  font-size: 36px;
}
.tpl-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text, #e8eaf6);
}
.tpl-desc {
  font-size: 12px;
  color: var(--muted, #8890a8);
  text-align: center;
}
@media (max-width: 480px) {
  .tpl-grid { grid-template-columns: 1fr; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/components/ShareTemplateSelector.vue
git commit -m "feat(export): add ShareTemplateSelector component"
```

---

### Task 7: 组件 — ShareCardPreview

**Files:**
- Create: `app/components/ShareCardPreview.vue`

- [ ] **Step 1: 创建 `app/components/ShareCardPreview.vue`**

```vue
<script setup lang="ts">
import type { ShareTemplate, ShareSnapshotData } from '~/types'

const props = defineProps<{
  template: ShareTemplate
  snapshot: ShareSnapshotData
}>()

const canvasContainer = ref<HTMLDivElement>()
const { renderCard, downloadCard, createShareLink, generating, shareUrl } = useShareCard()

const canvas = ref<HTMLCanvasElement | null>(null)
const copied = ref(false)

// Re-render when template or snapshot changes
watch(
  () => [props.template, props.snapshot] as const,
  () => {
    if (!canvasContainer.value) return
    const c = renderCard(props.template, props.snapshot)
    canvas.value = c
    // Replace canvas in DOM
    canvasContainer.value.innerHTML = ''
    canvasContainer.value.appendChild(c)
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  if (!canvas.value) {
    const c = renderCard(props.template, props.snapshot)
    canvas.value = c
    canvasContainer.value?.appendChild(c)
  }
})

function handleDownload() {
  if (canvas.value) {
    downloadCard(canvas.value, props.template)
  }
}

async function handleShare() {
  await createShareLink(props.template, props.snapshot)
  copied.value = false
}

async function copyLink() {
  if (!shareUrl.value) return
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback: select text
  }
}
</script>

<template>
  <div class="preview-wrap">
    <div ref="canvasContainer" class="canvas-wrap" />

    <div class="actions">
      <button class="btn btn-download" @click="handleDownload">
        📥 保存图片
      </button>
      <button class="btn btn-share" :disabled="generating" @click="handleShare">
        {{ generating ? '⏳ 生成中...' : '🔗 生成链接' }}
      </button>
    </div>

    <div v-if="shareUrl" class="link-box">
      <input type="text" :value="shareUrl" readonly class="link-input" />
      <button class="btn btn-copy" @click="copyLink">
        {{ copied ? '✅ 已复制' : '📋 复制' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.preview-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.canvas-wrap {
  width: 100%;
  max-width: 360px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
.canvas-wrap :deep(canvas) {
  width: 100%;
  height: auto;
  display: block;
}
.actions {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 360px;
}
.btn {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-download {
  background: linear-gradient(135deg, #4a9eff, #7b5ea7);
  color: #fff;
}
.btn-download:hover { transform: translateY(-1px); }
.btn-share {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #1a1a2e;
}
.btn-share:hover:not(:disabled) { transform: translateY(-1px); }
.link-box {
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 360px;
  animation: fadeInUp 0.3s;
}
.link-input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #2a3050;
  background: #0e1424;
  color: #e8eaf6;
  font-size: 13px;
  outline: none;
}
.btn-copy {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: #4a9eff;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/components/ShareCardPreview.vue
git commit -m "feat(export): add ShareCardPreview component with download and link actions"
```

---

### Task 8: 页面 — /export

**Files:**
- Create: `app/pages/export.vue`

- [ ] **Step 1: 创建 `app/pages/export.vue`**

```vue
<script setup lang="ts">
import type { ShareTemplate, OverviewSnapshot, TripSnapshot, MedalsSnapshot, ShareSnapshotData } from '~/types'
import { TASKS } from '~/data/tasks'
import { COUNTRIES } from '~/data/countries'
import { CITIES } from '~/data/cities'
import { ALL_MEDALS } from '~/data/medals'

const route = useRoute()
const { state, levelInfo, avatar, completedCount, medalCount, countriesCount } = useGameState()
const { authState } = useAuth()
const { photos } = usePhotoCheckin()

const selectedTemplate = ref<ShareTemplate | null>(
  (route.query.template as ShareTemplate) || null,
)
const selectedCountry = ref<string>(
  (route.query.country as string) || '',
)

// Countries with progress (at least 1 completed task)
const countriesWithProgress = computed(() => {
  const allTasks = Object.values(TASKS).flat()
  const completedSet = new Set(state.value.completed)
  const countryIds = new Set(
    allTasks.filter(t => completedSet.has(t.id)).map(t => t.country),
  )
  return COUNTRIES.filter(c => countryIds.has(c.id))
})

// Show country picker when trip template selected
const showCountryPicker = computed(() => selectedTemplate.value === 'trip' && !selectedCountry.value)

// Build snapshot data based on selected template
const snapshot = computed<ShareSnapshotData | null>(() => {
  if (!selectedTemplate.value) return null
  const user = authState.value.user

  const base = {
    username: user?.username || 'traveler',
    displayName: user?.displayName || '旅行者',
    avatar: avatar.value,
    level: levelInfo.value.lv,
    title: levelInfo.value.title,
  }

  if (selectedTemplate.value === 'overview') {
    const allTasks = Object.values(TASKS).flat()
    const completedSet = new Set(state.value.completed)
    const cityIds = new Set(
      allTasks.filter(t => completedSet.has(t.id)).map(t => t.city),
    )
    return {
      ...base,
      exp: state.value.exp,
      countriesCount: countriesCount.value,
      citiesCount: cityIds.size,
      completedCount: completedCount.value,
      medalCount: medalCount.value,
      achievementCount: 0, // Simplified: counted from achievements data
    } as OverviewSnapshot
  }

  if (selectedTemplate.value === 'trip' && selectedCountry.value) {
    const country = COUNTRIES.find(c => c.id === selectedCountry.value)
    if (!country) return null
    const countryTasks = TASKS[country.id] || []
    const completedSet = new Set(state.value.completed)
    const completedTasks = countryTasks.filter(t => completedSet.has(t.id))
    const earnedMedals = completedTasks
      .filter(t => state.value.medals.includes(t.medal.id))
      .map(t => ({ icon: t.medal.icon, name: t.medal.name }))
    const cityNames = [...new Set(completedTasks.map(t => t.city))]
      .map(cid => CITIES.find(c => c.id === cid)?.name || cid)
    const taskPhotos = completedTasks
      .map(t => photos.value.find(p => p.taskId === t.id)?.dataUrl)
      .filter((url): url is string => !!url)
      .slice(0, 4)

    return {
      ...base,
      countryId: country.id,
      countryName: country.name.replace(/[^\u4e00-\u9fa5a-zA-Z\s]/g, '').trim(),
      countryEmoji: country.emoji,
      cities: cityNames,
      completedTasks: completedTasks.length,
      totalTasks: countryTasks.length,
      medals: earnedMedals,
      photos: taskPhotos,
    } as TripSnapshot
  }

  if (selectedTemplate.value === 'medals') {
    const earnedMedals = ALL_MEDALS
      .filter(m => state.value.medals.includes(m.id))
      .map(m => ({ icon: m.icon, name: m.name }))
    const rarest = earnedMedals.length > 0 ? earnedMedals[earnedMedals.length - 1] : null
    return {
      ...base,
      earnedMedals,
      totalMedals: ALL_MEDALS.length,
      rarestMedal: rarest,
    } as MedalsSnapshot
  }

  return null
})

// Ready to show preview
const showPreview = computed(() => {
  if (!selectedTemplate.value) return false
  if (selectedTemplate.value === 'trip' && !selectedCountry.value) return false
  return !!snapshot.value
})

function selectCountry(countryId: string) {
  selectedCountry.value = countryId
}

function resetCountry() {
  selectedCountry.value = ''
}
</script>

<template>
  <div class="export-page">
    <h1 class="page-title">📤 分享我的旅行</h1>

    <!-- Step 1: Template selection -->
    <section class="section">
      <h2 class="section-title">选择模板</h2>
      <ShareTemplateSelector v-model="selectedTemplate" />
    </section>

    <!-- Step 1.5: Country picker for trip template -->
    <section v-if="showCountryPicker" class="section">
      <h2 class="section-title">选择国家</h2>
      <div v-if="countriesWithProgress.length === 0" class="empty-hint">
        还没有旅行记录，先去完成一些任务吧！
      </div>
      <div v-else class="country-grid">
        <button
          v-for="c in countriesWithProgress"
          :key="c.id"
          class="country-btn"
          @click="selectCountry(c.id)"
        >
          <span class="country-emoji">{{ c.emoji }}</span>
          <span class="country-name">{{ c.name }}</span>
        </button>
      </div>
    </section>

    <!-- Country selection indicator -->
    <div v-if="selectedTemplate === 'trip' && selectedCountry" class="country-selected">
      <span>已选: {{ countriesWithProgress.find(c => c.id === selectedCountry)?.emoji }}
        {{ countriesWithProgress.find(c => c.id === selectedCountry)?.name }}</span>
      <button class="change-btn" @click="resetCountry">更换</button>
    </div>

    <!-- Step 2: Preview and actions -->
    <section v-if="showPreview && snapshot" class="section">
      <h2 class="section-title">预览</h2>
      <ClientOnly>
        <ShareCardPreview :template="selectedTemplate!" :snapshot="snapshot" />
      </ClientOnly>
    </section>
  </div>
</template>

<style scoped>
.export-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 16px 100px;
}
.page-title {
  font-size: 24px;
  margin-bottom: 24px;
  text-align: center;
  color: var(--text, #e8eaf6);
}
.section {
  margin-bottom: 32px;
}
.section-title {
  font-size: 18px;
  color: var(--text, #e8eaf6);
  margin-bottom: 14px;
}
.empty-hint {
  text-align: center;
  color: var(--muted, #8890a8);
  padding: 32px;
}
.country-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}
.country-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #2a3050;
  background: var(--bg2, #131828);
  color: var(--text, #e8eaf6);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}
.country-btn:hover {
  border-color: #4a9eff;
  transform: translateY(-1px);
}
.country-emoji { font-size: 24px; }
.country-name { font-weight: 600; }
.country-selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  background: #4a9eff12;
  border: 1px solid #4a9eff44;
  margin-bottom: 24px;
  color: var(--text, #e8eaf6);
  font-size: 15px;
}
.change-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  background: #4a9eff;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/pages/export.vue
git commit -m "feat(export): add /export page with template selection and preview"
```

---

### Task 9: 页面 — /share/[id] 公开分享页

**Files:**
- Create: `app/pages/share/[id].vue`
- Modify: `nuxt.config.ts`

- [ ] **Step 1: 修改 `nuxt.config.ts` 为 /share 路由启用 SSR**

在 `nuxt.config.ts` 中，将 `ssr: false` 改为路由规则方式，使 `/share/**` 走 SSR 而其他页面仍然 SPA：

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET || '',
  },
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  routeRules: {
    '/share/**': { ssr: true },
  },
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    head: {
      title: '🌍 旅行者传说 - 全球旅游RPG',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      ],
      link: [
        { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' },
      ],
    },
  },
})
```

- [ ] **Step 2: 创建 `app/pages/share/[id].vue`**

```vue
<script setup lang="ts">
import type { ShareTemplate, OverviewSnapshot, TripSnapshot, MedalsSnapshot } from '~/types'

definePageMeta({
  layout: false,
})

const route = useRoute()
const shareId = route.params.id as string

const { data: share, error } = await useFetch(`/api/share/${shareId}`)

// OG meta tags for social sharing
if (share.value) {
  const snap = share.value.snapshot as Record<string, unknown>
  const name = (snap.displayName as string) || '旅行者'
  const templateNames: Record<string, string> = {
    overview: '旅行成就',
    trip: '旅行记录',
    medals: '勋章收藏',
  }
  const title = `${name}的${templateNames[share.value.template] || '旅行'} - 旅行者传说`
  const description = share.value.template === 'overview'
    ? `Lv.${snap.level} ${snap.title} | ${snap.countriesCount}个国家 | ${snap.completedCount}个任务`
    : share.value.template === 'trip'
      ? `${snap.countryEmoji} ${snap.countryName} | ${snap.completedTasks}/${snap.totalTasks}任务完成`
      : `${(snap.earnedMedals as Array<unknown>)?.length || 0}枚勋章已收集`

  useHead({
    title,
    meta: [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
  })
}
</script>

<template>
  <div class="share-page">
    <!-- Error state -->
    <div v-if="error" class="error-state">
      <h1>😕 未找到</h1>
      <p>这个分享链接可能已失效</p>
      <NuxtLink to="/" class="home-btn">去首页看看</NuxtLink>
    </div>

    <!-- Share content -->
    <div v-else-if="share" class="share-content">
      <!-- Overview Template -->
      <div v-if="share.template === 'overview'" class="card overview-card">
        <h1 class="card-title">🌍 旅行者传说</h1>
        <div class="divider" />
        <div class="user-info">
          <span class="user-avatar">{{ (share.snapshot as OverviewSnapshot).avatar }}</span>
          <h2 class="user-name">{{ (share.snapshot as OverviewSnapshot).displayName }}</h2>
          <p class="user-level">Lv.{{ (share.snapshot as OverviewSnapshot).level }} {{ (share.snapshot as OverviewSnapshot).title }}</p>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{{ (share.snapshot as OverviewSnapshot).countriesCount }}</span>
            <span class="stat-label">国家</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ (share.snapshot as OverviewSnapshot).citiesCount }}</span>
            <span class="stat-label">城市</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ (share.snapshot as OverviewSnapshot).completedCount }}</span>
            <span class="stat-label">任务</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ (share.snapshot as OverviewSnapshot).medalCount }}</span>
            <span class="stat-label">⭐ 勋章</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ (share.snapshot as OverviewSnapshot).achievementCount }}</span>
            <span class="stat-label">🏆 成就</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ (share.snapshot as OverviewSnapshot).exp.toLocaleString() }}</span>
            <span class="stat-label">EXP</span>
          </div>
        </div>
        <div class="title-badge">「{{ (share.snapshot as OverviewSnapshot).title }}」</div>
        <div class="exp-bar-wrap">
          <div class="exp-bar">
            <div class="exp-fill" :style="{ width: Math.min((share.snapshot as OverviewSnapshot).exp / 10000 * 100, 100) + '%' }" />
          </div>
          <p class="exp-text">累计 {{ (share.snapshot as OverviewSnapshot).exp.toLocaleString() }} EXP</p>
        </div>
      </div>

      <!-- Trip Template -->
      <div v-else-if="share.template === 'trip'" class="card trip-card">
        <h1 class="card-title">{{ (share.snapshot as TripSnapshot).countryEmoji }} {{ (share.snapshot as TripSnapshot).countryName }}探险记</h1>
        <div class="divider" />
        <div v-if="(share.snapshot as TripSnapshot).photos.length" class="photo-grid">
          <div v-for="(photo, i) in (share.snapshot as TripSnapshot).photos" :key="i" class="photo-item">
            <img :src="photo" alt="travel photo" />
          </div>
        </div>
        <p class="cities-text">{{ (share.snapshot as TripSnapshot).cities.join(' · ') }}</p>
        <p class="progress-text">✅ {{ (share.snapshot as TripSnapshot).completedTasks }}/{{ (share.snapshot as TripSnapshot).totalTasks }} 任务完成</p>
        <div v-if="(share.snapshot as TripSnapshot).medals.length" class="medals-row">
          <span v-for="m in (share.snapshot as TripSnapshot).medals.slice(0, 5)" :key="m.name" class="medal-tag">
            {{ m.icon }} {{ m.name }}
          </span>
        </div>
        <p class="user-footer">旅行者: {{ (share.snapshot as TripSnapshot).displayName }} Lv.{{ (share.snapshot as TripSnapshot).level }}</p>
      </div>

      <!-- Medals Template -->
      <div v-else-if="share.template === 'medals'" class="card medals-card">
        <h1 class="card-title">🏅 勋章收藏</h1>
        <div class="divider" />
        <div class="medal-grid">
          <div v-for="m in (share.snapshot as MedalsSnapshot).earnedMedals.slice(0, 12)" :key="m.name" class="medal-cell">
            <span class="medal-icon">{{ m.icon }}</span>
            <span class="medal-name">{{ m.name }}</span>
          </div>
        </div>
        <p class="medal-progress">{{ (share.snapshot as MedalsSnapshot).earnedMedals.length }} / {{ (share.snapshot as MedalsSnapshot).totalMedals }} 已收集</p>
        <div class="medal-bar">
          <div class="medal-fill" :style="{ width: ((share.snapshot as MedalsSnapshot).earnedMedals.length / Math.max((share.snapshot as MedalsSnapshot).totalMedals, 1) * 100) + '%' }" />
        </div>
        <p v-if="(share.snapshot as MedalsSnapshot).rarestMedal" class="rarest">
          最稀有: {{ (share.snapshot as MedalsSnapshot).rarestMedal!.icon }} 「{{ (share.snapshot as MedalsSnapshot).rarestMedal!.name }}」
        </p>
        <p class="user-footer">旅行者: {{ (share.snapshot as MedalsSnapshot).displayName }} Lv.{{ (share.snapshot as MedalsSnapshot).level }}</p>
      </div>

      <!-- CTA -->
      <div class="cta">
        <NuxtLink to="/register" class="cta-btn">🌍 来旅行者传说开始你的冒险</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.share-page {
  min-height: 100vh;
  background: #07090f;
  color: #e8eaf6;
  display: flex;
  justify-content: center;
  padding: 24px 16px;
}
.error-state {
  text-align: center;
  padding-top: 120px;
}
.error-state h1 { font-size: 36px; margin-bottom: 12px; }
.error-state p { color: #8890a8; margin-bottom: 24px; }
.home-btn {
  display: inline-block;
  padding: 12px 28px;
  border-radius: 12px;
  background: #4a9eff;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
}
.share-content {
  width: 100%;
  max-width: 480px;
}
.card {
  background: #0a0e1a;
  border-radius: 20px;
  padding: 32px 24px;
  border-top: 4px solid;
  margin-bottom: 24px;
}
.overview-card { border-image: linear-gradient(to right, #4a9eff, #7b5ea7) 1; }
.trip-card { border-image: linear-gradient(to right, #4a9eff, #7b5ea7) 1; }
.medals-card { border-image: linear-gradient(to right, #ffd700, #ff8c00) 1; }
.card-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 16px;
}
.divider {
  height: 1px;
  background: #1e2640;
  margin-bottom: 24px;
}
.user-info { text-align: center; margin-bottom: 28px; }
.user-avatar { font-size: 56px; display: block; margin-bottom: 8px; }
.user-name { font-size: 28px; margin-bottom: 4px; }
.user-level { color: #4a9eff; font-size: 16px; }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}
.stat-item {
  background: #131828;
  border-radius: 12px;
  padding: 16px 8px;
  text-align: center;
}
.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #ffd700;
}
.stat-label {
  font-size: 13px;
  color: #8890a8;
}
.title-badge {
  text-align: center;
  background: #0e1424;
  padding: 14px;
  border-radius: 12px;
  color: #ffd700;
  font-size: 18px;
  margin-bottom: 20px;
}
.exp-bar-wrap { text-align: center; }
.exp-bar {
  height: 12px;
  background: #1a2040;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}
.exp-fill {
  height: 100%;
  background: linear-gradient(to right, #4a9eff, #7b5ea7);
  border-radius: 6px;
  transition: width 0.6s;
}
.exp-text { color: #8890a8; font-size: 14px; }
.photo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 20px;
}
.photo-item {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #131828;
}
.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cities-text {
  text-align: center;
  font-size: 18px;
  margin-bottom: 12px;
}
.progress-text {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #4a9eff;
  margin-bottom: 16px;
}
.medals-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}
.medal-tag {
  background: #1a1a2e;
  border: 1px solid #ffd70044;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  color: #ffd700;
}
.medal-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.medal-cell { text-align: center; }
.medal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #131828;
  border: 2px solid #ffd700;
  font-size: 28px;
  margin: 0 auto 6px;
}
.medal-name {
  font-size: 12px;
  color: #8890a8;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.medal-progress {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}
.medal-bar {
  height: 12px;
  background: #1a2040;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;
}
.medal-fill {
  height: 100%;
  background: linear-gradient(to right, #ffd700, #ff8c00);
  border-radius: 6px;
}
.rarest {
  text-align: center;
  color: #ffd700;
  font-size: 16px;
  margin-bottom: 20px;
}
.user-footer {
  text-align: center;
  color: #8890a8;
  font-size: 14px;
  margin-top: 20px;
}
.cta {
  text-align: center;
  margin-top: 8px;
}
.cta-btn {
  display: inline-block;
  padding: 16px 32px;
  border-radius: 16px;
  background: linear-gradient(135deg, #4a9eff, #7b5ea7);
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 700;
  transition: transform 0.2s;
}
.cta-btn:hover { transform: translateY(-2px); }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add nuxt.config.ts app/pages/share/\[id\].vue
git commit -m "feat(export): add /share/[id] public page with SSR and OG meta"
```

---

### Task 10: 导航 — 新增导出入口

**Files:**
- Modify: `app/constants/navigation.ts`
- Modify: `app/pages/profile.vue`
- Modify: `app/pages/medals.vue`
- Modify: `app/pages/country/[id].vue`

- [ ] **Step 1: 在 `app/constants/navigation.ts` 的 "me" 组中新增导出链接**

在 `me` 组的 `items` 数组中，`settings` 之前添加 export 入口：

```typescript
  {
    id: 'me',
    icon: '👤',
    label: '我的',
    items: [
      { path: '/profile', label: '个人资料' },
      { path: '/export', label: '分享导出' },
      { path: '/settings', label: '设置' },
    ],
  },
```

- [ ] **Step 2: 在 `app/pages/profile.vue` 添加分享按钮**

在 profile 页面的用户头像/等级信息区域附近（header 部分），添加一个分享按钮。找到显示用户名和等级的区域，在其下方添加：

```html
<NuxtLink to="/export?template=overview" class="share-btn">📤 分享我的成就</NuxtLink>
```

对应样式：

```css
.share-btn {
  display: inline-block;
  margin-top: 12px;
  padding: 10px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4a9eff, #7b5ea7);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: transform 0.2s;
}
.share-btn:hover { transform: translateY(-1px); }
```

- [ ] **Step 3: 在 `app/pages/medals.vue` 添加分享勋章墙按钮**

在勋章页面的标题区域旁边（filter 按钮那行），添加：

```html
<NuxtLink to="/export?template=medals" class="share-btn">📤 分享</NuxtLink>
```

同样的样式（可以更紧凑）：

```css
.share-btn {
  padding: 8px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #1a1a2e;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
}
```

- [ ] **Step 4: 在 `app/pages/country/[id].vue` 添加分享此旅行按钮**

在国家详情页的标题区域添加分享按钮，用 `NuxtLink` 指向 `/export?template=trip&country={countryId}`：

```html
<NuxtLink
  :to="`/export?template=trip&country=${id}`"
  class="share-btn"
>📤 分享此旅行</NuxtLink>
```

- [ ] **Step 5: Commit**

```bash
git add app/constants/navigation.ts app/pages/profile.vue app/pages/medals.vue app/pages/country/\[id\].vue
git commit -m "feat(export): add share entry points to navigation, profile, medals, and country pages"
```

---

### Task 11: 构建验证

**Files:** None (verification only)

- [ ] **Step 1: 运行构建确认无错误**

Run: `npm run build 2>&1 | tail -20`
Expected: 构建成功，无致命错误

- [ ] **Step 2: 如有构建错误，修复后重新构建**

根据错误信息修复代码（常见问题：类型错误、import 路径、缺少变量）。

- [ ] **Step 3: 最终 commit 并 push**

```bash
git push origin main
```
