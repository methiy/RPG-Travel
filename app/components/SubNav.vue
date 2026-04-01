<template>
  <nav v-if="currentGroup.items.length > 1" class="subnav">
    <NuxtLink
      v-for="item in currentGroup.items"
      :key="item.path"
      :to="item.path"
      class="navbtn"
      :class="{ active: isActive(item.path) }"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { findGroupByPath } from '~/constants/navigation'

const route = useRoute()
const currentGroup = computed(() => findGroupByPath(route.path))

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.subnav {
  display: flex;
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
}
.subnav::-webkit-scrollbar { display: none; }

.navbtn {
  padding: 10px 20px;
  background: none;
  border: none;
  color: var(--muted);
  font-size: 13px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: all 0.2s;
  text-decoration: none;
}
.navbtn.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
.navbtn:hover {
  color: var(--text);
}

@media (max-width: 640px) {
  .subnav { position: sticky; top: 0; z-index: 99; }
  .navbtn { padding: 8px 16px; font-size: 12px; }
}
</style>
