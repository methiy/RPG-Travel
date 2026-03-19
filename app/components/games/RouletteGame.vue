<template>
  <div class="game-panel">
    <h3>🎡 假期轮盘</h3>
    <p>转动命运之轮，看看你的下一个旅行目的地是哪里！</p>

    <div class="roulette-arrow">▼</div>
    <div
      ref="wheelRef"
      class="roulette-wheel"
      :style="{ transform: `rotate(${rotation}deg)` }"
    >
      <canvas ref="canvasRef" width="260" height="260" />
      <div class="wheel-center">🎲</div>
    </div>

    <button
      class="roulette-btn"
      :disabled="spinning || remainingSpins <= 0"
      @click="spin"
    >
      {{ remainingSpins <= 0 ? '今日次数已用完' : `🎲 转动轮盘（剩余 ${remainingSpins} 次）` }}
    </button>

    <div v-if="result" class="roulette-result show">
      <div class="result-dest">{{ result.flags }} {{ result.name }}</div>
      <div class="result-desc">{{ result.desc }}</div>
      <div class="result-desc" style="margin-top: 6px">最佳季节：{{ result.best }}</div>
      <button class="result-cta" @click="navigateTo('/')">查看相关任务 →</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DESTINATIONS } from '~/data/game-data'

const STORAGE_KEY = 'travelrpg2_roulette'
const MAX_SPINS = 3

const { addExp } = useGameState()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const wheelRef = ref<HTMLElement | null>(null)
const rotation = ref(0)
const spinning = ref(false)
const result = ref<typeof DESTINATIONS[number] | null>(null)

// Spin tracking
interface SpinData { date: string; spins: number }

function getSpinData(): SpinData {
  if (import.meta.server) return { date: '', spins: 0 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data: SpinData = JSON.parse(raw)
      if (data.date === new Date().toDateString()) return data
    }
  } catch {}
  return { date: new Date().toDateString(), spins: 0 }
}

function saveSpinData(data: SpinData) {
  if (import.meta.server) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const spinData = ref<SpinData>(getSpinData())
const remainingSpins = computed(() => MAX_SPINS - spinData.value.spins)

// Draw wheel on mount
onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const cx = 130, cy = 130, r = 126
  const sliceAngle = (2 * Math.PI) / DESTINATIONS.length

  DESTINATIONS.forEach((dest, i) => {
    const startAngle = i * sliceAngle
    const endAngle = startAngle + sliceAngle

    // Fill slice
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, startAngle, endAngle)
    ctx.closePath()
    ctx.fillStyle = dest.color + '33'
    ctx.fill()
    ctx.strokeStyle = dest.color
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw flag text at outer edge
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(startAngle + sliceAngle / 2)
    ctx.textAlign = 'center'
    ctx.font = '16px sans-serif'
    ctx.fillStyle = '#fff'
    ctx.fillText(dest.flags, r - 20, 5)
    ctx.restore()
  })
})

// Reload spin data on client
onMounted(() => {
  spinData.value = getSpinData()
})

function spin() {
  if (spinning.value || remainingSpins.value <= 0) return

  spinning.value = true
  result.value = null

  // Pick random destination
  const idx = Math.floor(Math.random() * DESTINATIONS.length)
  const sliceAngle = 360 / DESTINATIONS.length

  // Calculate target: 5 full rotations + position so the selected slice is at top (270 degrees offset)
  const targetSliceCenter = idx * sliceAngle + sliceAngle / 2
  const targetRotation = rotation.value + 360 * 5 + (360 - targetSliceCenter)

  rotation.value = targetRotation

  // Update spin count
  spinData.value.spins++
  saveSpinData(spinData.value)

  // Show result after spin animation
  setTimeout(() => {
    spinning.value = false
    result.value = DESTINATIONS[idx] ?? null
    addExp(15)
  }, 4200)
}
</script>

<style scoped>
.game-panel {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px;
  max-width: 600px;
  margin: 0 auto;
  animation: fadeInUp .3s ease;
}
.game-panel h3 { font-size: 18px; font-weight: 800; margin-bottom: 6px }
.game-panel > p { color: var(--muted); margin-bottom: 20px; font-size: 13px }

.roulette-wheel {
  width: 260px;
  height: 260px;
  border-radius: 50%;
  margin: 0 auto 20px;
  position: relative;
  overflow: hidden;
  border: 4px solid var(--gold);
  box-shadow: 0 0 30px rgba(255, 215, 0, .3);
  transition: transform 4s cubic-bezier(.1, .7, .1, 1);
}
.roulette-wheel canvas {
  width: 100%;
  height: 100%;
}

.wheel-center {
  position: absolute;
  inset: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: var(--bg);
  border-radius: 50%;
  border: 3px solid var(--gold);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.roulette-arrow {
  font-size: 28px;
  text-align: center;
  margin-bottom: 12px;
  color: var(--gold);
  text-shadow: 0 0 10px var(--gold);
}

.roulette-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #ffd700, #ff9500);
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: all .3s;
}
.roulette-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255, 215, 0, .4) }
.roulette-btn:disabled { opacity: .5; cursor: not-allowed; transform: none }

.roulette-result {
  text-align: center;
  padding: 20px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-top: 16px;
  animation: fadeInUp .4s ease;
}
.result-dest { font-size: 24px; font-weight: 800; color: var(--gold); margin-bottom: 6px }
.result-desc { font-size: 14px; color: var(--muted) }
.result-cta {
  margin-top: 12px;
  padding: 10px 24px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all .3s;
}
.result-cta:hover { transform: translateY(-2px) }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px) }
  to { opacity: 1; transform: translateY(0) }
}
</style>
