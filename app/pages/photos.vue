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

              <!-- AI Photo Analysis -->
              <div class="ai-analyze-section">
                <button
                  v-if="!photoAnalysis && !analyzing"
                  class="btn-analyze"
                  @click="handleAnalyze"
                >
                  🤖 AI 分析照片
                </button>

                <div v-if="analyzing" class="analyzing-state">
                  <div class="analyze-spinner" />
                  <span>AI 正在分析照片...</span>
                </div>

                <div v-if="analyzeError" class="analyze-error">
                  ❌ {{ analyzeError }}
                </div>

                <div v-if="photoAnalysis" class="analysis-result">
                  <div class="analysis-badge">🤖 AI 分析结果</div>
                  <div class="analysis-item">
                    <div class="analysis-label">📷 场景描述</div>
                    <div class="analysis-text">{{ photoAnalysis.scene }}</div>
                  </div>
                  <div v-if="photoAnalysis.landmarks.length" class="analysis-item">
                    <div class="analysis-label">🏛️ 地标识别</div>
                    <div class="analysis-tags">
                      <span v-for="(l, i) in photoAnalysis.landmarks" :key="i" class="analysis-tag">{{ l }}</span>
                    </div>
                  </div>
                  <div class="analysis-item">
                    <div class="analysis-label">📝 旅行日记</div>
                    <div class="analysis-text diary">{{ photoAnalysis.diary }}</div>
                  </div>
                  <button class="btn-use-diary" @click="useDiaryAsComment">
                    📋 用日记作为留言
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
import type { CheckinPhoto, Task, AIPhotoAnalysis } from '~/types'
import { TASKS } from '~/data/tasks'

const { photos, updateComment } = usePhotoCheckin()

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
  return [...photos.value].sort((a, b) => b.timestamp - a.timestamp)
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
  photoAnalysis.value = null
  analyzeError.value = ''
}

function closeDetail() {
  selectedPhoto.value = null
  editComment.value = ''
  photoAnalysis.value = null
  analyzeError.value = ''
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

// ── AI Photo Analysis ──────────────────────────────────
const photoAnalysis = ref<AIPhotoAnalysis | null>(null)
const analyzing = ref(false)
const analyzeError = ref('')

async function handleAnalyze() {
  if (!selectedPhoto.value) return

  const { checkConfigured, analyzePhoto } = useAI()

  const configured = await checkConfigured()
  if (!configured) {
    analyzeError.value = '请先在设置页面配置 AI'
    return
  }

  analyzing.value = true
  analyzeError.value = ''
  photoAnalysis.value = null

  try {
    const taskName = getTaskName(selectedPhoto.value.taskId)
    const result = await analyzePhoto(selectedPhoto.value.dataUrl, taskName)
    photoAnalysis.value = result
  } catch (err: unknown) {
    analyzeError.value = (err as Error).message || '照片分析失败'
  } finally {
    analyzing.value = false
  }
}

function useDiaryAsComment() {
  if (photoAnalysis.value?.diary) {
    editComment.value = photoAnalysis.value.diary.slice(0, 500)
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

/* AI Photo Analysis */
.ai-analyze-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.btn-analyze {
  display: block;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px dashed var(--accent);
  background: rgba(74, 158, 255, 0.05);
  color: var(--accent);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-analyze:hover {
  background: rgba(74, 158, 255, 0.1);
  border-style: solid;
}

.analyzing-state {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  color: var(--accent);
  font-size: 13px;
}
.analyze-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.analyze-error {
  padding: 8px 12px;
  background: rgba(214, 48, 49, 0.1);
  border: 1px solid rgba(214, 48, 49, 0.2);
  border-radius: 8px;
  color: var(--red);
  font-size: 12px;
}

.analysis-result {
  background: var(--bg3);
  border: 1px solid rgba(74, 158, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
}
.analysis-badge {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(74, 158, 255, 0.1);
  border: 1px solid rgba(74, 158, 255, 0.2);
  border-radius: 6px;
  font-size: 11px;
  color: var(--accent);
  margin-bottom: 10px;
}
.analysis-item {
  margin-bottom: 10px;
}
.analysis-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 4px;
}
.analysis-text {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.6;
}
.analysis-text.diary {
  font-style: italic;
  color: var(--text);
}
.analysis-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.analysis-tag {
  padding: 2px 8px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 11px;
  color: var(--text);
}
.btn-use-diary {
  display: block;
  width: 100%;
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg2);
  color: var(--text);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-use-diary:hover {
  border-color: var(--accent);
}
</style>
