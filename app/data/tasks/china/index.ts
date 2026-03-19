import type { Task } from '~/types'

import { wuhanTasks } from './wuhan'
import { hongkongTasks } from './hongkong'
import { lhasaTasks } from './lhasa'
import { daliTasks } from './dali'
import { beijingTasks } from './beijing'
import { shanghaiTasks } from './shanghai'
import { guangzhouTasks } from './guangzhou'
import { shenzhenTasks } from './shenzhen'
import { chengduTasks } from './chengdu'
import { chongqingTasks } from './chongqing'
import { xianTasks } from './xian'
import { hangzhouTasks } from './hangzhou'
import { nanjingTasks } from './nanjing'
import { suzhouTasks } from './suzhou'
import { changshaTasks } from './changsha'
import { xiamenTasks } from './xiamen'
import { qingdaoTasks } from './qingdao'
import { lijiangTasks } from './lijiang'
import { harbinTasks } from './harbin'
import { sanyaTasks } from './sanya'
import { guilinTasks } from './guilin'
import { macauTasks } from './macau'
import { taipeiTasks } from './taipei'

export const chinaTasks: Task[] = [
  ...wuhanTasks,
  ...hongkongTasks,
  ...lhasaTasks,
  ...daliTasks,
  ...beijingTasks,
  ...shanghaiTasks,
  ...guangzhouTasks,
  ...shenzhenTasks,
  ...chengduTasks,
  ...chongqingTasks,
  ...xianTasks,
  ...hangzhouTasks,
  ...nanjingTasks,
  ...suzhouTasks,
  ...changshaTasks,
  ...xiamenTasks,
  ...qingdaoTasks,
  ...lijiangTasks,
  ...harbinTasks,
  ...sanyaTasks,
  ...guilinTasks,
  ...macauTasks,
  ...taipeiTasks,
]
