<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { init } = useTheme()
onMounted(() => init())
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #07090f; --bg2: #0d1020; --bg3: #131828; --border: #1e2d4a;
  --accent: #4a9eff; --accent2: #7b5ea7; --gold: #ffd700; --green: #3ddc84;
  --red: #ff5555; --text: #e8eaf6; --muted: #6b7fa3;
  --theme-primary: #4a9eff; --theme-secondary: #7b5ea7;
  --theme-card-bg: linear-gradient(135deg, #131828, #0d1020);
}

[data-theme="light"] {
  --bg: #ffffff; --bg2: #f5f5f7; --bg3: #e8e8ed; --border: #d2d2d7;
  --accent: #0071e3; --accent2: #7b5ea7; --gold: #e8a800; --green: #28a745;
  --red: #ff3b30; --text: #1d1d1f; --muted: #86868b;
  --theme-primary: #0071e3; --theme-secondary: #7b5ea7;
  --theme-card-bg: linear-gradient(135deg, #f5f5f7, #ffffff);
}

body {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
}

/* Scrollbar */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

/* Page transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Empty state */
.empty { text-align: center; padding: 40px; color: var(--muted); }

/* Mobile adaptation */
@media (max-width: 640px) {
  .empty { padding: 24px 16px; }
}
</style>
