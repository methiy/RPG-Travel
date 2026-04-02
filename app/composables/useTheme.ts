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
