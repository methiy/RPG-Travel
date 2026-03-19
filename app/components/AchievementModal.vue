<template>
  <div class="ach-overlay" :class="{ show: visible }">
    <div class="ach-modal">
      <div class="ach-icon">{{ data.icon }}</div>
      <div class="ach-title">{{ data.title }}</div>
      <div class="ach-sub">{{ data.sub }}</div>
      <div class="ach-exp">+{{ data.exp }} EXP</div>
      <div class="ach-medal">{{ data.medal }}</div>
      <button class="ach-close" @click="close">继续冒险 ✨</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { visible, data, close } = useAchievement()
</script>

<style scoped>
.ach-overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, .85);
  z-index: 300;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity .3s;
}
.ach-overlay.show { opacity: 1; pointer-events: all; }
.ach-modal {
  background: linear-gradient(135deg, var(--bg3), var(--bg2));
  border: 2px solid var(--gold);
  border-radius: 20px;
  padding: 40px 32px;
  text-align: center;
  max-width: 380px; width: 90%;
  transform: scale(.85);
  transition: transform .3s;
}
.ach-overlay.show .ach-modal { transform: scale(1); }
.ach-icon { font-size: 72px; margin-bottom: 16px; animation: bounce .6s ease; }
.ach-title { font-size: 20px; font-weight: 800; color: var(--gold); margin-bottom: 8px; }
.ach-sub { color: var(--muted); font-size: 14px; margin-bottom: 8px; }
.ach-exp { font-size: 26px; font-weight: 800; color: var(--accent); margin: 12px 0; }
.ach-medal { font-size: 15px; color: var(--gold); margin-bottom: 16px; }
.ach-close {
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff; border: none; border-radius: 8px;
  font-size: 15px; font-weight: 700; cursor: pointer;
}
</style>
