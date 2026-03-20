<template>
  <nav class="mainnav">
    <NuxtLink to="/" class="navbtn" :class="{ active: route.path === '/' }">🗺️ 世界地图</NuxtLink>
    <NuxtLink to="/medals" class="navbtn" :class="{ active: route.path.startsWith('/medals') }">🏅 勋章墙</NuxtLink>
    <NuxtLink to="/games" class="navbtn" :class="{ active: route.path.startsWith('/games') }">🎮 小游戏</NuxtLink>
    <NuxtLink to="/photos" class="navbtn" :class="{ active: route.path.startsWith('/photos') }">📷 我的照片</NuxtLink>
    <NuxtLink to="/profile" class="navbtn" :class="{ active: route.path.startsWith('/profile') }">👤 我的</NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
</script>

<style scoped>
.mainnav { display: flex; background: var(--bg2); border-bottom: 1px solid var(--border); overflow-x: auto; }
.mainnav::-webkit-scrollbar { display: none; }
.navbtn {
  padding: 12px 20px;
  background: none;
  border: none;
  color: var(--muted);
  font-size: 13px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: all .2s;
  text-decoration: none;
}
.navbtn.active { color: var(--accent); border-bottom-color: var(--accent); }
.navbtn:hover { color: var(--text); }

@media (max-width: 640px) {
  .mainnav { position: sticky; top: 0; z-index: 99; }
  .navbtn { padding: 10px 16px; font-size: 12px; }
}
</style>
