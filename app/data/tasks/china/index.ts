import type { Task } from '~/types'

import { wuhanTasks } from './wuhan'
import { hongkongTasks } from './hongkong'
import { lhasaTasks } from './lhasa'
import { daliTasks } from './dali'

export const chinaTasks: Task[] = [
  ...wuhanTasks,
  ...hongkongTasks,
  ...lhasaTasks,
  ...daliTasks,
]
