import { CITIES } from './cities'

/**
 * Bidirectional mapping between city Chinese names and city IDs
 * Tasks use Chinese names (task.city = '北京'), Cities use English IDs (city.id = 'beijing')
 */

// Chinese name → City ID
const nameToId = new Map<string, string>()
// City ID → Chinese name
const idToName = new Map<string, string>()

for (const city of CITIES) {
  nameToId.set(city.name, city.id)
  idToName.set(city.id, city.name)
}

export function getCityIdByName(name: string): string | undefined {
  return nameToId.get(name)
}

export function getCityNameById(id: string): string | undefined {
  return idToName.get(id)
}

export function getAllCityNames(): string[] {
  return [...nameToId.keys()]
}

export { nameToId as CITY_NAME_TO_ID, idToName as CITY_ID_TO_NAME }
