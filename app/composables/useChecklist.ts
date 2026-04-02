import { COUNTRIES } from '~/data/countries'
import { CITIES } from '~/data/cities'

interface ChecklistItem {
  id: string
  text: string
  phase: 'before' | 'during'
  checked: boolean
}

export function useChecklist(countryId: Ref<string>) {
  const completedIds = ref<string[]>([])
  const loading = ref(false)
  let syncTimeout: ReturnType<typeof setTimeout> | null = null

  // Generate template items from country guide data
  const templateItems = computed<Omit<ChecklistItem, 'checked'>[]>(() => {
    const id = countryId.value
    if (!id) return []

    const country = COUNTRIES.find(c => c.id === id)
    if (!country?.guide) return []

    const guide = country.guide
    const items: Omit<ChecklistItem, 'checked'>[] = []

    // ── Before departure ──
    let beforeIdx = 0
    items.push({ id: `${id}-before-${beforeIdx++}`, text: '确认护照有效期（剩余6个月以上）', phase: 'before' })
    items.push({ id: `${id}-before-${beforeIdx++}`, text: '购买旅行保险', phase: 'before' })

    if (guide.visa) {
      items.push({ id: `${id}-before-${beforeIdx++}`, text: `确认签证: ${guide.visa}`, phase: 'before' })
    }
    if (guide.currency) {
      items.push({ id: `${id}-before-${beforeIdx++}`, text: `准备货币: ${guide.currency}`, phase: 'before' })
    }
    if (guide.packingEssentials) {
      for (const item of guide.packingEssentials) {
        items.push({ id: `${id}-before-${beforeIdx++}`, text: `准备${item}`, phase: 'before' })
      }
    }

    // ── During trip ──
    let duringIdx = 0
    items.push({ id: `${id}-during-${duringIdx++}`, text: '确认酒店入住信息', phase: 'during' })
    items.push({ id: `${id}-during-${duringIdx++}`, text: '下载离线地图', phase: 'during' })

    // First city transport tip
    const countryCities = CITIES.filter(c => c.countryId === id)
    if (countryCities.length > 0 && countryCities[0].guide?.transport?.length) {
      items.push({ id: `${id}-during-${duringIdx++}`, text: countryCities[0].guide.transport[0], phase: 'during' })
    }

    if (guide.culturalDos) {
      for (const item of guide.culturalDos) {
        items.push({ id: `${id}-during-${duringIdx++}`, text: `记得${item}`, phase: 'during' })
      }
    }

    return items
  })

  // Merge template with checked state
  const items = computed<ChecklistItem[]>(() => {
    const set = new Set(completedIds.value)
    return templateItems.value.map(t => ({
      ...t,
      checked: set.has(t.id),
    }))
  })

  const beforeItems = computed(() => items.value.filter(i => i.phase === 'before'))
  const duringItems = computed(() => items.value.filter(i => i.phase === 'during'))

  const progress = computed(() => {
    const total = items.value.length
    const done = items.value.filter(i => i.checked).length
    return { done, total, percent: total > 0 ? Math.round(done / total * 100) : 0 }
  })

  // Load from server
  async function load() {
    const id = countryId.value
    if (!id) return
    loading.value = true
    try {
      const data = await $fetch<{ completedItems: string[] }>('/api/checklist', {
        params: { country: id },
      })
      completedIds.value = data.completedItems
    } catch {
      // Silently fail
    } finally {
      loading.value = false
    }
  }

  // Save to server (debounced)
  function syncToServer() {
    if (syncTimeout) clearTimeout(syncTimeout)
    syncTimeout = setTimeout(async () => {
      const id = countryId.value
      if (!id) return
      try {
        await $fetch('/api/checklist', {
          method: 'PUT',
          body: { countryId: id, completedItems: completedIds.value },
        })
      } catch {
        // Silently fail
      }
    }, 500)
  }

  // Toggle item
  function toggle(itemId: string) {
    const idx = completedIds.value.indexOf(itemId)
    if (idx >= 0) {
      completedIds.value.splice(idx, 1)
    } else {
      completedIds.value.push(itemId)
    }
    syncToServer()
  }

  // Watch country change → reload
  watch(countryId, (newId) => {
    completedIds.value = []
    if (newId) load()
  }, { immediate: true })

  return {
    items,
    beforeItems,
    duringItems,
    progress,
    toggle,
    loading,
  }
}
