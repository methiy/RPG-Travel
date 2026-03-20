<template>
  <div class="duel-page">
    <h2>⚔️ PK 对战</h2>
    <p>限时答题 PK，挑战虚拟旅行者！</p>

    <ClientOnly>
      <!-- 开始界面 -->
      <div v-if="phase === 'idle'" class="duel-start">
        <div class="duel-vs">
          <div class="duel-player">
            <div class="duel-avatar">{{ avatar }}</div>
            <div class="duel-pname">{{ authState.user?.displayName || '你' }}</div>
          </div>
          <div class="duel-vs-text">VS</div>
          <div class="duel-player">
            <div class="duel-avatar">🤖</div>
            <div class="duel-pname">{{ opponent.name }}</div>
          </div>
        </div>
        <div class="duel-rules">
          <p>📌 5 道限时题，每题 10 秒</p>
          <p>⚡ 答对 +20 EXP，速度越快分数越高</p>
          <p>🏆 击败对手获得额外 30 EXP 奖励</p>
        </div>
        <button class="duel-btn" @click="startDuel">开始对战！</button>
      </div>

      <!-- 答题界面 -->
      <div v-else-if="phase === 'playing'" class="duel-playing">
        <div class="duel-scoreboard">
          <div class="duel-sb-player">
            <span>{{ authState.user?.displayName || '你' }}</span>
            <span class="duel-score">{{ myScore }}</span>
          </div>
          <div class="duel-sb-round">{{ currentIdx + 1 }}/{{ ROUND_COUNT }}</div>
          <div class="duel-sb-player">
            <span>{{ opponent.name }}</span>
            <span class="duel-score">{{ opponentScore }}</span>
          </div>
        </div>

        <div class="duel-timer-bar">
          <div class="duel-timer-fill" :style="{ width: (timeLeft / QUESTION_TIME * 100) + '%' }" :class="{ urgent: timeLeft <= 3 }" />
        </div>

        <div class="duel-question">{{ currentQuestion.q }}</div>

        <div class="duel-options">
          <button
            v-for="(opt, idx) in currentQuestion.opts"
            :key="idx"
            class="duel-opt"
            :class="{
              correct: answered && idx === currentQuestion.ans,
              wrong: answered && idx === selectedAnswer && idx !== currentQuestion.ans,
              disabled: answered,
            }"
            :disabled="answered"
            @click="answer(idx)"
          >
            {{ opt }}
          </button>
        </div>

        <div v-if="answered" class="duel-explain">
          <div class="duel-result-row">
            <span v-if="selectedAnswer === currentQuestion.ans" class="duel-correct-text">✅ 答对了！</span>
            <span v-else class="duel-wrong-text">❌ 答错了</span>
            <span class="duel-opp-result">
              {{ opponentCorrect ? '🤖 对手也答对了' : '🤖 对手答错了' }}
            </span>
          </div>
          <p>{{ currentQuestion.explain }}</p>
        </div>
      </div>

      <!-- 结果界面 -->
      <div v-else-if="phase === 'result'" class="duel-result">
        <div class="duel-result-icon">{{ myScore > opponentScore ? '🎉' : myScore === opponentScore ? '🤝' : '😅' }}</div>
        <div class="duel-result-title">
          {{ myScore > opponentScore ? '你赢了！' : myScore === opponentScore ? '平局！' : '再接再厉！' }}
        </div>
        <div class="duel-final-scores">
          <div class="duel-final-player">
            <div class="duel-final-name">{{ authState.user?.displayName || '你' }}</div>
            <div class="duel-final-score">{{ myScore }}</div>
          </div>
          <div class="duel-final-vs">:</div>
          <div class="duel-final-player">
            <div class="duel-final-name">{{ opponent.name }}</div>
            <div class="duel-final-score">{{ opponentScore }}</div>
          </div>
        </div>
        <div class="duel-earned">
          获得 <strong>{{ earnedExp }}</strong> EXP
        </div>
        <div class="duel-actions">
          <button class="duel-btn" @click="startDuel">再来一局</button>
          <button class="duel-btn-secondary" @click="phase = 'idle'">返回</button>
        </div>
      </div>

      <template #fallback>
        <div class="duel-loading">加载中...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { QUESTIONS } from '~/data/quiz-questions'

const { avatar, addExp } = useGameState()
const { authState } = useAuth()

const ROUND_COUNT = 5
const QUESTION_TIME = 10 // seconds

type Phase = 'idle' | 'playing' | 'result'
const phase = ref<Phase>('idle')

const opponents = [
  { name: '环球小白', skill: 0.4 },
  { name: '旅行达人', skill: 0.65 },
  { name: '地理博士', skill: 0.85 },
  { name: '探险大师', skill: 0.7 },
  { name: '背包客小李', skill: 0.5 },
]

const opponent = ref(opponents[0]!)

const duelQuestions = ref<typeof QUESTIONS>([])
const currentIdx = ref(0)
const myScore = ref(0)
const opponentScore = ref(0)
const selectedAnswer = ref(-1)
const answered = ref(false)
const opponentCorrect = ref(false)
const timeLeft = ref(QUESTION_TIME)
const earnedExp = ref(0)

let timer: ReturnType<typeof setInterval> | null = null

const currentQuestion = computed(() => duelQuestions.value[currentIdx.value] || QUESTIONS[0]!)

function startDuel() {
  // Pick random opponent
  opponent.value = opponents[Math.floor(Math.random() * opponents.length)]!

  // Pick random questions
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5)
  duelQuestions.value = shuffled.slice(0, ROUND_COUNT)

  currentIdx.value = 0
  myScore.value = 0
  opponentScore.value = 0
  earnedExp.value = 0
  phase.value = 'playing'
  startQuestion()
}

function startQuestion() {
  selectedAnswer.value = -1
  answered.value = false
  opponentCorrect.value = false
  timeLeft.value = QUESTION_TIME

  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      answer(-1) // Time's up
    }
  }, 1000)
}

function answer(idx: number) {
  if (answered.value) return
  answered.value = true
  selectedAnswer.value = idx

  if (timer) clearInterval(timer)

  const q = currentQuestion.value
  const isCorrect = idx === q.ans

  // Simulate opponent answer
  opponentCorrect.value = Math.random() < opponent.value.skill

  // Score: correct answer gets points based on speed
  if (isCorrect) {
    const speedBonus = Math.max(0, timeLeft.value)
    myScore.value += 100 + speedBonus * 10
  }
  if (opponentCorrect.value) {
    // Opponent answers in random time
    const oppSpeed = Math.floor(Math.random() * 7) + 1
    opponentScore.value += 100 + oppSpeed * 10
  }

  // Auto advance after 2.5s
  setTimeout(() => {
    if (currentIdx.value < ROUND_COUNT - 1) {
      currentIdx.value++
      startQuestion()
    } else {
      finishDuel()
    }
  }, 2500)
}

function finishDuel() {
  if (timer) clearInterval(timer)

  // Calculate EXP
  let exp = 0
  // Base EXP for correct answers
  const correctCount = duelQuestions.value.filter((q, i) => {
    // We need to track this better, but approximate from score
    return true // simplified
  }).length

  // Give EXP based on score
  exp = Math.floor(myScore.value / 50)

  // Bonus for winning
  if (myScore.value > opponentScore.value) {
    exp += 30
  }

  exp = Math.max(exp, 5) // Minimum 5 EXP

  earnedExp.value = exp
  addExp(exp)
  phase.value = 'result'
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.duel-page {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
}
.duel-page h2 {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 6px;
}
.duel-page > p {
  color: var(--muted);
  margin-bottom: 20px;
}

/* Start screen */
.duel-start {
  text-align: center;
}
.duel-vs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
}
.duel-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.duel-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border: 3px solid var(--accent);
}
.duel-pname {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}
.duel-vs-text {
  font-size: 28px;
  font-weight: 900;
  color: var(--accent);
}
.duel-rules {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  text-align: left;
}
.duel-rules p {
  font-size: 13px;
  color: var(--muted);
  margin: 6px 0;
}

/* Buttons */
.duel-btn {
  padding: 14px 32px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.duel-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 20px rgba(74, 158, 255, 0.3);
}
.duel-btn-secondary {
  padding: 14px 32px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg2);
  color: var(--muted);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.duel-btn-secondary:hover {
  border-color: var(--text);
  color: var(--text);
}

/* Playing */
.duel-scoreboard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
}
.duel-sb-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: var(--muted);
}
.duel-score {
  font-size: 20px;
  font-weight: 800;
  color: var(--accent);
}
.duel-sb-round {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

/* Timer */
.duel-timer-bar {
  height: 6px;
  background: #1a2540;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 20px;
}
.duel-timer-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  border-radius: 3px;
  transition: width 1s linear;
}
.duel-timer-fill.urgent {
  background: linear-gradient(90deg, #e74c3c, #d63031);
}

.duel-question {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  line-height: 1.5;
  margin-bottom: 16px;
}

.duel-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.duel-opt {
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg2);
  color: var(--text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.duel-opt:hover:not(.disabled) {
  border-color: var(--accent);
}
.duel-opt.correct {
  border-color: #00b894;
  background: rgba(0, 184, 148, 0.1);
  color: #00b894;
}
.duel-opt.wrong {
  border-color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}
.duel-opt.disabled {
  cursor: default;
  opacity: 0.7;
}

.duel-explain {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
}
.duel-result-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.duel-correct-text {
  font-size: 14px;
  font-weight: 700;
  color: #00b894;
}
.duel-wrong-text {
  font-size: 14px;
  font-weight: 700;
  color: #e74c3c;
}
.duel-opp-result {
  font-size: 12px;
  color: var(--muted);
}
.duel-explain p {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.5;
  margin: 0;
}

/* Result */
.duel-result {
  text-align: center;
}
.duel-result-icon {
  font-size: 56px;
  margin-bottom: 12px;
}
.duel-result-title {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 20px;
}
.duel-final-scores {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}
.duel-final-player {
  text-align: center;
}
.duel-final-name {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 4px;
}
.duel-final-score {
  font-size: 28px;
  font-weight: 800;
  color: var(--accent);
}
.duel-final-vs {
  font-size: 24px;
  font-weight: 800;
  color: var(--muted);
}
.duel-earned {
  font-size: 16px;
  color: var(--muted);
  margin-bottom: 24px;
}
.duel-earned strong {
  color: var(--accent);
  font-size: 20px;
}
.duel-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.duel-loading {
  text-align: center;
  color: var(--muted);
  padding: 60px 0;
}

/* Mobile */
@media (max-width: 640px) {
  .duel-page { padding: 16px 12px; }
  .duel-page h2 { font-size: 19px; }
  .duel-vs { gap: 16px; }
  .duel-avatar { width: 52px; height: 52px; font-size: 22px; }
  .duel-question { font-size: 15px; }
  .duel-opt { padding: 12px 14px; font-size: 13px; }
}
</style>
