<template>
  <div class="city-map-container">
    <div ref="mapEl" class="map-element" />
  </div>
</template>

<script setup lang="ts">
import type { MapMarkerData } from '~/types'

const props = defineProps<{
  markers: MapMarkerData[]
  polylinePoints?: [number, number][]
  polylineColor?: string
}>()

const mapEl = ref<HTMLElement | null>(null)
const { initMap, setMarkers, setPolyline, fitBounds, destroy } = useLeafletMap()

let initialized = false

async function setup() {
  if (!mapEl.value || initialized) return
  initialized = true

  try {
    await initMap(mapEl.value)
    updateMap()
  } catch (e) {
    console.warn('Leaflet init failed:', e)
  }
}

function updateMap() {
  if (!initialized) return

  setMarkers(props.markers)
  fitBounds(props.markers)

  if (props.polylinePoints?.length) {
    setPolyline(props.polylinePoints, props.polylineColor || '#4a9eff')
  }
}

watch(() => props.markers, updateMap, { deep: true })
watch(() => props.polylinePoints, () => {
  if (props.polylinePoints?.length) {
    setPolyline(props.polylinePoints, props.polylineColor || '#4a9eff')
  }
}, { deep: true })

onMounted(() => {
  nextTick(setup)
})

onUnmounted(() => {
  destroy()
  initialized = false
})
</script>

<style scoped>
.city-map-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.map-element {
  width: 100%;
  height: 350px;
}

@media (max-width: 640px) {
  .map-element {
    height: 250px;
  }
}
</style>

<style>
/* Leaflet popup dark theme */
.dark-popup .leaflet-popup-content-wrapper {
  background: var(--bg2, #0d1020);
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
}
.dark-popup .leaflet-popup-tip {
  background: var(--bg2, #0d1020);
}
.dark-popup .leaflet-popup-content {
  font-size: 12px;
  line-height: 1.5;
  margin: 8px 12px;
}
/* Hide default marker icon styling issues */
.custom-marker {
  background: transparent !important;
  border: none !important;
}
</style>
