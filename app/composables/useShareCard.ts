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
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

    const grad = ctx.createLinearGradient(0, 0, CARD_WIDTH, 0)
    grad.addColorStop(0, '#4a9eff')
    grad.addColorStop(1, '#7b5ea7')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, CARD_WIDTH, 4)

    drawCenteredText(ctx, '🌍 旅行者传说', 60, 'bold 28px system-ui, sans-serif', TEXT_COLOR)

    ctx.strokeStyle = '#1e2640'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(60, 85)
    ctx.lineTo(CARD_WIDTH - 60, 85)
    ctx.stroke()

    ctx.font = '64px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(data.avatar, CARD_WIDTH / 2, 170)

    drawCenteredText(ctx, data.displayName, 220, 'bold 32px system-ui, sans-serif', TEXT_COLOR)
    drawCenteredText(ctx, `Lv.${data.level} ${data.title}`, 255, '20px system-ui, sans-serif', PRIMARY_COLOR)

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

    roundRect(ctx, 60, 560, CARD_WIDTH - 120, 60, 12)
    ctx.fillStyle = '#0e1424'
    ctx.fill()
    drawCenteredText(ctx, `「${data.title}」`, 598, '22px system-ui, sans-serif', GOLD_COLOR)

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
    drawCenteredText(ctx, '🌍 旅行者传说 - 全球旅游RPG', 920, '16px system-ui, sans-serif', '#2a3050')
  }

  /** Render trip template */
  function renderTrip(ctx: CanvasRenderingContext2D, data: TripSnapshot) {
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

    const grad = ctx.createLinearGradient(0, 0, CARD_WIDTH, 0)
    grad.addColorStop(0, '#4a9eff')
    grad.addColorStop(1, '#7b5ea7')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, CARD_WIDTH, 4)

    drawCenteredText(ctx, `${data.countryEmoji} ${data.countryName}探险记`, 60, 'bold 30px system-ui, sans-serif', TEXT_COLOR)

    ctx.strokeStyle = '#1e2640'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(60, 85)
    ctx.lineTo(CARD_WIDTH - 60, 85)
    ctx.stroke()

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

    const citiesY = photoStartY + photoSize * 2 + photoGap + 40
    const citiesText = data.cities.join(' · ')
    drawCenteredText(ctx, citiesText, citiesY, '20px system-ui, sans-serif', TEXT_COLOR)

    drawCenteredText(ctx, `✅ ${data.completedTasks}/${data.totalTasks} 任务完成`, citiesY + 45, 'bold 24px system-ui, sans-serif', PRIMARY_COLOR)

    if (data.medals.length > 0) {
      const medalsText = data.medals.map(m => `${m.icon} ${m.name}`).slice(0, 3).join('  ')
      drawCenteredText(ctx, `🏅 ${medalsText}`, citiesY + 90, '18px system-ui, sans-serif', GOLD_COLOR)
    }

    drawCenteredText(ctx, `旅行者: ${data.displayName}  Lv.${data.level}`, 870, '18px system-ui, sans-serif', MUTED_COLOR)
    drawCenteredText(ctx, '🌍 旅行者传说 - 全球旅游RPG', 920, '16px system-ui, sans-serif', '#2a3050')
  }

  /** Render medals template */
  function renderMedals(ctx: CanvasRenderingContext2D, data: MedalsSnapshot) {
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

    const grad = ctx.createLinearGradient(0, 0, CARD_WIDTH, 0)
    grad.addColorStop(0, '#ffd700')
    grad.addColorStop(1, '#ff8c00')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, CARD_WIDTH, 4)

    drawCenteredText(ctx, '🏅 我的勋章收藏', 60, 'bold 30px system-ui, sans-serif', TEXT_COLOR)

    ctx.strokeStyle = '#1e2640'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(60, 85)
    ctx.lineTo(CARD_WIDTH - 60, 85)
    ctx.stroke()

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

      ctx.beginPath()
      ctx.arc(cx, cy - 10, 36, 0, Math.PI * 2)
      ctx.fillStyle = CARD_BG
      ctx.fill()
      ctx.strokeStyle = GOLD_COLOR
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.font = '32px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(medal.icon, cx, cy + 2)

      const name = medal.name.length > 5 ? medal.name.slice(0, 5) + '..' : medal.name
      ctx.font = '13px system-ui, sans-serif'
      ctx.fillStyle = MUTED_COLOR
      ctx.fillText(name, cx, cy + 46)
    })

    const progressY = gridStartY + Math.ceil(medals.length / cols) * cellSize + 40
    drawCenteredText(ctx, `${data.earnedMedals.length} / ${data.totalMedals} 已收集`, progressY, 'bold 26px system-ui, sans-serif', TEXT_COLOR)

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

    if (data.rarestMedal) {
      drawCenteredText(ctx, `最稀有: ${data.rarestMedal.icon} 「${data.rarestMedal.name}」`, barY + 60, '20px system-ui, sans-serif', GOLD_COLOR)
    }

    drawCenteredText(ctx, `旅行者: ${data.displayName}  Lv.${data.level}`, 870, '18px system-ui, sans-serif', MUTED_COLOR)
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
