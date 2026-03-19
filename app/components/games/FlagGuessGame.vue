<template>
  <div class="game-panel">
    <h3>🏳️ 国旗猜猜猜</h3>
    <p>看国旗猜国家，测试你的全球视野！</p>

    <template v-if="!finished">
      <div class="fg-progress">
        <span>第 {{ round + 1 }} / 20 题</span>
        <span>得分：{{ score }} EXP</span>
      </div>

      <div class="fg-timer" :class="{ urgent: timer <= 2 }">⏱️ {{ timer }}s</div>

      <div class="fg-flag">
        <img
          :src="`https://flagcdn.com/w160/${currentFlag.code}.png`"
          :alt="currentFlag.name"
          class="fg-flag-img"
        />
      </div>

      <div class="fg-options">
        <button
          v-for="(opt, i) in options"
          :key="i"
          class="fg-opt"
          :class="{
            correct: answered && opt === currentFlag.name,
            wrong: answered && opt === selectedAnswer && opt !== currentFlag.name,
          }"
          :disabled="answered"
          @click="answer(opt)"
        >
          {{ opt }}
        </button>
      </div>

      <div v-if="answered" class="fg-feedback" :class="isCorrect ? 'ok' : 'ng'">
        {{ isCorrect ? '✅ 正确！' : `❌ 答错了，正确答案是 ${currentFlag.name}` }}
      </div>
    </template>

    <div v-else class="fg-score">
      <div class="qs-icon">{{ correctCount >= 15 ? '🏆' : correctCount >= 10 ? '🌟' : '📚' }}</div>
      <div class="qs-title">{{ correctCount >= 15 ? '国旗大师！' : correctCount >= 10 ? '不错哦！' : '继续加油' }}</div>
      <div class="qs-exp">共获得 {{ score }} EXP</div>
      <div style="color: var(--muted); font-size: 14px; margin-bottom: 4px">
        正确率：{{ correctCount }} / 20（{{ Math.round(correctCount / 20 * 100) }}%）
      </div>
      <button class="qs-restart" @click="restart">再来一轮 🔄</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { addExp, addMedal } = useGameState()

const FLAGS = [
  {code:'jp',name:'日本'}, {code:'kr',name:'韩国'}, {code:'cn',name:'中国'},
  {code:'th',name:'泰国'}, {code:'sg',name:'新加坡'}, {code:'my',name:'马来西亚'},
  {code:'id',name:'印度尼西亚'}, {code:'vn',name:'越南'}, {code:'ph',name:'菲律宾'},
  {code:'fr',name:'法国'}, {code:'it',name:'意大利'}, {code:'es',name:'西班牙'},
  {code:'de',name:'德国'}, {code:'gb',name:'英国'}, {code:'us',name:'美国'},
  {code:'br',name:'巴西'}, {code:'mx',name:'墨西哥'}, {code:'au',name:'澳大利亚'},
  {code:'nz',name:'新西兰'}, {code:'eg',name:'埃及'}, {code:'za',name:'南非'},
  {code:'ae',name:'阿联酋'}, {code:'in',name:'印度'}, {code:'tr',name:'土耳其'},
  {code:'ru',name:'俄罗斯'}, {code:'ca',name:'加拿大'}, {code:'pe',name:'秘鲁'},
  {code:'cl',name:'智利'}, {code:'gr',name:'希腊'}, {code:'pt',name:'葡萄牙'},
  {code:'no',name:'挪威'}, {code:'se',name:'瑞典'}, {code:'fi',name:'芬兰'},
  {code:'ch',name:'瑞士'}, {code:'at',name:'奥地利'}, {code:'nl',name:'荷兰'},
  {code:'be',name:'比利时'}, {code:'pl',name:'波兰'}, {code:'cz',name:'捷克'},
  {code:'hu',name:'匈牙利'}, {code:'hr',name:'克罗地亚'}, {code:'ma',name:'摩洛哥'},
  {code:'ke',name:'肯尼亚'}, {code:'et',name:'埃塞俄比亚'}, {code:'co',name:'哥伦比亚'},
  {code:'ar',name:'阿根廷'}, {code:'jm',name:'牙买加'}, {code:'cu',name:'古巴'},
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]!; a[i] = a[j]!; a[j] = tmp
  }
  return a
}

const roundFlags = ref(shuffle(FLAGS).slice(0, 20))
const round = ref(0)
const score = ref(0)
const correctCount = ref(0)
const answered = ref(false)
const selectedAnswer = ref('')
const isCorrect = ref(false)
const finished = ref(false)
const timer = ref(5)

let timerInterval: ReturnType<typeof setInterval> | null = null

const currentFlag = computed(() => roundFlags.value[round.value]!)

const options = computed(() => {
  const correct = currentFlag.value.name
  const others = FLAGS.filter(f => f.name !== correct)
  const wrong = shuffle(others).slice(0, 3).map(f => f.name)
  return shuffle([correct, ...wrong])
})

function startTimer() {
  timer.value = 5
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    timer.value--
    if (timer.value <= 0) {
      clearInterval(timerInterval!)
      timerInterval = null
      if (!answered.value) {
        // Time expired = wrong
        answered.value = true
        selectedAnswer.value = ''
        isCorrect.value = false
        setTimeout(nextRound, 1000)
      }
    }
  }, 1000)
}

function answer(opt: string) {
  if (answered.value) return
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
  answered.value = true
  selectedAnswer.value = opt
  isCorrect.value = opt === currentFlag.value.name

  if (isCorrect.value) {
    score.value += 5
    correctCount.value++
    addExp(5)
    setTimeout(nextRound, 500)
  } else {
    setTimeout(nextRound, 1000)
  }
}

function nextRound() {
  if (round.value < 19) {
    round.value++
    answered.value = false
    selectedAnswer.value = ''
    isCorrect.value = false
    startTimer()
  } else {
    finished.value = true
    if (correctCount.value >= 15) {
      addMedal('flag-master')
    }
  }
}

function restart() {
  roundFlags.value = shuffle(FLAGS).slice(0, 20)
  round.value = 0
  score.value = 0
  correctCount.value = 0
  answered.value = false
  selectedAnswer.value = ''
  isCorrect.value = false
  finished.value = false
  startTimer()
}

onMounted(() => startTimer())
onUnmounted(() => { if (timerInterval) clearInterval(timerInterval) })
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

.fg-progress {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 12px;
}

.fg-timer {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 12px;
  transition: color .3s;
}
.fg-timer.urgent { color: var(--red); animation: pulse .5s infinite }

.fg-flag {
  text-align: center;
  margin-bottom: 20px;
}
.fg-flag-img {
  width: 160px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,.4);
  border: 2px solid var(--border);
}

.fg-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.fg-opt {
  padding: 14px 18px;
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all .2s;
  background: var(--bg2);
  color: var(--text);
}
.fg-opt:hover:not(:disabled) {
  border-color: var(--accent);
  background: #1a2540;
}
.fg-opt.correct {
  border-color: var(--green);
  background: #0d2d0d;
  color: var(--green);
}
.fg-opt.wrong {
  border-color: var(--red);
  background: #2d0d0d;
  color: var(--red);
}
.fg-opt:disabled { cursor: not-allowed }

.fg-feedback {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  animation: fadeInUp .3s ease;
}
.fg-feedback.ok { background: #0d2d0d; border: 1px solid var(--green); color: var(--green) }
.fg-feedback.ng { background: #2d0d0d; border: 1px solid var(--red); color: var(--red) }

.fg-score {
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
@keyframes pulse {
  0%, 100% { opacity: 1 }
  50% { opacity: .5 }
}
</style>
