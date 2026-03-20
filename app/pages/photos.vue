<template>
  <div class="photos-page">
    <h2>📷 我的照片</h2>
    <p>你的旅行打卡照片，记录每一次冒险</p>

    <ClientOnly>
      <div v-if="sortedPhotos.length === 0" class="empty-state">
        <div class="empty-icon">📸</div>
        <p>还没有打卡照片</p>
        <span>完成任务时拍照打卡，照片会出现在这里</span>
      </div>

      <div v-else class="photo-grid">
        <div
          v-for="photo in sortedPhotos"
          :key="photo.taskId"
          class="photo-card"
          @click="openDetail(photo)"
        >
          <div class="photo-thumb">
            <img :src="photo.dataUrl" :alt="getTaskName(photo.taskId)" loading="lazy" />
          </div>
          <div class="photo-info">
            <div class="photo-name">{{ getTaskName(photo.taskId) }}</div>
            <div class="photo-meta">
              <span v-if="getTaskCity(photo.taskId)">📍 {{ getTaskCity(photo.taskId) }}</span>
              <span>🕐 {{ formatDate(photo.timestamp) }}</span>
            </div>
            <div v-if="photo.comment" class="photo-comment-preview">
              💬 {{ photo.comment.slice(0, 30) }}{{ photo.comment.length > 30 ? '...' : '' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <Teleport to="body">
        <div v-if="selectedPhoto" class="modal-overlay" @click.self="closeDetail">
          <div class="modal-content">
            <button class="modal-close" @click="closeDetail">&times;</button>
            <div class="modal-img">
              <img :src="selectedPhoto.dataUrl" :alt="getTaskName(selectedPhoto.taskId)" />
            </div>
            <div class="modal-info">
              <h3>{{ getTaskName(selectedPhoto.taskId) }}</h3>
              <div class="modal-meta">
                <span v-if="getTaskCity(selectedPhoto.taskId)">📍 {{ getTaskCity(selectedPhoto.taskId) }}</span>
                <span>🕐 {{ formatDate(selectedPhoto.timestamp) }}</span>
                <span v-if="selectedPhoto.lat && selectedPhoto.lng">
                  🌐 {{ selectedPhoto.lat.toFixed(4) }}, {{ selectedPhoto.lng.toFixed(4) }}
                </span>
              </div>
              <div class="comment-section">
                <label for="comment-input">💬 留言</label>
                <textarea
                  id="comment-input"
                  v-model="editComment"
                  maxlength="500"
                  rows="3"
                  placeholder="写下你的旅行感想..."
                />
                <div class="comment-footer">
                  <span class="char-count">{{ editComment.length }}/500</span>
                  <button
                    class="btn-save"
                    :disabled="saving || editComment === (selectedPhoto.comment || '')"
                    @click="handleSaveComment"
                  >
                    {{ saving ? '保存中...' : '保存留言' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { CheckinPhoto, Task } from '~/types'
import { TASKS } from '~/data/tasks'

const { getPhotos, updateComment } = usePhotoCheckin()

// Build a flat task lookup map
const taskMap = computed(() => {
  const map = new Map<string, Task>()
  for (const tasks of Object.values(TASKS)) {
    for (const t of tasks) {
      map.set(t.id, t)
    }
  }
  return map
})

const sortedPhotos = computed(() => {
  return [...getPhotos()].sort((a, b) => b.timestamp - a.timestamp)
})

function getTaskName(taskId: string): string {
  return taskMap.value.get(taskId)?.name || taskId
}

function getTaskCity(taskId: string): string {
  return taskMap.value.get(taskId)?.city || ''
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Detail modal
const selectedPhoto = ref<CheckinPhoto | null>(null)
const editComment = ref('')
const saving = ref(false)

function openDetail(photo: CheckinPhoto) {
  selectedPhoto.value = photo
  editComment.value = photo.comment || ''
}

function closeDetail() {
  selectedPhoto.value = null
  editComment.value = ''
}

async function handleSaveComment() {
  if (!selectedPhoto.value) return
  saving.value = true
  try {
    await updateComment(selectedPhoto.value.taskId, editComment.value)
    selectedPhoto.value.comment = editComment.value
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.photos-page {
  padding: 24px;
}
.photos-page h2 {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 6px;
}
.photos-page > p {
  color: var(--muted);
  margin-bottom: 24px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.empty-state p {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}
.empty-state span {
  color: var(--muted);
  font-size: 13px;
}

/* Photo Grid */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.photo-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.photo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
.photo-thumb {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}
.photo-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo-info {
  padding: 10px 12px 12px;
}
.photo-name {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.photo-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--muted);
  font-size: 11px;
  margin-bottom: 4px;
}
.photo-comment-preview {
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}
.modal-content {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  max-width: 560px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-img img {
  width: 100%;
  display: block;
  border-radius: 16px 16px 0 0;
}
.modal-info {
  padding: 16px 20px 20px;
}
.modal-info h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}
.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--muted);
  font-size: 12px;
  margin-bottom: 16px;
}

/* Comment */
.comment-section label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--muted);
}
.comment-section textarea {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: #fff;
  font-size: 13px;
  resize: vertical;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.comment-section textarea:focus {
  border-color: var(--accent);
}
.comment-section textarea::placeholder {
  color: var(--muted);
  opacity: 0.5;
}
.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
.char-count {
  font-size: 11px;
  color: var(--muted);
}
.btn-save {
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-save:hover {
  opacity: 0.9;
}
.btn-save:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .photos-page { padding: 16px 12px; }
  .photos-page h2 { font-size: 19px; }
  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
  .modal-content { max-width: 100%; }
  .modal-info { padding: 12px 16px 16px; }
}
</style>
