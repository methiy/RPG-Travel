<template>
  <div class="ch-page">
    <h2>📋 每周挑战</h2>
    <p>每周 3 个限时挑战，完成后领取丰厚奖励！</p>

    <div class="ch-timer">
      <span class="ch-timer-icon">⏰</span>
      <span>本周剩余：</span>
      <span class="ch-countdown">{{ countdown }}</span>
    </div>

    <ClientOnly>
      <div class="ch-list">
        <div
          v-for="s in challenges"
          :key="s.challenge.id"
          class="ch-card"
          :class="{ complete: s.isComplete, claimed: s.isClaimed }"
        >
          <div class="ch-icon">{{ s.challenge.icon }}</div>
          <div class="ch-body">
            <div class="ch-title">{{ s.challenge.title }}</div>
            <div class="ch-desc">{{ s.challenge.desc }}</div>
            <div class="ch-progress-wrap">
              <div class="ch-progress-bar">
                <div
                  class="ch-progress-fill"
                  :class="{ done: s.isComplete }"
                  :style="{ width: (s.current / s.challenge.target * 100) + '%' }"
                />
              </div>
              <div class="ch-progress-text">{{ s.current }}/{{ s.challenge.target }}</div>
            </div>
          </div>
          <div class="ch-reward-col">
            <div class="ch-exp-tag">+{{ s.challenge.exp }} EXP</div>
            <button
              v-if="s.isComplete && !s.isClaimed"
              class="ch-claim-btn"
              @click="claimReward(s.challenge.id)"
            >
              领取
            </button>
            <div v-else-if="s.isClaimed" class="ch-claimed-badge">✅ 已领取</div>
          </div>
        </div>
      </div>

      <div class="ch-hint">
        💡 挑战每周一自动刷新，完成后记得及时领取奖励！
      </div>

      <template #fallback>
        <div class="ch-loading">加载中...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const { challenges, weekEnd, claimReward } = useWeeklyChallenges()

const countdown = ref('')

function updateCountdown() {
  const now = Date.now()
  const diff = weekEnd.getTime() - now
  if (diff <= 0) {
    countdown.value = '已结束，即将刷新'
    return
  }
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  countdown.value = days > 0
    ? `${days}天 ${hours}时 ${mins}分`
    : `${hours}时 ${mins}分`
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 60000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.ch-page {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
}
.ch-page h2 {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 6px;
}
.ch-page > p {
  color: var(--muted);
  margin-bottom: 16px;
}

/* Timer */
.ch-timer {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 16px;
}
.ch-timer-icon {
  font-size: 16px;
}
.ch-countdown {
  font-weight: 700;
  color: var(--accent);
}

/* Challenge list */
.ch-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}
.ch-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  align-items: flex-start;
  transition: all 0.2s;
}
.ch-card.complete {
  border-color: rgba(74, 158, 255, 0.3);
}
.ch-card.claimed {
  opacity: 0.7;
}
.ch-icon {
  font-size: 28px;
  flex-shrink: 0;
  padding-top: 2px;
}
.ch-body {
  flex: 1;
  min-width: 0;
}
.ch-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}
.ch-desc {
  font-size: 12px;
  color: var(--muted);
  margin-top: 3px;
}
.ch-progress-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.ch-progress-bar {
  flex: 1;
  height: 6px;
  background: #1a2540;
  border-radius: 3px;
  overflow: hidden;
}
.ch-progress-fill {
  height: 100%;
  background: var(--muted);
  border-radius: 3px;
  transition: width 0.6s ease;
}
.ch-progress-fill.done {
  background: linear-gradient(90deg, var(--accent), var(--accent2));
}
.ch-progress-text {
  font-size: 11px;
  color: var(--muted);
  flex-shrink: 0;
}

/* Reward column */
.ch-reward-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.ch-exp-tag {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  background: rgba(74, 158, 255, 0.1);
  padding: 3px 10px;
  border-radius: 10px;
  white-space: nowrap;
}
.ch-claim-btn {
  padding: 6px 16px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.ch-claim-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.3);
}
.ch-claimed-badge {
  font-size: 11px;
  color: var(--muted);
}

/* Hint */
.ch-hint {
  font-size: 12px;
  color: var(--muted);
  text-align: center;
  padding: 8px;
}

.ch-loading {
  text-align: center;
  color: var(--muted);
  padding: 60px 0;
  font-size: 14px;
}

/* Mobile */
@media (max-width: 640px) {
  .ch-page { padding: 16px 12px; }
  .ch-page h2 { font-size: 19px; }
  .ch-card { padding: 12px; gap: 10px; }
  .ch-icon { font-size: 24px; }
  .ch-title { font-size: 14px; }
}
</style>
