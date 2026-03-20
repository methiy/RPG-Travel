<template>
  <div class="feed-page">
    <h2>📸 照片社区</h2>
    <p>看看其他旅行者的精彩瞬间</p>

    <ClientOnly>
      <div v-if="loading && photos.length === 0" class="feed-loading">
        <div class="feed-spinner" />
        <span>加载中...</span>
      </div>

      <div v-else-if="photos.length === 0" class="feed-empty">
        还没有人分享照片，快去打卡成为第一个吧！📷
      </div>

      <div v-else class="feed-list">
        <div v-for="photo in photos" :key="photo.id" class="feed-card">
          <div class="feed-header">
            <div class="feed-avatar">📷</div>
            <div class="feed-user">
              <div class="feed-name">{{ photo.displayName }}</div>
              <div class="feed-time">{{ formatTime(photo.timestamp) }}</div>
            </div>
          </div>

          <img :src="photo.dataUrl" class="feed-image" :alt="photo.taskId" />

          <div class="feed-body">
            <div class="feed-task">
              {{ getTaskName(photo.taskId) }}
            </div>
            <div v-if="photo.comment" class="feed-comment">{{ photo.comment }}</div>
          </div>

          <div class="feed-actions">
            <button
              class="feed-like-btn"
              :class="{ liked: photo.likedByMe }"
              @click="toggleLike(photo)"
            >
              {{ photo.likedByMe ? '❤️' : '🤍' }} {{ photo.likes }}
            </button>
          </div>
        </div>

        <button
          v-if="hasMore"
          class="load-more-btn"
          :disabled="loading"
          @click="loadMore"
        >
          {{ loading ? '加载中...' : '加载更多' }}
        </button>
      </div>

      <template #fallback>
        <div class="feed-loading">
          <div class="feed-spinner" />
          <span>加载中...</span>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { TASKS } from '~/data/tasks'

interface FeedPhoto {
  id: number
  displayName: string
  taskId: string
  dataUrl: string
  timestamp: number
  comment: string
  likes: number
  likedByMe: boolean
}

const allTasks = Object.values(TASKS).flat()

const photos = ref<FeedPhoto[]>([])
const loading = ref(false)
const hasMore = ref(true)
const PAGE_SIZE = 20

async function loadFeed(offset: number = 0) {
  loading.value = true
  try {
    const data = await $fetch('/api/feed', {
      params: { limit: PAGE_SIZE, offset },
    })
    if (offset === 0) {
      photos.value = data.photos as FeedPhoto[]
    } else {
      photos.value.push(...(data.photos as FeedPhoto[]))
    }
    hasMore.value = (data.photos as FeedPhoto[]).length >= PAGE_SIZE
  } catch {
    // Silently fail
  } finally {
    loading.value = false
  }
}

function loadMore() {
  loadFeed(photos.value.length)
}

async function toggleLike(photo: FeedPhoto) {
  try {
    const result = await $fetch('/api/feed/like', {
      method: 'POST',
      body: { photoId: photo.id },
    })
    photo.likedByMe = result.liked
    photo.likes = result.likes
  } catch {
    // Need login
  }
}

function getTaskName(taskId: string): string {
  return allTasks.find(t => t.id === taskId)?.name || taskId
}

function formatTime(ts: number): string {
  const now = Date.now()
  const diff = now - ts
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} 天前`
  const d = new Date(ts)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

onMounted(() => {
  loadFeed()
})
</script>

<style scoped>
.feed-page {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
}
.feed-page h2 {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 6px;
}
.feed-page > p {
  color: var(--muted);
  margin-bottom: 20px;
}

/* Feed list */
.feed-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Feed card */
.feed-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}
.feed-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
}
.feed-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.feed-user {
  flex: 1;
}
.feed-name {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}
.feed-time {
  font-size: 11px;
  color: var(--muted);
}

.feed-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

.feed-body {
  padding: 12px 14px;
}
.feed-task {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 4px;
}
.feed-comment {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
}

.feed-actions {
  padding: 0 14px 12px;
}
.feed-like-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 6px 14px;
  color: var(--muted);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.feed-like-btn.liked {
  border-color: #e74c3c;
  color: #e74c3c;
}
.feed-like-btn:hover {
  background: var(--bg3);
}

/* Load more */
.load-more-btn {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg2);
  color: var(--accent);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.load-more-btn:hover {
  border-color: var(--accent);
}
.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* States */
.feed-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 0;
  color: var(--muted);
  font-size: 14px;
}
.feed-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.feed-empty {
  text-align: center;
  color: var(--muted);
  font-size: 14px;
  padding: 60px 0;
}

/* Mobile */
@media (max-width: 640px) {
  .feed-page { padding: 16px 12px; }
  .feed-page h2 { font-size: 19px; }
  .feed-card { border-radius: 12px; }
  .feed-image { max-height: 320px; }
}
</style>
