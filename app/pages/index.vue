<script setup lang="ts">
import { CHAPTERS } from '~/data/chapters'
</script>

<template>
  <div class="world-page">
    <div class="world-header">
      <h2>🌍 世界地图</h2>
      <p>选择一个大陆章节开始你的旅行冒险——完成任务解锁更多地区</p>
    </div>
    <ClientOnly>
      <div class="chapters-grid">
        <ChapterCard v-for="ch in CHAPTERS" :key="ch.id" :chapter="ch" />
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.world-page {
  padding: 24px;
}
.world-header {
  margin-bottom: 24px;
}
.world-header h2 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 6px;
}
.world-header p {
  color: var(--muted);
}
.chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
</style>
