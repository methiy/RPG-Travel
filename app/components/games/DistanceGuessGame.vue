<template>
  <div class="game-panel">
    <h3>📏 距离猜猜猜</h3>
    <p>猜两个城市之间的飞行距离，看你的地理直觉准不准！</p>

    <template v-if="!finished">
      <div class="dg-progress">
        <span>第 {{ round + 1 }} / 8 题</span>
        <span>得分：{{ score }} EXP</span>
      </div>

      <div class="dg-route">✈️ {{ currentPair.from }} → {{ currentPair.to }}</div>

      <div class="dg-slider-area">
        <input
          type="range"
          min="0"
          max="15000"
          step="50"
          v-model.number="guess"
          class="dg-slider"
          :disabled="answered"
        />
        <div class="dg-value">{{ guess.toLocaleString() }} km</div>
      </div>

      <button v-if="!answered" class="dg-confirm" @click="confirmGuess">确认</button>

      <div v-if="answered" class="dg-result" :class="resultClass">
        <div class="dg-result-label">{{ resultLabel }}</div>
        <div class="dg-result-detail">
          实际距离：<strong>{{ currentPair.dist.toLocaleString() }} km</strong><br />
          你的猜测：{{ guess.toLocaleString() }} km<br />
          误差：{{ errorPct }}%
        </div>
        <button class="dg-next" @click="nextRound">
          {{ round < 7 ? '下一题 →' : '查看结果' }}
        </button>
      </div>
    </template>

    <div v-else class="dg-score">
      <div class="qs-icon">{{ avgError <= 15 ? '🏆' : avgError <= 25 ? '🌟' : '📚' }}</div>
      <div class="qs-title">{{ avgError <= 15 ? '距离感大师！' : avgError <= 25 ? '不错的直觉！' : '继续加油' }}</div>
      <div class="qs-exp">共获得 {{ score }} EXP</div>
      <div style="color: var(--muted); font-size: 14px; margin-bottom: 4px">
        平均误差：{{ avgError }}%
      </div>
      <button class="qs-restart" @click="restart">再来一轮 🔄</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { addExp, addMedal } = useGameState()

const PAIRS = [
  {from:'北京', to:'东京', dist:2100},
  {from:'上海', to:'首尔', dist:870},
  {from:'巴黎', to:'纽约', dist:5837},
  {from:'悉尼', to:'东京', dist:7823},
  {from:'迪拜', to:'伦敦', dist:5475},
  {from:'新加坡', to:'悉尼', dist:6288},
  {from:'开罗', to:'巴黎', dist:3214},
  {from:'里约', to:'开普敦', dist:6078},
  {from:'东京', to:'洛杉矶', dist:8815},
  {from:'北京', to:'莫斯科', dist:5800},
  {from:'曼谷', to:'巴厘岛', dist:2900},
  {from:'香港', to:'新加坡', dist:2570},
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]!; a[i] = a[j]!; a[j] = tmp
  }
  return a
}

const roundPairs = ref(shuffle(PAIRS).slice(0, 8))
const round = ref(0)
const score = ref(0)
const guess = ref(5000)
const answered = ref(false)
const finished = ref(false)
const errors = ref<number[]>([])

const currentPair = computed(() => roundPairs.value[round.value]!)

const errorPct = computed(() => {
  const diff = Math.abs(guess.value - currentPair.value.dist)
  return Math.round(diff / currentPair.value.dist * 100)
})

const resultLabel = computed(() => {
  if (errorPct.value <= 10) return '精准！ +30 EXP'
  if (errorPct.value <= 25) return '不错 +15 EXP'
  return '继续加油 +5 EXP'
})

const resultClass = computed(() => {
  if (errorPct.value <= 10) return 'ok'
  if (errorPct.value <= 25) return 'mid'
  return 'ng'
})

const avgError = computed(() => {
  if (errors.value.length === 0) return 0
  return Math.round(errors.value.reduce((a, b) => a + b, 0) / errors.value.length)
})

function confirmGuess() {
  answered.value = true
  errors.value.push(errorPct.value)

  let exp = 5
  if (errorPct.value <= 10) exp = 30
  else if (errorPct.value <= 25) exp = 15

  score.value += exp
  addExp(exp)
}

function nextRound() {
  if (round.value < 7) {
    round.value++
    guess.value = 5000
    answered.value = false
  } else {
    finished.value = true
    if (avgError.value <= 15) {
      addMedal('distance-master')
    }
  }
}

function restart() {
  roundPairs.value = shuffle(PAIRS).slice(0, 8)
  round.value = 0
  score.value = 0
  guess.value = 5000
  answered.value = false
  finished.value = false
  errors.value = []
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

.dg-progress {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 16px;
}

.dg-route {
  text-align: center;
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 28px;
  color: var(--accent);
}

.dg-slider-area {
  text-align: center;
  margin-bottom: 20px;
}

.dg-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  appearance: none;
  background: var(--bg2);
  outline: none;
  cursor: pointer;
}
.dg-slider::-webkit-slider-thumb {
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  cursor: pointer;
}
.dg-slider:disabled { opacity: .5; cursor: not-allowed }

.dg-value {
  margin-top: 10px;
  font-size: 24px;
  font-weight: 800;
  color: var(--text);
}

.dg-confirm {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity .2s;
}
.dg-confirm:hover { opacity: .9 }

.dg-result {
  padding: 16px;
  border-radius: 10px;
  animation: fadeInUp .3s ease;
  margin-bottom: 12px;
}
.dg-result.ok { background: #0d2d0d; border: 1px solid var(--green); color: var(--green) }
.dg-result.mid { background: #2d2a0d; border: 1px solid #f0a020; color: #f0a020 }
.dg-result.ng { background: #2d0d0d; border: 1px solid var(--red); color: var(--red) }

.dg-result-label {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 8px;
}
.dg-result-detail {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 12px;
}

.dg-next {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.dg-score {
  text-align: center;
  padding: 20px;
  animation: fadeInUp .4s;
}
.qs-icon { font-size: 56px; margin-bottom: 12px }
.qs-title { font-size: 22px; font-weight: 800; margin-bottom: 8px }
.qs-exp { font-size: 20px; color: var(--accent); font-weight: 700; margin-bottom: 8px }
.qs-restart {
  margin-top: 12px;
  padding: 10px 24px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px) }
  to { opacity: 1; transform: translateY(0) }
}
</style>
