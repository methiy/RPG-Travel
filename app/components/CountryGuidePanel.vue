<template>
  <div class="guide-panel">
    <button class="guide-toggle" @click="open = !open">
      <span class="guide-toggle-icon">📖</span>
      <span class="guide-toggle-text">{{ open ? '收起国家攻略' : '查看国家攻略' }}</span>
      <span class="guide-toggle-arrow">{{ open ? '▲' : '▼' }}</span>
    </button>

    <div v-if="open" class="guide-content">
      <!-- Static guide data (if available) -->
      <template v-if="guide">
        <div class="guide-item">
          <div class="guide-item-title">🛂 签证信息</div>
          <div class="guide-item-text">{{ guide.visa }}</div>
        </div>
        <div class="guide-item">
          <div class="guide-item-title">💱 货币汇率</div>
          <div class="guide-item-text">{{ guide.currency }}</div>
        </div>
        <div v-if="guide.language.length" class="guide-item">
          <div class="guide-item-title">🗣️ 语言提示</div>
          <ul><li v-for="(l, i) in guide.language" :key="i">{{ l }}</li></ul>
        </div>
        <div v-if="guide.emergencyContacts.length" class="guide-item">
          <div class="guide-item-title">🆘 紧急联系</div>
          <ul><li v-for="(c, i) in guide.emergencyContacts" :key="i">{{ c }}</li></ul>
        </div>
        <div class="guide-item">
          <div class="guide-item-title">🌤️ 最佳季节</div>
          <div class="guide-item-text">{{ guide.bestSeasons }}</div>
        </div>
        <div class="guide-item">
          <div class="guide-item-title">💰 预算范围</div>
          <div class="guide-item-text">{{ guide.budgetRange }}</div>
        </div>
        <div v-if="guide.culturalDos.length" class="guide-item">
          <div class="guide-item-title">✅ 文化礼仪</div>
          <ul><li v-for="(d, i) in guide.culturalDos" :key="i">{{ d }}</li></ul>
        </div>
        <div v-if="guide.culturalDonts.length" class="guide-item">
          <div class="guide-item-title">❌ 文化禁忌</div>
          <ul><li v-for="(d, i) in guide.culturalDonts" :key="i">{{ d }}</li></ul>
        </div>
        <div v-if="guide.packingEssentials.length" class="guide-item">
          <div class="guide-item-title">🎒 必备物品</div>
          <ul><li v-for="(p, i) in guide.packingEssentials" :key="i">{{ p }}</li></ul>
        </div>
        <div v-if="guide.safetyNotes.length" class="guide-item">
          <div class="guide-item-title">🛡️ 安全须知</div>
          <ul><li v-for="(s, i) in guide.safetyNotes" :key="i">{{ s }}</li></ul>
        </div>
      </template>

      <!-- AI generation button and content -->
      <div class="ai-guide-section">
        <button
          v-if="!aiContent && !aiLoading"
          class="ai-generate-btn"
          @click="handleGenerate"
        >
          🤖 AI 生成更详细的攻略
        </button>

        <div v-if="aiLoading" class="ai-loading">
          <div class="ai-spinner" />
          <span>AI 正在生成攻略...</span>
        </div>

        <div v-if="aiError" class="ai-error">
          ❌ {{ aiError }}
          <button class="ai-retry" @click="handleGenerate">重试</button>
        </div>

        <div v-if="aiContent" class="ai-content">
          <div class="ai-badge">🤖 AI 生成</div>
          <div class="ai-text" v-html="renderMarkdown(aiContent)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CountryGuide } from '~/types'

const props = defineProps<{
  guide?: CountryGuide
  countryName?: string
}>()

const open = ref(false)
const aiContent = ref('')
const aiLoading = ref(false)
const aiError = ref('')
let abortFn: (() => void) | null = null

function handleGenerate() {
  if (!props.countryName) return

  const { checkConfigured, generateGuide } = useAI()

  aiLoading.value = true
  aiError.value = ''
  aiContent.value = ''

  checkConfigured().then((configured) => {
    if (!configured) {
      aiLoading.value = false
      aiError.value = '请先在设置页面配置 AI'
      return
    }

    const { abort } = generateGuide(
      'country',
      props.countryName!,
      undefined,
      (chunk) => {
        aiContent.value += chunk
      },
      () => {
        aiLoading.value = false
      },
      (err) => {
        aiLoading.value = false
        aiError.value = err
      },
    )
    abortFn = abort
  })
}

onBeforeUnmount(() => {
  abortFn?.()
})

// Simple markdown renderer
function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^## (.+)$/gm, '<h4 class="ai-h2">$1</h4>')
    .replace(/^### (.+)$/gm, '<h5 class="ai-h3">$1</h5>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/\n\n/g, '<br/>')
    .replace(/\n/g, ' ')
}
</script>

<style scoped>
.guide-panel {
  margin-bottom: 16px;
}
.guide-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg2);
  color: var(--text);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}
.guide-toggle:hover {
  border-color: var(--accent);
}
.guide-toggle-icon {
  font-size: 18px;
}
.guide-toggle-text {
  flex: 1;
  text-align: left;
}
.guide-toggle-arrow {
  font-size: 10px;
  color: var(--muted);
}
.guide-content {
  margin-top: 10px;
  padding: 14px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.guide-item {
  font-size: 12px;
}
.guide-item-title {
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 4px;
}
.guide-item-text {
  color: var(--muted);
  line-height: 1.6;
}
.guide-item ul {
  margin: 0;
  padding-left: 16px;
}
.guide-item li {
  color: var(--muted);
  line-height: 1.6;
}

/* AI section */
.ai-guide-section {
  grid-column: 1 / -1;
  border-top: 1px solid var(--border);
  padding-top: 12px;
  margin-top: 4px;
}

.ai-generate-btn {
  display: block;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px dashed var(--accent);
  background: rgba(74, 158, 255, 0.05);
  color: var(--accent);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.ai-generate-btn:hover {
  background: rgba(74, 158, 255, 0.1);
  border-style: solid;
}

.ai-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  color: var(--accent);
  font-size: 13px;
}
.ai-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.ai-error {
  padding: 10px 14px;
  background: rgba(214, 48, 49, 0.1);
  border: 1px solid rgba(214, 48, 49, 0.2);
  border-radius: 10px;
  color: var(--red);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ai-retry {
  margin-left: auto;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--red);
  background: transparent;
  color: var(--red);
  font-size: 12px;
  cursor: pointer;
}

.ai-content {
  position: relative;
}
.ai-badge {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(74, 158, 255, 0.1);
  border: 1px solid rgba(74, 158, 255, 0.2);
  border-radius: 6px;
  font-size: 11px;
  color: var(--accent);
  margin-bottom: 8px;
}
.ai-text {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.7;
}
.ai-text :deep(h4) {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
  margin: 12px 0 4px;
}
.ai-text :deep(h5) {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin: 8px 0 4px;
}
.ai-text :deep(ul) {
  margin: 4px 0;
  padding-left: 18px;
}
.ai-text :deep(li) {
  margin-bottom: 2px;
}
.ai-text :deep(strong) {
  color: var(--text);
}

@media (max-width: 640px) {
  .guide-content {
    grid-template-columns: 1fr;
    padding: 10px;
  }
}
</style>
