<template>
  <div class="game-panel">
    <h3>🧳 行李打包挑战</h3>

    <!-- Setup phase: pick destination -->
    <div v-if="phase === 'setup'" class="packing-setup">
      <p>选择你的旅行目的地：</p>
      <div class="dest-picker">
        <button
          v-for="d in PACK_DESTS"
          :key="d.id"
          class="dest-btn"
          :class="{ sel: selectedDest?.id === d.id }"
          @click="selectedDest = d"
        >
          <div class="di">{{ d.icon }}</div>
          <div class="dn">{{ d.name }}</div>
        </button>
      </div>
      <button
        class="packing-start"
        :disabled="!selectedDest"
        @click="startGame"
      >
        开始打包 🎒
      </button>
    </div>

    <!-- Game phase -->
    <div v-if="phase === 'game'" class="packing-game show">
      <h4>{{ selectedDest!.icon }} {{ selectedDest!.name }}</h4>
      <p class="pack-instructions">选择{{ selectedDest!.must.length }}件必需物品加入行李箱</p>

      <div class="suitcase">
        <span v-if="selected.length === 0" class="suitcase-empty">行李箱是空的，点击下方物品加入</span>
        <span v-for="item in selected" :key="item" class="packed-item">{{ item }}</span>
      </div>

      <div class="items-pool">
        <button
          v-for="item in shuffledItems"
          :key="item"
          class="pack-item"
          :class="{
            selected: selected.includes(item),
            'wrong-pick': wrongItems.includes(item),
          }"
          @click="pickItem(item)"
        >
          {{ item }}
        </button>
      </div>

      <button class="pack-submit" @click="submit">提交行李 ✈️</button>
    </div>

    <!-- Result phase -->
    <div v-if="phase === 'result'" class="pack-result show" :class="resultClass">
      <div class="result-icon">{{ resultIcon }}</div>
      <div class="result-title">{{ resultTitle }}</div>
      <div class="result-exp">+{{ resultExp }} EXP</div>
      <div v-if="resultClass === 'result-red'" class="correct-list">
        <p>正确答案：</p>
        <span v-for="item in selectedDest!.must" :key="item" class="correct-item">{{ item }}</span>
      </div>
      <button class="packing-start" @click="reset" style="margin-top: 12px">再来一局 🔄</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PACK_DESTS } from '~/data/game-data'
import type { PackingScenario } from '~/types'

const { addExp, addMedal } = useGameState()
const achievement = useAchievement()

const phase = ref<'setup' | 'game' | 'result'>('setup')
const selectedDest = ref<PackingScenario | null>(null)
const selected = ref<string[]>([])
const wrongItems = ref<string[]>([])
const shuffledItems = ref<string[]>([])

const resultClass = ref('')
const resultIcon = ref('')
const resultTitle = ref('')
const resultExp = ref(0)

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function startGame() {
  if (!selectedDest.value) return
  selected.value = []
  wrongItems.value = []
  shuffledItems.value = shuffle(selectedDest.value.all)
  phase.value = 'game'
}

function pickItem(item: string) {
  const dest = selectedDest.value!
  // If trap item
  if (dest.trap.includes(item)) {
    if (!wrongItems.value.includes(item)) {
      wrongItems.value.push(item)
    }
    return
  }
  // Toggle selection
  const idx = selected.value.indexOf(item)
  if (idx >= 0) {
    selected.value.splice(idx, 1)
  } else {
    selected.value.push(item)
  }
}

function submit() {
  const dest = selectedDest.value!
  const mustItems = dest.must
  const correctCount = selected.value.filter(i => mustItems.includes(i)).length
  const ratio = correctCount / mustItems.length

  if (ratio === 1 && selected.value.length === mustItems.length) {
    // Perfect
    resultClass.value = 'result-green'
    resultIcon.value = '🎉'
    resultTitle.value = '完美打包！你是打包大师！'
    resultExp.value = 80
    addExp(80)
    addMedal('packing-pro')
    achievement.show({
      icon: '🧳',
      title: '打包大师',
      sub: '完美完成行李打包挑战',
      exp: 80,
      medal: 'packing-pro',
    })
  } else if (ratio >= 0.6) {
    resultClass.value = 'result-orange'
    resultIcon.value = '👍'
    resultTitle.value = '还不错！但可以更好～'
    resultExp.value = 40
    addExp(40)
  } else {
    resultClass.value = 'result-red'
    resultIcon.value = '😅'
    resultTitle.value = '再接再厉，看看正确答案吧！'
    resultExp.value = 10
    addExp(10)
  }

  phase.value = 'result'
}

function reset() {
  phase.value = 'setup'
  selectedDest.value = null
  selected.value = []
  wrongItems.value = []
}
</script>

<style scoped>
.packing-setup { text-align: center }

.dest-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.dest-btn {
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  background: var(--bg2);
  transition: all .2s;
  text-align: center;
}
.dest-btn:hover, .dest-btn.sel {
  border-color: var(--accent);
  background: #1a2540;
}
.dest-btn .di { font-size: 24px; margin-bottom: 4px }
.dest-btn .dn { font-size: 12px; color: var(--text) }

.packing-start {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
}
.packing-start:disabled {
  background: #2a3a5e;
  color: #556;
  cursor: not-allowed;
}

.pack-instructions {
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 12px;
}

.suitcase {
  min-height: 80px;
  padding: 12px;
  background: linear-gradient(135deg, #1a2540, #0d1020);
  border: 2px dashed var(--border);
  border-radius: 10px;
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}
.suitcase-empty {
  color: var(--muted);
  font-size: 13px;
  width: 100%;
  text-align: center;
  align-self: center;
}

.packed-item {
  padding: 5px 10px;
  border-radius: 16px;
  background: var(--accent);
  color: #fff;
  font-size: 12px;
}

.items-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  min-height: 60px;
  padding: 12px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
}

.pack-item {
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--bg3);
  cursor: pointer;
  font-size: 13px;
  transition: all .2s;
  user-select: none;
}
.pack-item:hover {
  border-color: var(--accent);
  background: #1a2540;
}
.pack-item.selected {
  border-color: var(--green);
  background: #0d2d0d;
  color: var(--green);
}
.pack-item.wrong-pick {
  border-color: var(--red);
  background: #2d0d0d;
  color: var(--red);
  animation: shake .3s;
}

.pack-submit {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, var(--green), #1aaa6a);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.pack-result {
  padding: 16px;
  border-radius: 10px;
  margin-top: 12px;
  text-align: center;
  animation: fadeInUp .3s;
}
.result-green { background: #0d2d0d; border: 1px solid var(--green); color: var(--green) }
.result-orange { background: #2d2a0d; border: 1px solid #ffaa33; color: #ffaa33 }
.result-red { background: #2d0d0d; border: 1px solid var(--red); color: var(--red) }

.result-icon { font-size: 48px; margin-bottom: 8px }
.result-title { font-size: 16px; font-weight: 700; margin-bottom: 8px }
.result-exp { font-size: 14px; margin-bottom: 8px }

.correct-list { margin-top: 12px }
.correct-list p { font-size: 13px; margin-bottom: 6px }
.correct-item {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  background: var(--bg3);
  font-size: 12px;
  margin: 3px;
  color: var(--text);
}

@keyframes shake {
  0%, 100% { transform: translateX(0) }
  25% { transform: translateX(-4px) }
  50% { transform: translateX(4px) }
  75% { transform: translateX(-4px) }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px) }
  to { opacity: 1; transform: translateY(0) }
}
</style>
