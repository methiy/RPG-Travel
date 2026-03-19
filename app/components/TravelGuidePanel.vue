<script setup lang="ts">
import type { TaskGuide } from '~/types'

defineProps<{
  guide: TaskGuide
}>()

const expanded = ref(false)
</script>

<template>
  <div class="guide-panel">
    <button class="guide-toggle" :class="{ expanded }" @click="expanded = !expanded">
      <span>📖 查看旅行攻略</span>
      <span class="guide-arrow">{{ expanded ? '▲' : '▼' }}</span>
    </button>

    <div v-if="expanded" class="guide-content">
      <div class="guide-section">
        <h5>💡 实用贴士</h5>
        <ul>
          <li v-for="(tip, i) in guide.tips" :key="i">{{ tip }}</li>
        </ul>
      </div>

      <div class="guide-section">
        <h5>🍜 美食推荐</h5>
        <ul>
          <li v-for="(spot, i) in guide.foodSpots" :key="i">{{ spot }}</li>
        </ul>
      </div>

      <div class="guide-section">
        <h5>🚇 交通指南</h5>
        <ul>
          <li v-for="(t, i) in guide.transport" :key="i">{{ t }}</li>
        </ul>
      </div>

      <div class="guide-row">
        <div class="guide-card">
          <h5>⏰ 最佳时间</h5>
          <p>{{ guide.bestTime }}</p>
        </div>
        <div class="guide-card">
          <h5>💰 预算参考</h5>
          <p>{{ guide.budget }}</p>
        </div>
      </div>

      <div class="guide-section">
        <h5>🔑 当地秘籍</h5>
        <ul class="local-tips">
          <li v-for="(tip, i) in guide.localTips" :key="i">{{ tip }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guide-panel {
  margin-bottom: 16px;
}

.guide-toggle {
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #1a2a1a, #0d1a2a);
  border: 1px solid #2a4a3a;
  border-radius: 10px;
  color: #7dcea0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s;
}

.guide-toggle:hover {
  background: linear-gradient(135deg, #1f3520, #122535);
  border-color: #3a6a50;
}

.guide-toggle.expanded {
  border-radius: 10px 10px 0 0;
  border-bottom-color: transparent;
}

.guide-arrow {
  font-size: 10px;
  transition: transform 0.3s;
}

.guide-content {
  background: linear-gradient(135deg, #0d1a15, #0a1520);
  border: 1px solid #2a4a3a;
  border-top: none;
  border-radius: 0 0 10px 10px;
  padding: 16px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.guide-section {
  margin-bottom: 14px;
}

.guide-section:last-child {
  margin-bottom: 0;
}

.guide-section h5,
.guide-card h5 {
  font-size: 12px;
  font-weight: 700;
  color: #7dcea0;
  margin-bottom: 6px;
}

.guide-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guide-section ul li {
  font-size: 12px;
  color: #bbc;
  padding: 4px 0 4px 14px;
  position: relative;
  line-height: 1.6;
}

.guide-section ul li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #5a9a7a;
}

.local-tips li::before {
  content: '★' !important;
  color: #d4a017 !important;
}

.guide-row {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.guide-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #2a3a4a;
  border-radius: 8px;
  padding: 10px 12px;
}

.guide-card p {
  font-size: 12px;
  color: #bbc;
  line-height: 1.5;
  margin: 0;
}
</style>
