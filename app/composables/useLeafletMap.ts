import type { MapMarkerData } from '~/types'

type LeafletModule = typeof import('leaflet')

let L: LeafletModule | null = null

async function loadLeaflet(): Promise<LeafletModule> {
  if (L) return L
  L = await import('leaflet')
  return L
}

export function useLeafletMap() {
  let map: any = null
  let markerLayer: any = null
  let polylineLayer: any = null

  /** Initialize map in a container element */
  async function initMap(container: HTMLElement, center: [number, number] = [35, 105], zoom = 5) {
    const leaflet = await loadLeaflet()

    // Cleanup if already initialized
    if (map) {
      map.remove()
    }

    map = leaflet.map(container, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: false,
    })

    // CartoDB Dark tiles (free, no API key, matches dark theme)
    leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map)

    markerLayer = leaflet.layerGroup().addTo(map)
    polylineLayer = leaflet.layerGroup().addTo(map)

    return map
  }

  /** Create a circular marker icon */
  function createMarkerIcon(color: string, label?: string) {
    if (!L) return undefined
    const size = label ? 28 : 22
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width:${size}px;height:${size}px;
        background:${color};
        border:2px solid #fff;
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:10px;font-weight:700;color:#fff;
        box-shadow:0 2px 8px rgba(0,0,0,0.4);
      ">${label || ''}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    })
  }

  /** Add markers to the map */
  function setMarkers(markers: MapMarkerData[]) {
    if (!map || !markerLayer || !L) return

    markerLayer.clearLayers()

    for (const m of markers) {
      const icon = createMarkerIcon(m.color, m.label)
      const marker = L.marker([m.lat, m.lng], { icon })
      if (m.popupHtml) {
        marker.bindPopup(m.popupHtml, {
          className: 'dark-popup',
          maxWidth: 200,
        })
      }
      markerLayer.addLayer(marker)
    }
  }

  /** Draw polyline connecting markers */
  function setPolyline(points: [number, number][], color = '#4a9eff') {
    if (!map || !polylineLayer || !L) return

    polylineLayer.clearLayers()

    if (points.length < 2) return

    const line = L.polyline(points, {
      color,
      weight: 2,
      opacity: 0.6,
      dashArray: '6, 8',
    })
    polylineLayer.addLayer(line)
  }

  /** Fit map to show all markers */
  function fitBounds(markers: MapMarkerData[], padding = 50) {
    if (!map || !L || markers.length === 0) return

    const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]))
    map.fitBounds(bounds, { padding: [padding, padding], maxZoom: 14 })
  }

  /** Clear all markers and lines */
  function clearAll() {
    markerLayer?.clearLayers()
    polylineLayer?.clearLayers()
  }

  /** Destroy the map */
  function destroy() {
    if (map) {
      map.remove()
      map = null
      markerLayer = null
      polylineLayer = null
    }
  }

  /** Get map instance */
  function getMap() {
    return map
  }

  return {
    initMap,
    setMarkers,
    setPolyline,
    fitBounds,
    clearAll,
    destroy,
    getMap,
  }
}
