<script setup lang="ts">
import type { ShareTemplate } from '~/types'

const props = defineProps<{
  modelValue: ShareTemplate | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ShareTemplate]
}>()

const templates = [
  { id: 'overview' as ShareTemplate, icon: '🌍', name: '成就总览', desc: '展示你的全部旅行统计' },
  { id: 'trip' as ShareTemplate, icon: '✈️', name: '单次旅行', desc: '分享某个国家的旅行记录' },
  { id: 'medals' as ShareTemplate, icon: '🏅', name: '勋章墙', desc: '展示你的勋章收藏' },
]
</script>

<template>
  <div class="tpl-grid">
    <button
      v-for="t in templates"
      :key="t.id"
      class="tpl-card"
      :class="{ active: props.modelValue === t.id }"
      @click="emit('update:modelValue', t.id)"
    >
      <span class="tpl-icon">{{ t.icon }}</span>
      <span class="tpl-name">{{ t.name }}</span>
      <span class="tpl-desc">{{ t.desc }}</span>
    </button>
  </div>
</template>

<style scoped>
.tpl-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.tpl-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  border-radius: 16px;
  background: var(--bg2, #131828);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}
.tpl-card:hover {
  border-color: #4a9eff44;
  transform: translateY(-2px);
}
.tpl-card.active {
  border-color: #4a9eff;
  background: #4a9eff12;
}
.tpl-icon {
  font-size: 36px;
}
.tpl-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text, #e8eaf6);
}
.tpl-desc {
  font-size: 12px;
  color: var(--muted, #8890a8);
  text-align: center;
}
@media (max-width: 480px) {
  .tpl-grid { grid-template-columns: 1fr; }
}
</style>
