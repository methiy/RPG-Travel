<template>
  <div>
    <template v-if="!authState.loading && authState.user">
      <TopBar />
      <MainNav />
      <slot />
      <AchievementModal />
    </template>
    <div v-else-if="authState.loading" class="loading-screen">
      <div class="loading-logo">🌍</div>
      <div class="loading-text">加载中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { authState } = useAuth()
</script>

<style scoped>
.loading-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.loading-logo {
  font-size: 48px;
  animation: bounce 1.5s ease infinite;
}
.loading-text {
  color: var(--muted);
  font-size: 14px;
}
@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
</style>
