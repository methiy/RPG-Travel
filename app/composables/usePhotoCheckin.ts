interface CheckinPhoto {
  taskId: string
  dataUrl: string      // base64 image
  timestamp: number
  location?: { lat: number; lng: number }
}

export function usePhotoCheckin() {
  const STORAGE_KEY = 'travelrpg2_photos'

  function getPhotos(): CheckinPhoto[] {
    if (import.meta.server) return []
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch { return [] }
  }

  function savePhoto(photo: CheckinPhoto) {
    const photos = getPhotos()
    photos.push(photo)
    // Keep max 100 photos to avoid localStorage overflow
    if (photos.length > 100) photos.shift()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos))
  }

  function getPhotoForTask(taskId: string): CheckinPhoto | undefined {
    return getPhotos().find(p => p.taskId === taskId)
  }

  async function capturePhoto(): Promise<string> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.capture = 'environment'  // Use back camera on mobile
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

  return { capturePhoto, getCurrentLocation, isNearLocation, calculateDistance, savePhoto, getPhotoForTask, getPhotos }
}
