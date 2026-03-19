<template>
  <div class="game-panel">
    <h3>💰 汇率挑战</h3>
    <p>看当地价格猜人民币价格，出国消费心里有数！</p>

    <template v-if="!finished">
      <div class="cg-progress">
        <span>第 {{ round + 1 }} / 10 题</span>
        <span>得分：{{ score }} EXP</span>
      </div>

      <div class="cg-item">{{ currentItem.item }}</div>
      <div class="cg-price">
        {{ currentItem.price }}
        <span class="cg-currency">（{{ currentItem.currency }}）</span>
      </div>

      <div class="cg-input-area">
        <label class="cg-label">你觉得折合人民币大约多少元？</label>
        <div class="cg-input-row">
          <span class="cg-prefix">¥</span>
          <input
            v-model.number="guess"
            type="number"
            min="0"
            class="cg-input"
            placeholder="输入金额"
            :disabled="answered"
            @keyup.enter="confirmGuess"
          />
          <span class="cg-suffix">元</span>
        </div>
      </div>

      <button v-if="!answered" class="cg-confirm" :disabled="!guess && guess !== 0" @click="confirmGuess">确认</button>

      <div v-if="answered" class="cg-result" :class="resultClass">
        <div class="cg-result-label">{{ resultLabel }}</div>
        <div class="cg-result-detail">
          实际价格：<strong>¥{{ currentItem.cny }}</strong><br />
          你的猜测：¥{{ guess }}<br />
          误差：{{ errorPct }}%
        </div>
        <button class="cg-next" @click="nextRound">
          {{ round < 9 ? '下一题 →' : '查看结果' }}
        </button>
      </div>
    </template>

    <div v-else class="cg-score">
      <div class="qs-icon">{{ accurateCount >= 7 ? '🏆' : accurateCount >= 4 ? '🌟' : '📚' }}</div>
      <div class="qs-title">{{ accurateCount >= 7 ? '汇率达人！' : accurateCount >= 4 ? '还不错！' : '继续加油' }}</div>
      <div class="qs-exp">共获得 {{ score }} EXP</div>
      <div style="color: var(--muted); font-size: 14px; margin-bottom: 4px">
        精准次数：{{ accurateCount }} / 10（误差≤20%）
      </div>
      <button class="qs-restart" @click="restart">再来一轮 🔄</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { addExp, addMedal } = useGameState()

const ITEMS = [
  {item:'东京拉面一碗', price:'¥900', currency:'日元', cny:45},
  {item:'首尔烤肉套餐', price:'₩25,000', currency:'韩元', cny:130},
  {item:'曼谷街边炒面', price:'฿60', currency:'泰铢', cny:12},
  {item:'新加坡肉骨茶', price:'S$8', currency:'新加坡元', cny:42},
  {item:'巴黎牛角面包', price:'€1.5', currency:'欧元', cny:12},
  {item:'纽约地铁单程', price:'$2.90', currency:'美元', cny:21},
  {item:'伦敦炸鱼薯条', price:'£12', currency:'英镑', cny:108},
  {item:'迪拜骆驼奶', price:'AED 15', currency:'迪拉姆', cny:30},
  {item:'悉尼flat white咖啡', price:'A$5.5', currency:'澳元', cny:26},
  {item:'巴厘岛椰子水', price:'Rp 20,000', currency:'印尼盾', cny:9},
  {item:'马六甲鸡饭粒', price:'RM 8', currency:'马来西亚林吉特', cny:13},
  {item:'秘鲁羊驼围巾', price:'S/. 50', currency:'秘鲁索尔', cny:95},
  {item:'摩洛哥薄荷茶', price:'MAD 15', currency:'摩洛哥迪拉姆', cny:11},
  {item:'新西兰牛排', price:'NZ$35', currency:'新西兰元', cny:150},
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]!; a[i] = a[j]!; a[j] = tmp
  }
  return a
}

const roundItems = ref(shuffle(ITEMS).slice(0, 10))
const round = ref(0)
const score = ref(0)
const guess = ref<number>(0)
const answered = ref(false)
const finished = ref(false)
const accurateCount = ref(0)

const currentItem = computed(() => roundItems.value[round.value]!)

const errorPct = computed(() => {
  const diff = Math.abs(guess.value - currentItem.value.cny)
  return Math.round(diff / currentItem.value.cny * 100)
})

const resultLabel = computed(() => {
  if (errorPct.value <= 20) return '精准！ +20 EXP'
  if (errorPct.value <= 40) return '还行 +10 EXP'
  return '差得远 +3 EXP'
})

const resultClass = computed(() => {
  if (errorPct.value <= 20) return 'ok'
  if (errorPct.value <= 40) return 'mid'
  return 'ng'
})

function confirmGuess() {
  if (answered.value) return
  answered.value = true

  let exp = 3
  if (errorPct.value <= 20) {
    exp = 20
    accurateCount.value++
  } else if (errorPct.value <= 40) {
    exp = 10
  }

  score.value += exp
  addExp(exp)
}

function nextRound() {
  if (round.value < 9) {
    round.value++
    guess.value = 0
    answered.value = false
  } else {
    finished.value = true
    if (accurateCount.value >= 7) {
      addMedal('currency-master')
    }
  }
}

function restart() {
  roundItems.value = shuffle(ITEMS).slice(0, 10)
  round.value = 0
  score.value = 0
  guess.value = 0
  answered.value = false
  finished.value = false
  accurateCount.value = 0
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

.cg-progress {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 16px;
}

.cg-item {
  text-align: center;
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 8px;
}

.cg-price {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 24px;
}
.cg-currency {
  font-size: 14px;
  font-weight: 400;
  color: var(--muted);
}

.cg-input-area { margin-bottom: 20px }
.cg-label {
  display: block;
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 10px;
  text-align: center;
}

.cg-input-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.cg-prefix, .cg-suffix {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}

.cg-input {
  width: 140px;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg2);
  color: var(--text);
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  outline: none;
  transition: border-color .2s;
}
.cg-input:focus { border-color: var(--accent) }
.cg-input:disabled { opacity: .5; cursor: not-allowed }
/* Hide number input spinners */
.cg-input::-webkit-outer-spin-button,
.cg-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0 }
.cg-input[type=number] { -moz-appearance: textfield }

.cg-confirm {
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
.cg-confirm:hover:not(:disabled) { opacity: .9 }
.cg-confirm:disabled { opacity: .4; cursor: not-allowed }

.cg-result {
  padding: 16px;
  border-radius: 10px;
  animation: fadeInUp .3s ease;
  margin-bottom: 12px;
}
.cg-result.ok { background: #0d2d0d; border: 1px solid var(--green); color: var(--green) }
.cg-result.mid { background: #2d2a0d; border: 1px solid #f0a020; color: #f0a020 }
.cg-result.ng { background: #2d0d0d; border: 1px solid var(--red); color: var(--red) }

.cg-result-label {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 8px;
}
.cg-result-detail {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 12px;
}

.cg-next {
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

.cg-score {
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
