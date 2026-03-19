<template>
  <div class="games-page">
    <h2>🎮 旅行小游戏</h2>
    <p>在游戏中学习旅行知识，顺便赚取经验值！</p>

    <template v-if="activeGame">
      <button class="back-btn" @click="activeGame = null">← 返回游戏列表</button>
      <RouletteGame v-if="activeGame === 'roulette'" />
      <QuizGame v-if="activeGame === 'quiz'" />
    </template>

    <div v-else class="games-grid">
      <div
        v-for="game in games"
        :key="game.id"
        class="game-card"
        @click="activeGame = game.id"
      >
        <div class="game-icon">{{ game.icon }}</div>
        <div class="game-title">{{ game.title }}</div>
        <div class="game-desc">{{ game.desc }}</div>
        <div class="game-reward">{{ game.reward }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeGame = ref<null | 'roulette' | 'quiz' | 'packing' | 'match'>(null)

const games = [
  { id: 'roulette' as const, icon: '🎡', title: '假期轮盘', desc: '转动命运之轮，随机为你决定下一个旅行目的地！', reward: '🎲 每天可转3次' },
  { id: 'quiz' as const, icon: '🧭', title: '旅行知识问答', desc: '测试你的全球地理和旅行文化知识，答对赢经验！', reward: '⚡ 每题 +15~20 EXP' },
  { id: 'packing' as const, icon: '🧳', title: '行李打包挑战', desc: '针对不同目的地，快速打包必备物品，别带错了！', reward: '⚡ 完成 +80 EXP' },
  { id: 'match' as const, icon: '🃏', title: '地标配对游戏', desc: '翻牌配对全球知名地标，考验你的地理记忆力！', reward: '⚡ 完成 +60 EXP' },
]
</script>

<style scoped>
.games-page { padding: 24px }
.games-page h2 { font-size: 22px; font-weight: 800; margin-bottom: 6px }
.games-page > p { color: var(--muted); margin-bottom: 24px }

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.game-card {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all .3s;
  text-align: center;
}
.game-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(74, 158, 255, .2);
}

.game-icon { font-size: 48px; margin-bottom: 12px }
.game-title { font-size: 16px; font-weight: 700; margin-bottom: 6px }
.game-desc { font-size: 13px; color: var(--muted); line-height: 1.6 }
.game-reward {
  margin-top: 12px;
  font-size: 12px;
  color: var(--accent);
  padding: 4px 12px;
  border-radius: 10px;
  background: var(--bg2);
  display: inline-block;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg2);
  color: var(--muted);
  cursor: pointer;
  font-size: 13px;
  margin-bottom: 16px;
  transition: all .2s;
}
.back-btn:hover { color: var(--text); border-color: var(--text) }
</style>
