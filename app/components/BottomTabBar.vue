<template>
  <nav class="bottom-tab-bar">
    <NuxtLink
      v-for="group in NAV_GROUPS"
      :key="group.id"
      :to="group.items[0].path"
      class="tab-item"
      :class="{ active: currentGroup.id === group.id }"
    >
      <span class="tab-icon">{{ group.icon }}</span>
      <span class="tab-label">{{ group.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { NAV_GROUPS, findGroupByPath } from '~/constants/navigation'

const route = useRoute()
const currentGroup = computed(() => findGroupByPath(route.path))
</script>

<style scoped>
.bottom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--bg2);
  border-top: 1px solid var(--border);
  padding: 6px 0;
  padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px));
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 12px;
  text-decoration: none;
  color: var(--muted);
  transition: color 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.tab-item.active {
  color: var(--accent);
}

.tab-item:hover {
  color: var(--text);
}

.tab-icon {
  font-size: 22px;
  line-height: 1;
}

.tab-label {
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
}

@media (max-width: 640px) {
  .tab-icon { font-size: 20px; }
  .tab-label { font-size: 9px; }
}
</style>
