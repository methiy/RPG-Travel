<template>
  <div class="mc" :class="earned ? 'earned' : 'locked'">
    <div class="mi">{{ medal.icon }}</div>
    <div class="mn">{{ medal.name }}</div>
    <template v-if="earned">
      <div class="md">{{ medal.desc }}</div>
      <div class="ms">✅ 已获得</div>
    </template>
    <template v-else>
      <div class="ms">未解锁</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Medal } from '~/types'

defineProps<{
  medal: Medal
  earned: boolean
}>()
</script>

<style scoped>
.mc {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
  transition: all 0.3s;
}
.mc.earned {
  border-color: var(--gold);
  background: linear-gradient(135deg, #1a1200, #0f1028);
  cursor: default;
}
.mc.earned:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.2);
}
.mc.locked {
  opacity: 0.35;
  filter: grayscale(0.8);
}
.mi {
  font-size: 32px;
  margin-bottom: 8px;
}
.mn {
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}
.md {
  font-size: 10px;
  color: var(--muted);
}
.mc.earned .mn {
  color: var(--gold);
}
.ms {
  font-size: 10px;
  margin-top: 6px;
}
</style>
