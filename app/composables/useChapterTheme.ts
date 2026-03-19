import { CHAPTERS } from '~/data/chapters'

const DEFAULT_THEME = {
  primary: '#4a9eff',
  secondary: '#7b5ea7',
  cardBg: 'linear-gradient(135deg, #131828, #0d1020)',
}

export function useChapterTheme(chapterId?: Ref<string> | string) {
  function applyTheme(id: string | undefined) {
    if (import.meta.server) return
    const el = document.documentElement
    if (!id) {
      el.style.setProperty('--theme-primary', DEFAULT_THEME.primary)
      el.style.setProperty('--theme-secondary', DEFAULT_THEME.secondary)
      el.style.setProperty('--theme-card-bg', DEFAULT_THEME.cardBg)
      el.style.removeProperty('--theme-pattern')
      return
    }
    const chapter = CHAPTERS.find(c => c.id === id)
    if (!chapter) return
    el.style.setProperty('--theme-primary', chapter.theme.primary)
    el.style.setProperty('--theme-secondary', chapter.theme.secondary)
    el.style.setProperty('--theme-card-bg', chapter.theme.cardBg)
    el.style.setProperty('--theme-pattern', chapter.theme.pattern)
  }

  onMounted(() => {
    const id = typeof chapterId === 'string' ? chapterId : chapterId?.value
    applyTheme(id)
  })

  onBeforeUnmount(() => {
    applyTheme(undefined)
  })

  if (chapterId && typeof chapterId !== 'string') {
    watch(chapterId, (id) => applyTheme(id))
  }

  return { applyTheme }
}
