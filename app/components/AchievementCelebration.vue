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
