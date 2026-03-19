<template>
  <div class="game-panel">
    <h3>🧭 旅行知识问答</h3>
    <p>测试你的全球地理和旅行文化知识，答对赢经验！</p>

    <!-- Quiz in progress -->
    <template v-if="!finished">
      <div class="quiz-progress">
        <span>第 {{ qIdx + 1 }} / 10 题</span>
        <span>得分：{{ qScore }} EXP</span>
      </div>

      <div class="quiz-exp-hint">答对得 +{{ currentQuestion.exp }} EXP</div>

      <div class="quiz-question">{{ currentQuestion.q }}</div>

      <div class="quiz-options">
        <button
          v-for="(opt, i) in currentQuestion.opts"
          :key="i"
          class="quiz-opt"
          :class="{
            correct: answered && i === currentQuestion.ans,
            wrong: answered && i === selectedAnswer && i !== currentQuestion.ans,
          }"
          :disabled="answered"
          @click="answer(i)"
        >
          {{ opt }}
        </button>
      </div>

      <div v-if="answered" class="quiz-feedback show" :class="isCorrect ? 'ok' : 'ng'">
        {{ isCorrect ? '✅ 正确！' : '❌ 答错了。' }} {{ currentQuestion.explain }}
      </div>

      <button v-if="answered" class="quiz-next show" @click="nextQuestion">
        {{ qIdx < 9 ? '下一题 →' : '查看结果' }}
      </button>
    </template>

    <!-- Score summary -->
    <div v-else class="quiz-score show">
      <div class="qs-icon">{{ scoreIcon }}</div>
      <div class="qs-title">{{ scoreTitle }}</div>
      <div class="qs-exp">共获得 {{ totalExp }} EXP</div>
      <div style="color: var(--muted); font-size: 14px; margin-bottom: 4px">
        正确率：{{ correctCount }} / 10（{{ Math.round(correctCount / 10 * 100) }}%）
      </div>
      <button class="qs-restart" @click="restart">再来一轮 🔄</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QUESTIONS } from '~/data/quiz-questions'

const { addExp, addMedal } = useGameState()

// Shuffle and pick 10 questions
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]!
    a[i] = a[j]!
    a[j] = tmp
  }
  return a
}

const questions = ref(shuffle(QUESTIONS).slice(0, 10))
const qIdx = ref(0)
const qScore = ref(0)
const correctCount = ref(0)
const answered = ref(false)
const selectedAnswer = ref(-1)
const isCorrect = ref(false)
const finished = ref(false)
const totalExp = ref(0)

const currentQuestion = computed(() => questions.value[qIdx.value]!)

function answer(i: number) {
  if (answered.value) return
  answered.value = true
  selectedAnswer.value = i
  isCorrect.value = i === currentQuestion.value.ans

  if (isCorrect.value) {
    qScore.value += currentQuestion.value.exp
    correctCount.value++
    addExp(currentQuestion.value.exp)
  }
}

function nextQuestion() {
  if (qIdx.value < 9) {
    qIdx.value++
    answered.value = false
    selectedAnswer.value = -1
    isCorrect.value = false
  } else {
    // Finish quiz
    totalExp.value = qScore.value

    // Bonus for high score
    if (correctCount.value >= 8) {
      addExp(50)
      totalExp.value += 50
      addMedal('quiz-master')
    }

    finished.value = true
  }
}

const scoreIcon = computed(() => {
  if (correctCount.value >= 8) return '🏆'
  if (correctCount.value >= 5) return '🌟'
  return '📚'
})

const scoreTitle = computed(() => {
  if (correctCount.value >= 8) return '旅行知识大师！'
  if (correctCount.value >= 5) return '合格的旅行者'
  return '还需多多学习'
})

function restart() {
  questions.value = shuffle(QUESTIONS).slice(0, 10)
  qIdx.value = 0
  qScore.value = 0
  correctCount.value = 0
  answered.value = false
  selectedAnswer.value = -1
  isCorrect.value = false
  finished.value = false
  totalExp.value = 0
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

.quiz-progress {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 12px;
}

.quiz-exp-hint {
  font-size: 13px;
  color: var(--accent);
  margin-bottom: 16px;
}

.quiz-question {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.6;
  margin-bottom: 20px;
  min-height: 60px;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.quiz-opt {
  padding: 14px 18px;
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all .2s;
  background: var(--bg2);
  text-align: left;
  color: var(--text);
}
.quiz-opt:hover:not(:disabled) {
  border-color: var(--accent);
  background: #1a2540;
  transform: translateX(4px);
}
.quiz-opt.correct {
  border-color: var(--green);
  background: #0d2d0d;
  color: var(--green);
}
.quiz-opt.wrong {
  border-color: var(--red);
  background: #2d0d0d;
  color: var(--red);
}
.quiz-opt:disabled { cursor: not-allowed }

.quiz-feedback {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  animation: fadeInUp .3s ease;
}
.quiz-feedback.ok {
  background: #0d2d0d;
  border: 1px solid var(--green);
  color: var(--green);
}
.quiz-feedback.ng {
  background: #2d0d0d;
  border: 1px solid var(--red);
  color: var(--red);
}

.quiz-next {
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

.quiz-score {
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
