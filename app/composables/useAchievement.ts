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
  }

  function close() {
    visible.value = false
  }

  return { visible, data, show, close }
}
