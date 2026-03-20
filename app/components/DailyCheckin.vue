<script setup lang="ts">
const { state, checkedToday, todayReward, nextMilestone, doCheckin, loadCheckinStatus } = useDailyCheckin()

const checking = ref(false)

async function handleCheckin() {
  if (checkedToday.value || checking.value) return
  checking.value = true
  try {
    await doCheckin()
  } finally {
    checking.value = false
  }
}

// Load status on mount
onMounted(() => {
  loadCheckinStatus()
})

// 7-day progress dots
const weekDots = computed(() => {
  const streak = state.value.streak
  const done = checkedToday.value ? streak : streak // show dots for completed days
  return Array.from({ length: 7 }, (_, i) => {
    if (checkedToday.value) {
      return i < streak
    }
    return i < streak
  })
})
</script>

<template>
  <div class="checkin-banner" :class="{ done: checkedToday }">
    <div class="checkin-left">
      <div class="checkin-icon">{{ checkedToday ? '✅' : '🔥' }}</div>
      <div class="checkin-info">
        <div class="checkin-title">
          {{ checkedToday ? '今日已签到' : '每日签到' }}
        </div>
        <div class="checkin-streak">
          连续 <strong>{{ state.streak }}</strong> 天
          <span v-if="nextMilestone" class="next-milestone">· 距离下一里程碑还差 {{ nextMilestone - state.streak }} 天</span>
        </div>
        <div class="checkin-dots">
          <span
            v-for="(filled, i) in weekDots"
            :key="i"
            class="dot"
            :class="{ filled }"
          />
        </div>
      </div>
    </div>
    <div class="checkin-right">
      <button
        v-if="!checkedToday"
        class="checkin-btn"
        :disabled="checking"
        @click="handleCheckin"
      >
        {{ checking ? '签到中...' : `签到 +${todayReward} EXP` }}
      </button>
      <div v-else class="checkin-done-label">+EXP 已领取</div>
    </div>
  </div>
</template>

<style scoped>
.checkin-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, #1a1040 0%, #2d1b69 50%, #1e3a5f 100%);
  border: 1px solid rgba(139, 92, 246, 0.3);
  margin-bottom: 24px;
  gap: 12px;
}
.checkin-banner.done {
  background: linear-gradient(135deg, #0f2922 0%, #1a3d35 50%, #0d2b3e 100%);
  border-color: rgba(52, 211, 153, 0.3);
}
.checkin-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}
.checkin-icon {
  font-size: 32px;
  flex-shrink: 0;
}
.checkin-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.checkin-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}
.checkin-streak {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}
.checkin-streak strong {
  color: #fbbf24;
  font-size: 14px;
}
.next-milestone {
  color: rgba(255, 255, 255, 0.5);
}
.checkin-dots {
  display: flex;
  gap: 5px;
  margin-top: 2px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  transition: background 0.3s;
}
.dot.filled {
  background: #fbbf24;
  box-shadow: 0 0 6px rgba(251, 191, 36, 0.5);
}
.checkin-banner.done .dot.filled {
  background: #34d399;
  box-shadow: 0 0 6px rgba(52, 211, 153, 0.5);
}
.checkin-right {
  flex-shrink: 0;
}
.checkin-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s, transform 0.15s;
}
.checkin-btn:hover {
  opacity: 0.9;
  transform: scale(1.03);
}
.checkin-btn:active {
  transform: scale(0.97);
}
.checkin-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
.checkin-done-label {
  font-size: 13px;
  color: #34d399;
  font-weight: 600;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .checkin-banner {
    flex-direction: column;
    align-items: stretch;
    padding: 14px 16px;
    gap: 12px;
  }
  .checkin-right {
    display: flex;
    justify-content: center;
  }
  .checkin-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
