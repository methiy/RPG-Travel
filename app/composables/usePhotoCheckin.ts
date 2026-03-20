import type { CheckinPhoto } from '~/types'

const STORAGE_KEY = 'travelrpg2_photos'

function loadLocalPhotos(): CheckinPhoto[] {
  if (import.meta.server) return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function saveLocalPhotos(photos: CheckinPhoto[]) {
  if (import.meta.server) return
  // Keep max 100 photos to avoid localStorage overflow
  const trimmed = photos.length > 100 ? photos.slice(-100) : photos
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
}

export function usePhotoCheckin() {
  const photos = useState<CheckinPhoto[]>('checkin-photos', () => loadLocalPhotos())
  const { isLoggedIn } = useAuth()

  function getPhotos(): CheckinPhoto[] {
    return photos.value
  }

  function getPhotoForTask(taskId: string): CheckinPhoto | undefined {
    return photos.value.find(p => p.taskId === taskId)
  }

  async function savePhoto(photo: CheckinPhoto) {
    // Update reactive state
    const idx = photos.value.findIndex(p => p.taskId === photo.taskId)
    if (idx >= 0) {
      photos.value[idx] = photo
    } else {
      photos.value.push(photo)
    }

    // Always persist to localStorage
    saveLocalPhotos(photos.value)

    // Async sync to server if logged in
    if (isLoggedIn.value) {
      try {
        const saved = await $fetch<CheckinPhoto>('/api/photos', {
          method: 'POST',
          body: {
            taskId: photo.taskId,
            dataUrl: photo.dataUrl,
            timestamp: photo.timestamp,
            lat: photo.lat,
            lng: photo.lng,
            comment: photo.comment,
          },
        })
        // Update with server-assigned id
        const i = photos.value.findIndex(p => p.taskId === photo.taskId)
        if (i >= 0 && saved.id) {
          photos.value[i] = { ...photos.value[i], id: saved.id } as CheckinPhoto
          saveLocalPhotos(photos.value)
        }
      } catch {
        // Silently fail — localStorage has the backup
      }
    }
  }

  async function updateComment(taskId: string, comment: string) {
    const photo = photos.value.find(p => p.taskId === taskId)
    if (!photo) return

    photo.comment = comment
    saveLocalPhotos(photos.value)

    if (isLoggedIn.value && photo.id) {
      try {
        await $fetch(`/api/photos/${photo.id}`, {
          method: 'PUT',
          body: { comment },
        })
      } catch {
        // Silently fail
      }
    }
  }

  async function loadFromServer() {
    try {
      const serverPhotos = await $fetch<CheckinPhoto[]>('/api/photos')
      photos.value = serverPhotos
      saveLocalPhotos(photos.value)
    } catch {
      // Fall back to localStorage
    }
  }

  async function migrateLocalPhotosToServer() {
    const local = loadLocalPhotos()
    if (local.length === 0) return

    for (const photo of local) {
      try {
        await $fetch('/api/photos', {
          method: 'POST',
          body: {
            taskId: photo.taskId,
            dataUrl: photo.dataUrl,
            timestamp: photo.timestamp,
            lat: photo.lat,
            lng: photo.lng,
            comment: photo.comment,
          },
        })
      } catch {
        // Skip failed uploads
      }
    }

    // Reload from server to get canonical data with IDs
    await loadFromServer()
  }

  async function capturePhoto(): Promise<string> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      // Don't set input.capture — let user choose between camera and photo library
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) { reject(new Error('No file')); return }
        // Resize to max 800px to save localStorage space
        const reader = new FileReader()
        reader.onload = () => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const maxSize = 800
            let { width, height } = img
            if (width > maxSize || height > maxSize) {
              const ratio = Math.min(maxSize / width, maxSize / height)
              width *= ratio
              height *= ratio
            }
            canvas.width = width
            canvas.height = height
            canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
            resolve(canvas.toDataURL('image/jpeg', 0.7))
          }
          img.src = reader.result as string
        }
        reader.readAsDataURL(file)
      }
      // Handle cancel
      input.addEventListener('cancel', () => reject(new Error('Cancelled')))
      input.click()
    })
  }

  async function getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    if (!navigator.geolocation) return null
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }

  function calculateDistance(
    current: { lat: number; lng: number },
    target: { lat: number; lng: number },
  ): number {
    // Haversine formula
    const R = 6371000 // meters
    const dLat = (target.lat - current.lat) * Math.PI / 180
    const dLng = (target.lng - current.lng) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(current.lat * Math.PI / 180) * Math.cos(target.lat * Math.PI / 180)
      * Math.sin(dLng / 2) ** 2
    return 2 * R * Math.asin(Math.sqrt(a))
  }

  function isNearLocation(
    current: { lat: number; lng: number },
    target: { lat: number; lng: number; radius: number },
  ): boolean {
    return calculateDistance(current, target) <= target.radius
  }

  return {
    photos,
    capturePhoto,
    getCurrentLocation,
    isNearLocation,
    calculateDistance,
    savePhoto,
    getPhotoForTask,
    getPhotos,
    updateComment,
    loadFromServer,
    migrateLocalPhotosToServer,
  }
}
