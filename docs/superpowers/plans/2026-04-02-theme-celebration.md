# 主题切换 + 成就动画强化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 添加深色/浅色主题切换 + 全屏成就解锁庆祝动画（粒子、光束、音效）。

**Architecture:** 主题切换通过 `data-theme` 属性 + CSS 变量覆盖实现。成就动画用独立全屏组件，Canvas 粒子 + CSS 动画 + 音效，挂载在 default layout。

**Tech Stack:** Nuxt 4, Vue 3, Canvas API, Web Audio API, CSS animations

---

## File Structure

| File | Responsibility |
|------|---------------|
| `app/composables/useTheme.ts` | 新建：主题管理 |
| `app/app.vue` | 修改：添加浅色变量 |
| `app/pages/settings.vue` | 修改：添加主题切换开关 |
| `app/composables/useCelebration.ts` | 新建：庆祝动画触发控制 |
| `app/components/AchievementCelebration.vue` | 新建：全屏庆祝动画 |
| `app/layouts/default.vue` | 修改：挂载庆祝组件 |
| `app/composables/useAchievement.ts` | 修改：触发庆祝动画 |
| `app/components/AchievementModal.vue` | 修改：增强动画效果 |

---

### Task 1: useTheme composable

**Files:**
- Create: `app/composables/useTheme.ts`

- [ ] **Step 1: 创建 `app/composables/useTheme.ts`**

```typescript
const THEME_KEY = 'theme'

export function useTheme() {
  const isDark = useState('theme-dark', () => true)

  function apply(dark: boolean) {
    if (import.meta.server) return
    isDark.value = dark
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
  }

  function toggle() {
    apply(!isDark.value)
  }

  function init() {
    if (import.meta.server) return
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light') {
      apply(false)
    } else {
      apply(true)
    }
  }

  return { isDark, toggle, init }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/composables/useTheme.ts
git commit -m "feat(theme): add useTheme composable"
```

---

### Task 2: 浅色主题 CSS 变量

**Files:**
- Modify: `app/app.vue`

- [ ] **Step 1: 在 `app/app.vue` 的 `<style>` 中，在 `:root { ... }` 块之后添加浅色主题变量覆盖**

在 `:root { ... }` 的关闭 `}` 之后、`body {` 之前添加：

```css
[data-theme="light"] {
  --bg: #ffffff; --bg2: #f5f5f7; --bg3: #e8e8ed; --border: #d2d2d7;
  --accent: #0071e3; --accent2: #7b5ea7; --gold: #e8a800; --green: #28a745;
  --red: #ff3b30; --text: #1d1d1f; --muted: #86868b;
  --theme-primary: #0071e3; --theme-secondary: #7b5ea7;
  --theme-card-bg: linear-gradient(135deg, #f5f5f7, #ffffff);
}
```

- [ ] **Step 2: 在 `<script>` 或 `<template>` 中初始化主题**

在 `<template>` 的 `<NuxtLayout>` 之前添加一个 ClientOnly 调用来初始化主题。修改 app.vue 的 template 部分为：

```vue
<template>
  <ClientOnly>
    <ThemeInit />
  </ClientOnly>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

然后创建一个极简的 `app/components/ThemeInit.vue` 组件：

```vue
<script setup lang="ts">
const { init } = useTheme()
onMounted(() => init())
</script>
<template><span /></template>
```

或者更简单：在 app.vue 中用 `<script setup>` 代替纯 `<style>` 方式。修改 app.vue 添加 script：

在 `</template>` 和 `<style>` 之间添加：

```vue
<script setup lang="ts">
const { init } = useTheme()
onMounted(() => init())
</script>
```

这样不需要额外组件。

- [ ] **Step 3: Commit**

```bash
git add app/app.vue
git commit -m "feat(theme): add light theme CSS variables and init"
```

---

### Task 3: Settings 页面主题切换开关

**Files:**
- Modify: `app/pages/settings.vue`

- [ ] **Step 1: 在 settings.vue 模板中，在 Privacy Settings section 之前添加主题切换 section**

在 `<template v-else>` 之后、`<!-- ══ Privacy Settings ══ -->` 之前插入：

```html
        <!-- ══ Theme Settings ══ -->
        <div class="settings-section">
          <h3>🎨 主题设置</h3>
          <p class="section-desc">切换深色或浅色主题</p>
          <div class="theme-toggle">
            <button
              class="theme-btn"
              :class="{ active: isDark }"
              @click="setDark(true)"
            >🌙 深色</button>
            <button
              class="theme-btn"
              :class="{ active: !isDark }"
              @click="setDark(false)"
            >☀️ 浅色</button>
          </div>
        </div>
```

- [ ] **Step 2: 在 `<script setup>` 中添加主题逻辑**

在 `const loading = ref(true)` 之前添加：

```typescript
const { isDark, toggle } = useTheme()

function setDark(dark: boolean) {
  if (isDark.value !== dark) toggle()
}
```

- [ ] **Step 3: 在 `<style scoped>` 中添加主题切换样式**

```css
/* Theme toggle */
.theme-toggle {
  display: flex;
  gap: 8px;
}
.theme-btn {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: var(--bg3);
  color: var(--muted);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.theme-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(74, 158, 255, 0.08);
}
.theme-btn:hover:not(.active) {
  border-color: var(--accent);
}
```

- [ ] **Step 4: Commit**

```bash
git add app/pages/settings.vue
git commit -m "feat(theme): add theme toggle to settings page"
```

---

### Task 4: useCelebration composable

**Files:**
- Create: `app/composables/useCelebration.ts`

- [ ] **Step 1: 创建 `app/composables/useCelebration.ts`**

```typescript
export function useCelebration() {
  const show = useState('celebration-show', () => false)
  const medalIcon = useState('celebration-icon', () => '')
  const medalName = useState('celebration-name', () => '')

  function celebrate(icon: string, name: string) {
    medalIcon.value = icon
    medalName.value = name
    show.value = true
  }

  function dismiss() {
    show.value = false
  }

  function playSound() {
    if (import.meta.server) return
    try {
      const audio = new Audio('/sounds/achievement.mp3')
      audio.volume = 0.5
      audio.play().catch(() => {})
    } catch {
      // Silently fail if audio not supported
    }
  }

  return { show, medalIcon, medalName, celebrate, dismiss, playSound }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/composables/useCelebration.ts
git commit -m "feat(celebration): add useCelebration composable"
```

---

### Task 5: AchievementCelebration 全屏动画组件

**Files:**
- Create: `app/components/AchievementCelebration.vue`

- [ ] **Step 1: 创建 `app/components/AchievementCelebration.vue`**

```vue
<script setup lang="ts">
const { show, medalIcon, medalName, dismiss, playSound } = useCelebration()

const canvasRef = ref<HTMLCanvasElement>()
let animFrame = 0

interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; color: string; alpha: number; rotation: number; rotSpeed: number
  shape: 'rect' | 'circle'
}

const COLORS = ['#ffd700', '#ff5555', '#4a9eff', '#7b5ea7', '#3ddc84']

function createParticles(): Particle[] {
  const particles: Particle[] = []
  const count = 80 + Math.floor(Math.random() * 40)
  for (let i = 0; i < count; i++) {
    particles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: -20 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 8 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    })
  }
  return particles
}

function runConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particles = createParticles()
  const gravity = 0.15

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const p of particles) {
      p.vy += gravity
      p.x += p.vx
      p.y += p.vy
      p.rotation += p.rotSpeed
      p.alpha -= 0.003

      if (p.alpha <= 0) continue

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = Math.max(0, p.alpha)
      ctx.fillStyle = p.color

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }

    const alive = particles.some(p => p.alpha > 0 && p.y < canvas.height + 50)
    if (alive && show.value) {
      animFrame = requestAnimationFrame(frame)
    }
  }

  animFrame = requestAnimationFrame(frame)
}

watch(show, (val) => {
  if (val) {
    nextTick(() => {
      if (canvasRef.value) runConfetti(canvasRef.value)
      setTimeout(() => playSound(), 1500)
      setTimeout(() => { if (show.value) dismiss() }, 4000)
    })
  } else {
    if (animFrame) cancelAnimationFrame(animFrame)
  }
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="celebration-overlay" @click="dismiss">
      <canvas ref="canvasRef" class="confetti-canvas" />
      <div class="light-rays" />
      <div class="medal-container">
        <div class="medal-glow" />
        <div class="medal-icon">{{ medalIcon }}</div>
        <div class="medal-label">解锁成就!</div>
        <div class="medal-name">{{ medalName }}</div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.celebration-overlay {
  position: fixed;
  inset: 0;
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  animation: overlayIn 0.3s ease;
  cursor: pointer;
}
.confetti-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.light-rays {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%);
  animation: raysPulse 2s ease-in-out infinite;
}
.medal-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 1;
}
.medal-glow {
  position: absolute;
  top: -20px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
  animation: glowPulse 1.5s ease-in-out infinite;
}
.medal-icon {
  font-size: 80px;
  animation: medalBounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
}
.medal-label {
  font-size: 28px;
  font-weight: 800;
  color: #ffd700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  animation: textFadeIn 0.5s ease 1s both;
}
.medal-name {
  font-size: 18px;
  color: #e8eaf6;
  animation: textFadeIn 0.5s ease 1.2s both;
}

@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes medalBounceIn {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.3); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes textFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes glowPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.3); opacity: 1; }
}
@keyframes raysPulse {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
}

@media (max-width: 640px) {
  .medal-icon { font-size: 60px; }
  .medal-label { font-size: 22px; }
  .medal-name { font-size: 16px; }
  .light-rays { width: 280px; height: 280px; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/components/AchievementCelebration.vue
git commit -m "feat(celebration): add full-screen achievement celebration with confetti"
```

---

### Task 6: 音效文件

**Files:**
- Create: `public/sounds/achievement.mp3`

- [ ] **Step 1: 生成一个简短的成就音效文件**

由于无法直接生成 MP3，使用 JavaScript 通过 Web Audio API 在 `useCelebration` 中生成合成音效作为替代。修改 `app/composables/useCelebration.ts` 的 `playSound` 函数：

```typescript
  function playSound() {
    if (import.meta.server) return
    try {
      const ctx = new AudioContext()
      // Victory chord: C5 + E5 + G5
      const notes = [523.25, 659.25, 783.99]
      const now = ctx.currentTime

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0, now + i * 0.1)
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.05)
        gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.8)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.1)
        osc.stop(now + i * 0.1 + 0.8)
      })
    } catch {
      // Silently fail
    }
  }
```

这样无需音效文件，纯代码合成一个三音和弦胜利音效。

- [ ] **Step 2: Commit**（如果修改了 useCelebration.ts）

```bash
git add app/composables/useCelebration.ts
git commit -m "feat(celebration): add synthesized victory sound effect"
```

---

### Task 7: 挂载庆祝组件 + 触发集成

**Files:**
- Modify: `app/layouts/default.vue`
- Modify: `app/composables/useAchievement.ts`

- [ ] **Step 1: 在 `app/layouts/default.vue` 中挂载 AchievementCelebration**

在 `<AchievementModal />` 之后添加：

```html
      <AchievementCelebration />
```

使模板变为：

```html
    <template v-if="!authState.loading && authState.user">
      <TopBar />
      <SubNav />
      <div class="page-content">
        <slot />
      </div>
      <BottomTabBar />
      <AchievementModal />
      <AchievementCelebration />
    </template>
```

- [ ] **Step 2: 修改 `app/composables/useAchievement.ts` — 在 show 时同时触发庆祝动画**

将整个文件替换为：

```typescript
interface AchievementData {
  icon: string
  title: string
  sub: string
  exp: number
  medal: string
}

export function useAchievement() {
  const visible = useState('achievement-visible', () => false)
  const data = useState<AchievementData>('achievement-data', () => ({
    icon: '', title: '', sub: '', exp: 0, medal: '',
  }))

  function show(info: AchievementData) {
    data.value = info
    visible.value = true

    // Trigger celebration animation
    const { celebrate } = useCelebration()
    celebrate(info.icon, info.title)
  }

  function close() {
    visible.value = false
  }

  return { visible, data, show, close }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/layouts/default.vue app/composables/useAchievement.ts
git commit -m "feat(celebration): integrate celebration into achievement flow"
```

---

### Task 8: 构建验证

**Files:** None

- [ ] **Step 1: 运行构建**

Run: `npm run build 2>&1 | tail -20`
Expected: 构建成功

- [ ] **Step 2: 修复错误（如有）**

- [ ] **Step 3: Push**

```bash
git push origin main
```
