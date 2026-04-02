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
      const ctx = new AudioContext()
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

  return { show, medalIcon, medalName, celebrate, dismiss, playSound }
}
