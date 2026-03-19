<template>
  <div class="game-panel">
    <h3>🃏 地标配对游戏</h3>
    <p>翻牌配对全球知名地标，考验你的地理记忆力！</p>

    <div class="match-info">
      <span>翻牌次数：{{ flips }}</span>
      <span>配对：{{ matchedPairs }} / 8</span>
      <span>时间：{{ timerDisplay }}</span>
    </div>

    <div class="match-grid">
      <div
        v-for="(card, idx) in cards"
        :key="idx"
        class="match-card"
        :class="{
          flipped: card.flipped || card.matched,
          matched: card.matched,
          'wrong-flash': card.wrong,
        }"
        @click="flipCard(idx)"
      >
        {{ (card.flipped || card.matched) ? card.icon : '?' }}
      </div>
    </div>

    <div v-if="gameOver" class="match-complete">
      <div class="result-icon">🎉</div>
      <div class="result-title">恭喜完成！</div>
      <div class="result-stats">
        用时 {{ timerDisplay }}，翻了 {{ flips }} 次
      </div>
      <div class="result-exp">+60 EXP</div>
      <div v-if="timer <= 60" class="speed-medal">⚡ 获得"速度之星"奖章！</div>
      <button class="match-restart show" @click="initGame">再来一局 🔄</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LANDMARKS } from '~/data/game-data'

interface Card {
  icon: string
  name: string
  flipped: boolean
  matched: boolean
  wrong: boolean
}

const { addExp, addMedal } = useGameState()
const achievement = useAchievement()

const cards = ref<Card[]>([])
const flipped = ref<number[]>([])
const matchedPairs = ref(0)
const flips = ref(0)
const timer = ref(0)
const gameOver = ref(false)
const lockMatch = ref(false)
let timerInterval: ReturnType<typeof setInterval> | null = null

const timerDisplay = computed(() => {
  const m = Math.floor(timer.value / 60)
  const s = timer.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function initGame() {
  const pairs = LANDMARKS.map(l => [
    { icon: l.icon, name: l.name, flipped: false, matched: false, wrong: false },
    { icon: l.icon, name: l.name, flipped: false, matched: false, wrong: false },
  ]).flat()
  cards.value = shuffle(pairs)
  flipped.value = []
  matchedPairs.value = 0
  flips.value = 0
  timer.value = 0
  gameOver.value = false
  lockMatch.value = false

  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    timer.value++
  }, 1000)
}

function flipCard(idx: number) {
  if (lockMatch.value) return
  const card = cards.value[idx]
  if (card.flipped || card.matched) return

  card.flipped = true
  flipped.value.push(idx)

  if (flipped.value.length === 2) {
    flips.value++
    lockMatch.value = true
    const [a, b] = flipped.value
    const cardA = cards.value[a]
    const cardB = cards.value[b]

    if (cardA.icon === cardB.icon) {
      // Match!
      cardA.matched = true
      cardB.matched = true
      matchedPairs.value++
      flipped.value = []
      lockMatch.value = false

      if (matchedPairs.value === 8) {
        endGame()
      }
    } else {
      // No match
      cardA.wrong = true
      cardB.wrong = true
      setTimeout(() => {
        cardA.flipped = false
        cardB.flipped = false
        cardA.wrong = false
        cardB.wrong = false
        flipped.value = []
        lockMatch.value = false
      }, 800)
    }
  }
}

function endGame() {
  gameOver.value = true
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  addExp(60)

  const medalId = timer.value <= 60 ? 'match-speed' : ''
  if (timer.value <= 60) {
    addMedal('match-speed')
  }

  achievement.show({
    icon: '🃏',
    title: '配对完成！',
    sub: timer.value <= 60 ? '速度之星！60秒内完成！' : `用时 ${timerDisplay.value}`,
    exp: 60,
    medal: medalId,
  })
}

onMounted(() => {
  initGame()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.match-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 8px;
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
}

.match-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
}

.match-card {
  aspect-ratio: 1;
  background: linear-gradient(135deg, #1a2540, #0d1020);
  border: 1px solid var(--border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  cursor: pointer;
  transition: all .3s;
  user-select: none;
  min-height: 0;
}
.match-card:hover { border-color: var(--accent) }
.match-card.flipped {
  background: var(--bg3);
  border-color: var(--accent);
}
.match-card.matched {
  background: linear-gradient(135deg, #0d2d0d, #1a4a1a);
  border-color: var(--green);
  cursor: default;
}
.match-card.wrong-flash {
  border-color: var(--red);
  background: #2d0d0d;
}

.match-complete {
  text-align: center;
  padding: 16px;
  background: var(--bg3);
  border-radius: 10px;
  animation: fadeInUp .3s;
}
.match-complete .result-icon { font-size: 48px; margin-bottom: 8px }
.match-complete .result-title { font-size: 18px; font-weight: 700; margin-bottom: 6px }
.match-complete .result-stats { font-size: 13px; color: var(--muted); margin-bottom: 6px }
.match-complete .result-exp { font-size: 14px; color: var(--green); font-weight: 700; margin-bottom: 6px }
.match-complete .speed-medal { font-size: 14px; color: #ffaa33; font-weight: 700; margin-bottom: 8px }

.match-restart {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px) }
  to { opacity: 1; transform: translateY(0) }
}
</style>
