<template>
  <div class="tl-page">
    <h2>📅 旅行时间线</h2>
    <p>你的旅行足迹，按时间记录每一个精彩瞬间</p>

    <ClientOnly>
      <div v-if="groupedEntries.length === 0" class="tl-empty">
        <div class="tl-empty-icon">🗺️</div>
        <div class="tl-empty-text">还没有旅行记录</div>
        <div class="tl-empty-sub">完成任务、拍照打卡后，你的时间线会在这里展示</div>
      </div>

      <div v-else class="tl-timeline">
        <div v-for="group in groupedEntries" :key="group.date" class="tl-group">
          <div class="tl-date-header">
            <div class="tl-date-dot" />
            <div class="tl-date-text">{{ formatDate(group.date) }}</div>
          </div>
          <div class="tl-entries">
            <div v-for="entry in group.entries" :key="entry.id" class="tl-entry">
              <div class="tl-entry-icon">{{ entry.icon }}</div>
              <div class="tl-entry-body">
                <div class="tl-entry-title">{{ entry.title }}</div>
                <div v-if="entry.subtitle" class="tl-entry-sub">{{ entry.subtitle }}</div>
                <img v-if="entry.photoUrl" :src="entry.photoUrl" class="tl-entry-photo" />
                <div v-if="entry.comment" class="tl-entry-comment">💬 {{ entry.comment }}</div>
              </div>
              <div v-if="entry.exp" class="tl-entry-exp">+{{ entry.exp }}</div>
            </div>
          </div>
        </div>
      </div>

      <template #fallback>
        <div class="tl-loading">加载中...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { TASKS } from '~/data/tasks'
import { ALL_MEDALS } from '~/data/medals'
import { COUNTRIES } from '~/data/countries'

const { state: gameState } = useGameState()
const { getPhotos } = usePhotoCheckin()

interface TimelineEntry {
  id: string
  date: string          // YYYY-MM-DD
  timestamp: number
  icon: string
  title: string
  subtitle?: string
  photoUrl?: string
  comment?: string
  exp?: number
}

interface TimelineGroup {
  date: string
  entries: TimelineEntry[]
}

const allTasks = Object.values(TASKS).flat()

const groupedEntries = computed<TimelineGroup[]>(() => {
  const entries: TimelineEntry[] = []
  const photos = getPhotos()

  // Build timeline from photos (they have timestamps)
  for (const photo of photos) {
    const task = allTasks.find(t => t.id === photo.taskId)
    if (!task) continue

    const country = COUNTRIES.find(c => c.id === task.country)
    const date = new Date(photo.timestamp).toISOString().slice(0, 10)

    entries.push({
      id: `photo-${photo.taskId}`,
      date,
      timestamp: photo.timestamp,
      icon: '📷',
      title: task.name,
      subtitle: country ? `${country.name} · ${task.city}` : task.city,
      photoUrl: photo.dataUrl,
      comment: photo.comment,
      exp: task.exp,
    })
  }

  // Add completed tasks that don't have photos
  for (const taskId of gameState.value.completed) {
    if (photos.some(p => p.taskId === taskId)) continue
    const task = allTasks.find(t => t.id === taskId)
    if (!task) continue

    const country = COUNTRIES.find(c => c.id === task.country)
    // No timestamp available, use a placeholder
    entries.push({
      id: `task-${taskId}`,
      date: '未知日期',
      timestamp: 0,
      icon: '✅',
      title: task.name,
      subtitle: country ? `${country.name} · ${task.city}` : task.city,
      exp: task.exp,
    })
  }

  // Sort by timestamp descending (newest first), unknowns at end
  entries.sort((a, b) => {
    if (a.timestamp === 0 && b.timestamp === 0) return 0
    if (a.timestamp === 0) return 1
    if (b.timestamp === 0) return -1
    return b.timestamp - a.timestamp
  })

  // Group by date
  const groups: TimelineGroup[] = []
  let currentGroup: TimelineGroup | null = null

  for (const entry of entries) {
    if (!currentGroup || currentGroup.date !== entry.date) {
      currentGroup = { date: entry.date, entries: [] }
      groups.push(currentGroup)
    }
    currentGroup.entries.push(entry)
  }

  return groups
})

function formatDate(dateStr: string): string {
  if (dateStr === '未知日期') return '📌 早期记录'
  const d = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  if (dateStr === today) return '今天'
  if (dateStr === yesterday) return '昨天'

  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const weekday = weekdays[d.getDay()]

  if (year === now.getFullYear()) {
    return `${month}月${day}日 周${weekday}`
  }
  return `${year}年${month}月${day}日`
}
</script>

<style scoped>
.tl-page {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
}
.tl-page h2 {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 6px;
}
.tl-page > p {
  color: var(--muted);
  margin-bottom: 24px;
}

/* Empty state */
.tl-empty {
  text-align: center;
  padding: 60px 20px;
}
.tl-empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.tl-empty-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
}
.tl-empty-sub {
  font-size: 13px;
  color: var(--muted);
}

/* Timeline */
.tl-timeline {
  position: relative;
  padding-left: 20px;
}
.tl-timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 12px;
  bottom: 0;
  width: 2px;
  background: var(--border);
}

/* Date groups */
.tl-group {
  margin-bottom: 24px;
}
.tl-date-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  position: relative;
}
.tl-date-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid var(--bg2);
  position: absolute;
  left: -22px;
  flex-shrink: 0;
}
.tl-date-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
}

/* Entries */
.tl-entries {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tl-entry {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
}
.tl-entry-icon {
  font-size: 20px;
  flex-shrink: 0;
  padding-top: 2px;
}
.tl-entry-body {
  flex: 1;
  min-width: 0;
}
.tl-entry-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}
.tl-entry-sub {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}
.tl-entry-photo {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 8px;
}
.tl-entry-comment {
  font-size: 12px;
  color: var(--muted);
  margin-top: 6px;
  font-style: italic;
}
.tl-entry-exp {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  flex-shrink: 0;
  white-space: nowrap;
}

.tl-loading {
  text-align: center;
  color: var(--muted);
  padding: 60px 0;
  font-size: 14px;
}

/* Mobile */
@media (max-width: 640px) {
  .tl-page { padding: 16px 12px; }
  .tl-page h2 { font-size: 19px; }
  .tl-entry { padding: 10px; }
  .tl-entry-photo { max-height: 160px; }
}
</style>
