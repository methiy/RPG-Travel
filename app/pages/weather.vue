<template>
  <div class="weather-page">
    <h2>🌤️ 目的地天气</h2>
    <p>查看全球旅行目的地的实时天气，规划最佳出行时间</p>

    <ClientOnly>
      <!-- 国家/城市选择 -->
      <div class="weather-select">
        <select v-model="selectedCountryId" class="weather-dropdown" @change="selectedCityIdx = 0">
          <option value="">选择国家...</option>
          <option v-for="c in countries" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>

        <select v-if="currentCities.length > 0" v-model="selectedCityIdx" class="weather-dropdown">
          <option v-for="(city, idx) in currentCities" :key="idx" :value="idx">{{ city.name }}</option>
        </select>
      </div>

      <!-- 天气显示 -->
      <div v-if="loading" class="weather-loading">
        <div class="weather-spinner" />
        <span>正在获取天气数据...</span>
      </div>

      <div v-else-if="weather" class="weather-card">
        <div class="weather-main">
          <div class="weather-icon">{{ weatherIcon(weather.code) }}</div>
          <div class="weather-temp">{{ Math.round(weather.temp) }}°C</div>
          <div class="weather-desc">{{ weatherDesc(weather.code) }}</div>
        </div>

        <div class="weather-details">
          <div class="weather-detail">
            <span class="wd-icon">💨</span>
            <span class="wd-label">风速</span>
            <span class="wd-value">{{ weather.windSpeed }} km/h</span>
          </div>
          <div class="weather-detail">
            <span class="wd-icon">💧</span>
            <span class="wd-label">湿度</span>
            <span class="wd-value">{{ weather.humidity }}%</span>
          </div>
          <div class="weather-detail">
            <span class="wd-icon">🌡️</span>
            <span class="wd-label">体感温度</span>
            <span class="wd-value">{{ Math.round(weather.apparent) }}°C</span>
          </div>
          <div class="weather-detail">
            <span class="wd-icon">🌧️</span>
            <span class="wd-label">降水概率</span>
            <span class="wd-value">{{ weather.precipitation }}%</span>
          </div>
        </div>

        <!-- 未来 7 天 -->
        <div v-if="forecast.length" class="forecast-section">
          <h3 class="forecast-title">📅 未来 7 天</h3>
          <div class="forecast-list">
            <div v-for="day in forecast" :key="day.date" class="forecast-day">
              <div class="fc-date">{{ formatFcDate(day.date) }}</div>
              <div class="fc-icon">{{ weatherIcon(day.code) }}</div>
              <div class="fc-temps">
                <span class="fc-high">{{ Math.round(day.maxTemp) }}°</span>
                <span class="fc-low">{{ Math.round(day.minTemp) }}°</span>
              </div>
            </div>
          </div>
        </div>

        <div class="weather-tip">
          <div class="weather-tip-title">✈️ 出行建议</div>
          <div class="weather-tip-text">{{ travelTip }}</div>
        </div>
      </div>

      <div v-else-if="selectedCountryId" class="weather-empty">
        选择城市后查看天气
      </div>

      <div v-else class="weather-empty">
        选择一个目的地开始查看天气 ☀️
      </div>

      <template #fallback>
        <div class="weather-loading">加载中...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { COUNTRIES } from '~/data/countries'
import { TASKS } from '~/data/tasks'

const countries = COUNTRIES

const selectedCountryId = ref('')
const selectedCityIdx = ref(0)
const loading = ref(false)

interface CityCoords {
  name: string
  lat: number
  lng: number
}

// Get city coordinates from tasks' location data
const currentCities = computed<CityCoords[]>(() => {
  if (!selectedCountryId.value) return []
  // TASKS is Record<countryId, Task[]>, use key directly
  const countryTasks = TASKS[selectedCountryId.value] ?? []
  const cityMap = new Map<string, CityCoords>()
  for (const task of countryTasks) {
    if (task.location && !cityMap.has(task.city)) {
      cityMap.set(task.city, {
        name: task.city,
        lat: task.location.lat,
        lng: task.location.lng,
      })
    }
  }
  return Array.from(cityMap.values())
})

interface WeatherData {
  temp: number
  apparent: number
  humidity: number
  windSpeed: number
  code: number
  precipitation: number
}

interface ForecastDay {
  date: string
  code: number
  maxTemp: number
  minTemp: number
}

const weather = ref<WeatherData | null>(null)
const forecast = ref<ForecastDay[]>([])

async function fetchWeather(lat: number, lng: number) {
  loading.value = true
  weather.value = null
  forecast.value = []

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`
    const data = await $fetch<{
      current: {
        temperature_2m: number
        relative_humidity_2m: number
        apparent_temperature: number
        weather_code: number
        wind_speed_10m: number
        precipitation_probability?: number
      }
      daily: {
        time: string[]
        weather_code: number[]
        temperature_2m_max: number[]
        temperature_2m_min: number[]
      }
    }>(url)

    weather.value = {
      temp: data.current.temperature_2m,
      apparent: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      code: data.current.weather_code,
      precipitation: data.current.precipitation_probability ?? 0,
    }

    forecast.value = data.daily.time.map((date, i) => ({
      date,
      code: data.daily.weather_code[i]!,
      maxTemp: data.daily.temperature_2m_max[i]!,
      minTemp: data.daily.temperature_2m_min[i]!,
    }))
  } catch {
    weather.value = null
  } finally {
    loading.value = false
  }
}

watch([currentCities, selectedCityIdx], () => {
  const city = currentCities.value[selectedCityIdx.value]
  if (city) {
    fetchWeather(city.lat, city.lng)
  }
}, { immediate: true })

function weatherIcon(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 49) return '🌫️'
  if (code <= 59) return '🌦️'
  if (code <= 69) return '🌧️'
  if (code <= 79) return '🌨️'
  if (code <= 84) return '🌧️'
  if (code <= 86) return '❄️'
  if (code <= 99) return '⛈️'
  return '🌤️'
}

function weatherDesc(code: number): string {
  if (code === 0) return '晴朗'
  if (code <= 3) return '多云'
  if (code <= 49) return '雾'
  if (code <= 55) return '细雨'
  if (code <= 59) return '小雨'
  if (code <= 65) return '中雨'
  if (code <= 69) return '大雨'
  if (code <= 75) return '雪'
  if (code <= 79) return '冰粒'
  if (code <= 84) return '阵雨'
  if (code <= 86) return '暴雪'
  if (code <= 99) return '雷暴'
  return '未知'
}

const travelTip = computed(() => {
  if (!weather.value) return ''
  const { temp, code, windSpeed } = weather.value
  const tips: string[] = []

  if (temp > 35) tips.push('天气炎热，注意防暑降温，多补充水分')
  else if (temp > 28) tips.push('天气温暖，适合户外活动，注意防晒')
  else if (temp > 15) tips.push('天气舒适，非常适合出行')
  else if (temp > 5) tips.push('天气偏凉，建议携带外套')
  else tips.push('天气寒冷，注意保暖')

  if (code >= 51) tips.push('有降水可能，建议携带雨具')
  if (windSpeed > 30) tips.push('风力较大，户外活动请注意安全')

  return tips.join('。') + '。'
})

function formatFcDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getMonth() + 1}/${d.getDate()} 周${weekdays[d.getDay()]}`
}
</script>

<style scoped>
.weather-page {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
}
.weather-page h2 {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 6px;
}
.weather-page > p {
  color: var(--muted);
  margin-bottom: 20px;
}

/* Select */
.weather-select {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.weather-dropdown {
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg2);
  color: var(--text);
  font-size: 14px;
  outline: none;
  cursor: pointer;
}
.weather-dropdown:focus {
  border-color: var(--accent);
}

/* Weather card */
.weather-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.weather-main {
  text-align: center;
}
.weather-icon {
  font-size: 56px;
  margin-bottom: 8px;
}
.weather-temp {
  font-size: 42px;
  font-weight: 800;
  color: #fff;
}
.weather-desc {
  font-size: 15px;
  color: var(--muted);
  margin-top: 4px;
}

/* Details grid */
.weather-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.weather-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--bg3);
  border-radius: 10px;
}
.wd-icon {
  font-size: 16px;
}
.wd-label {
  font-size: 12px;
  color: var(--muted);
  flex: 1;
}
.wd-value {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

/* Forecast */
.forecast-section {
  border-top: 1px solid var(--border);
  padding-top: 16px;
}
.forecast-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px 0;
}
.forecast-list {
  display: flex;
  gap: 4px;
  overflow-x: auto;
}
.forecast-list::-webkit-scrollbar { display: none; }
.forecast-day {
  flex-shrink: 0;
  text-align: center;
  padding: 8px 10px;
  background: var(--bg3);
  border-radius: 8px;
  min-width: 68px;
}
.fc-date {
  font-size: 10px;
  color: var(--muted);
  margin-bottom: 4px;
}
.fc-icon {
  font-size: 20px;
  margin-bottom: 4px;
}
.fc-temps {
  display: flex;
  gap: 4px;
  justify-content: center;
  font-size: 12px;
}
.fc-high {
  color: #fff;
  font-weight: 700;
}
.fc-low {
  color: var(--muted);
}

/* Travel tip */
.weather-tip {
  background: rgba(74, 158, 255, 0.06);
  border: 1px solid rgba(74, 158, 255, 0.2);
  border-radius: 10px;
  padding: 12px 14px;
}
.weather-tip-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 4px;
}
.weather-tip-text {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
}

/* States */
.weather-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 0;
  color: var(--muted);
  font-size: 14px;
}
.weather-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.weather-empty {
  text-align: center;
  color: var(--muted);
  font-size: 14px;
  padding: 60px 0;
}

/* Mobile */
@media (max-width: 640px) {
  .weather-page { padding: 16px 12px; }
  .weather-page h2 { font-size: 19px; }
  .weather-select { flex-direction: column; gap: 8px; }
  .weather-card { padding: 16px; gap: 16px; }
  .weather-icon { font-size: 44px; }
  .weather-temp { font-size: 36px; }
  .weather-details { gap: 8px; }
  .forecast-day { min-width: 60px; padding: 6px 8px; }
}
</style>
