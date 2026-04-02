<script setup lang="ts">
import type { ShareTemplate, ShareSnapshotData } from '~/types'

const props = defineProps<{
  template: ShareTemplate
  snapshot: ShareSnapshotData
}>()

const canvasContainer = ref<HTMLDivElement>()
const { renderCard, downloadCard, createShareLink, generating, shareUrl } = useShareCard()

const canvas = ref<HTMLCanvasElement | null>(null)
const copied = ref(false)

// Re-render when template or snapshot changes
watch(
  () => [props.template, props.snapshot] as const,
  () => {
    if (!canvasContainer.value) return
    const c = renderCard(props.template, props.snapshot)
    canvas.value = c
    // Replace canvas in DOM
    canvasContainer.value.innerHTML = ''
    canvasContainer.value.appendChild(c)
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  if (!canvas.value) {
    const c = renderCard(props.template, props.snapshot)
    canvas.value = c
    canvasContainer.value?.appendChild(c)
  }
})

function handleDownload() {
  if (canvas.value) {
    downloadCard(canvas.value, props.template)
  }
}

async function handleShare() {
  await createShareLink(props.template, props.snapshot)
  copied.value = false
}

async function copyLink() {
  if (!shareUrl.value) return
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback: select text
  }
}
</script>

<template>
  <div class="preview-wrap">
    <div ref="canvasContainer" class="canvas-wrap" />

    <div class="actions">
      <button class="btn btn-download" @click="handleDownload">
        📥 保存图片
      </button>
      <button class="btn btn-share" :disabled="generating" @click="handleShare">
        {{ generating ? '⏳ 生成中...' : '🔗 生成链接' }}
      </button>
    </div>

    <div v-if="shareUrl" class="link-box">
      <input type="text" :value="shareUrl" readonly class="link-input" />
      <button class="btn btn-copy" @click="copyLink">
        {{ copied ? '✅ 已复制' : '📋 复制' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.preview-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.canvas-wrap {
  width: 100%;
  max-width: 360px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
.canvas-wrap :deep(canvas) {
  width: 100%;
  height: auto;
  display: block;
}
.actions {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 360px;
}
.btn {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-download {
  background: linear-gradient(135deg, #4a9eff, #7b5ea7);
  color: #fff;
}
.btn-download:hover { transform: translateY(-1px); }
.btn-share {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #1a1a2e;
}
.btn-share:hover:not(:disabled) { transform: translateY(-1px); }
.link-box {
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 360px;
  animation: fadeInUp 0.3s;
}
.link-input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #2a3050;
  background: #0e1424;
  color: #e8eaf6;
  font-size: 13px;
  outline: none;
}
.btn-copy {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: #4a9eff;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
