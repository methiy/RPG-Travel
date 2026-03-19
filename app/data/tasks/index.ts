import type { Task } from '~/types'

// Import from country files
import { japanTasks } from './japan'
import { koreaTasks } from './korea'
import { chinaTasks } from './china/index'
import { singaporeTasks } from './singapore'
import { malaysiaTasks } from './malaysia'
import { thailandTasks } from './thailand'
import { indonesiaTasks } from './indonesia'
import { vietnamTasks } from './vietnam'
import { franceTasks } from './france'
import { italyTasks } from './italy'
import { spainTasks } from './spain'
import { germanyTasks } from './germany'
import { ukTasks } from './uk'
import { switzerlandTasks } from './switzerland'
import { czechiaTasks } from './czechia'
import { usaTasks } from './usa'
import { mexicoTasks } from './mexico'
import { peruTasks } from './peru'
import { brazilTasks } from './brazil'
import { argentinaTasks } from './argentina'
import { egyptTasks } from './egypt'
import { moroccoTasks } from './morocco'
import { uaeTasks } from './uae'
import { southAfricaTasks } from './south-africa'
import { australiaTasks } from './australia'
import { newZealandTasks } from './new-zealand'
import { fijiTasks } from './fiji'

export const TASKS: Record<string, Task[]> = {
  japan: japanTasks,
  korea: koreaTasks,
  china: chinaTasks,
  singapore: singaporeTasks,
  malaysia: malaysiaTasks,
  thailand: thailandTasks,
  indonesia: indonesiaTasks,
  vietnam: vietnamTasks,
  france: franceTasks,
  italy: italyTasks,
  spain: spainTasks,
  germany: germanyTasks,
  uk: ukTasks,
  switzerland: switzerlandTasks,
  czechia: czechiaTasks,
  usa: usaTasks,
  mexico: mexicoTasks,
  peru: peruTasks,
  brazil: brazilTasks,
  argentina: argentinaTasks,
  egypt: egyptTasks,
  morocco: moroccoTasks,
  uae: uaeTasks,
  'south-africa': southAfricaTasks,
  australia: australiaTasks,
  'new-zealand': newZealandTasks,
  fiji: fijiTasks,
}
