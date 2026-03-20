<script setup lang="ts">
import type { Task } from '~/types'

const props = defineProps<{
  task: Task | null
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  complete: [mode: 'checkin' | 'virtual', expMultiplier: number]
}>()

const { isTaskCompleted } = useGameState()
const { capturePhoto, getCurrentLocation, isNearLocation, calculateDistance, savePhoto, getPhotoForTask } = usePhotoCheckin()

const done = computed(() => props.task ? isTaskCompleted(props.task.id) : false)

const checkinLoading = ref(false)
const checkinResult = ref<{ photo: string; near: boolean; distance?: number } | null>(null)

// Get existing photo for current task
const existingPhoto = computed(() => {
  if (import.meta.server || !props.task) return null
  return getPhotoForTask(props.task.id)
})

// Reset state when task changes
watch(() => props.task?.id, () => {
  checkinLoading.value = false
  checkinResult.value = null
})

const diffLabels: Record<string, string> = {
  easy: '简单 ⭐',
  medium: '中等 ⭐⭐',
  hard: '困难 ⭐⭐⭐',
  legendary: '传说 ⭐⭐⭐⭐',
}

function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}

async function onCheckin() {
  if (!props.task || done.value) return
  checkinLoading.value = true

  try {
    // Step 1: Capture photo (required - if user cancels, abort)
    const dataUrl = await capturePhoto()

    // Step 2: Get GPS location (optional - don't block completion)
    let location: { lat: number; lng: number } | null = null
    try {
      location = await getCurrentLocation()
    } catch {
      // GPS unavailable - continue without location
    }

    // Step 3: Check proximity
    let near = false
    let distance: number | undefined
    if (location && props.task.location) {
      distance = Math.round(calculateDistance(location, props.task.location))
      near = isNearLocation(location, props.task.location)
    }

    // Step 4: Save photo (optional - don't block completion)
    try {
      savePhoto({
        taskId: props.task.id,
        dataUrl,
        timestamp: Date.now(),
        location: location ?? undefined,
      })
    } catch {
      // Storage full etc - continue without saving photo
    }

    checkinResult.value = { photo: dataUrl, near, distance }

    // Complete with full EXP (photo check-in always gets 100%)
    emit('complete', 'checkin', 1)
  } catch {
    // User cancelled photo selection - do nothing
  } finally {
    checkinLoading.value = false
  }
}

function onVirtualComplete() {
  if (!props.task || done.value) return
  emit('complete', 'virtual', 0.7)
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleString('zh-CN', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
</script>

<template>
  <div
    class="task-modal-overlay"
    :class="{ show: visible }"
    @click="onOverlayClick"
  >
    <div v-if="task" class="task-modal">
      <div class="tm-banner">
        <span style="font-size: 40px">{{ task.medal.icon }}</span>
      </div>
      <div class="tm-body">
        <div class="tm-title">{{ task.name }}</div>
        <div class="tm-meta">
          <span class="tm-tag">📍 {{ task.city }}</span>
          <span class="tm-tag">{{ diffLabels[task.difficulty] }}</span>
          <span class="tm-tag">{{ task.country }}</span>
          <span v-if="done" class="tm-tag" style="color: var(--green); border-color: var(--green)">✅ 已完成</span>
        </div>

        <div class="tm-section">
          <h4>📖 任务简介</h4>
          <p class="tm-desc">{{ task.desc }}</p>
        </div>

        <div class="tm-section">
          <h4>🎯 完成目标</h4>
          <ul class="obj-list">
            <li v-for="(obj, i) in task.objectives" :key="i">
              <span class="obj-dot" />
              <span>{{ obj }}</span>
            </li>
          </ul>
        </div>

        <TravelGuidePanel v-if="task?.guide" :guide="task.guide" />

        <div class="tm-section">
          <h4>🎁 完成奖励</h4>
          <div class="rewards-row">
            <div class="rwd-box">
              <div class="rwd-box-icon">⚡</div>
              <div class="rwd-box-label">经验值</div>
              <div class="rwd-box-val">{{ task.exp }}</div>
            </div>
            <div class="rwd-box">
              <div class="rwd-box-icon">🏅</div>
              <div class="rwd-box-label">勋章</div>
              <div class="rwd-box-val" style="color: var(--gold)">{{ task.medal.name }}</div>
            </div>
          </div>
          <div class="medal-showcase">
            <span class="mi">{{ task.medal.icon }}</span>
            <span class="mn">{{ task.medal.name }}</span>
            <span class="md">{{ task.medal.desc }}</span>
          </div>
        </div>

        <!-- Existing check-in photo display -->
        <div v-if="existingPhoto && done" class="checkin-result">
          <img :src="existingPhoto.dataUrl" class="checkin-thumb" alt="打卡照片">
          <div class="checkin-info">
            <div class="checkin-badge checkin-badge-real">📍 已在现场打卡</div>
            <div class="checkin-time">{{ formatTime(existingPhoto.timestamp) }}</div>
          </div>
        </div>

        <!-- Just-captured check-in result -->
        <div v-else-if="checkinResult" class="checkin-result">
          <img :src="checkinResult.photo" class="checkin-thumb" alt="打卡照片">
          <div class="checkin-info">
            <div v-if="checkinResult.near" class="checkin-badge checkin-badge-real">📍 已在现场打卡</div>
            <div v-else class="checkin-badge checkin-badge-photo">📸 已拍照打卡</div>
            <div v-if="checkinResult.distance != null" class="checkin-distance">
              距离: {{ checkinResult.distance >= 1000 ? (checkinResult.distance / 1000).toFixed(1) + 'km' : checkinResult.distance + 'm' }}
            </div>
          </div>
        </div>

        <!-- Completion buttons -->
        <template v-if="!done">
          <button
            class="checkin-btn"
            :disabled="checkinLoading"
            @click="onCheckin"
          >
            <template v-if="checkinLoading">
              ⏳ 正在打卡...
            </template>
            <template v-else>
              <div class="checkin-btn-title">📍 实地打卡拍照</div>
              <div class="checkin-btn-sub">获得全额 +{{ task.exp }} EXP</div>
            </template>
          </button>
          <button
            class="virtual-btn"
            @click="onVirtualComplete"
          >
            🎮 虚拟完成 (+{{ Math.floor(task.exp * 0.7) }} EXP)
          </button>
        </template>
        <template v-else>
          <button class="complete-btn" disabled>
            ✅ 任务已完成
          </button>
        </template>

        <button class="close-btn" @click="emit('close')">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}
.task-modal-overlay.show {
  opacity: 1;
  pointer-events: all;
}
.task-modal {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 20px;
  width: 90%;
  max-width: 540px;
  max-height: 85vh;
  overflow-y: auto;
  transform: scale(0.9);
  transition: transform 0.3s;
}
.task-modal-overlay.show .task-modal {
  transform: scale(1);
}
.task-modal::-webkit-scrollbar {
  width: 4px;
}
.task-modal::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}
.tm-banner {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  border-radius: 20px 20px 0 0;
  background: linear-gradient(135deg, #1a2540, #0d1020);
}
.tm-body {
  padding: 24px;
}
.tm-title {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 6px;
}
.tm-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.tm-tag {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 8px;
  background: var(--bg2);
  border: 1px solid var(--border);
  color: var(--muted);
}
.tm-section {
  margin-bottom: 16px;
}
.tm-section h4 {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
.tm-desc {
  font-size: 14px;
  line-height: 1.8;
  color: #bbc;
}
.obj-list {
  list-style: none;
}
.obj-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}
.obj-list li:last-child {
  border-bottom: none;
}
.obj-dot {
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 6px;
}
.rewards-row {
  display: flex;
  gap: 12px;
}
.rwd-box {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 16px;
  text-align: center;
  flex: 1;
}
.rwd-box-icon {
  font-size: 24px;
  margin-bottom: 4px;
}
.rwd-box-label {
  font-size: 11px;
  color: var(--muted);
}
.rwd-box-val {
  font-size: 16px;
  font-weight: 700;
  color: var(--accent);
  margin-top: 2px;
}
.medal-showcase {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #1a1000, #0d0a20);
  border: 2px solid var(--gold);
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
}
.medal-showcase .mi {
  font-size: 48px;
  margin-bottom: 8px;
}
.medal-showcase .mn {
  font-size: 14px;
  font-weight: 700;
  color: var(--gold);
}
.medal-showcase .md {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}

/* Check-in result display */
.checkin-result {
  display: flex;
  gap: 12px;
  align-items: center;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
}
.checkin-thumb {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}
.checkin-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.checkin-badge {
  font-size: 13px;
  font-weight: 700;
}
.checkin-badge-real {
  color: var(--green);
}
.checkin-badge-photo {
  color: var(--accent);
}
.checkin-time, .checkin-distance {
  font-size: 11px;
  color: var(--muted);
}

/* Dual completion buttons */
.checkin-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 16px;
  text-align: center;
}
.checkin-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(74, 158, 255, 0.4);
}
.checkin-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}
.checkin-btn-title {
  font-size: 16px;
  margin-bottom: 2px;
}
.checkin-btn-sub {
  font-size: 12px;
  opacity: 0.85;
  font-weight: 400;
}
.virtual-btn {
  width: 100%;
  padding: 12px;
  background: transparent;
  color: var(--muted);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s;
}
.virtual-btn:hover {
  color: var(--text);
  border-color: var(--accent);
}
.complete-btn {
  width: 100%;
  padding: 14px;
  background: #2a3a5e;
  color: #556;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: not-allowed;
  margin-top: 16px;
}
.close-btn {
  width: 100%;
  padding: 10px;
  background: transparent;
  color: var(--muted);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s;
}
.close-btn:hover {
  color: var(--text);
  border-color: var(--text);
}
</style>
