import { randomArrayItem, shuffleArray } from './utils'

const createComposite =
  (fn: <T>(tasks: Task<T>[], context: T) => boolean): Composite =>
  (...tasks) =>
  (context) =>
    fn(tasks, context)

export const randomSelect = createComposite((tasks, context) => randomArrayItem(tasks)(context))

export const randomSequence = createComposite((tasks, context) => sequence(...shuffleArray(tasks))(context))

export const select = createComposite((tasks, context) => tasks.some((task) => task(context)))

export const sequence = createComposite((tasks, context) => tasks.every((task) => task(context)))

export const not: Decorator = (task) => (context) => !task(context)

export const log =
  <T>(message?: T | string, returnValue = true) =>
  (task: T): boolean => {
    console.log(task ?? message)
    return returnValue
  }

export interface Task<T> {
  (context: T): boolean
}

export interface Composite {
  <T>(...tasks: Task<T>[]): Task<T>
}

export interface Decorator {
  <T>(task: Task<T>): Task<T>
}
