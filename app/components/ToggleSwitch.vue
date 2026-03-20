<template>
  <label class="toggle-switch" :class="{ active: modelValue }">
    <div class="toggle-track" @click="$emit('update:modelValue', !modelValue)">
      <div class="toggle-thumb" />
    </div>
    <div class="toggle-content">
      <div class="toggle-label">{{ label }}</div>
      <div v-if="description" class="toggle-desc">{{ description }}</div>
    </div>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label: string
  description?: string
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.toggle-switch {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--bg2);
  border: 1px solid var(--border);
  transition: all 0.2s;
}
.toggle-switch:hover {
  border-color: var(--accent);
}

.toggle-track {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: #2a3555;
  position: relative;
  flex-shrink: 0;
  transition: background 0.25s;
  cursor: pointer;
  margin-top: 2px;
}
.toggle-switch.active .toggle-track {
  background: var(--accent);
}

.toggle-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: transform 0.25s;
}
.toggle-switch.active .toggle-thumb {
  transform: translateX(20px);
}

.toggle-content {
  flex: 1;
  min-width: 0;
}
.toggle-label {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
}
.toggle-desc {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
  line-height: 1.4;
}
</style>
