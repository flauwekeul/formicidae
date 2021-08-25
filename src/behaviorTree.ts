import { randomArrayItem } from './utils'

const createComposite =
  (fn: <T>(tasks: Task<T>[], context: T) => boolean): Composite =>
  (...tasks) =>
  (context) =>
    fn(tasks, context)

export const randomSelect = createComposite((tasks, context) => randomArrayItem(tasks)(context))

export const select = createComposite((tasks, context) => tasks.some((task) => task(context)))

export const sequence = createComposite((tasks, context) => tasks.every((task) => task(context)))

export interface Task<T> {
  (context: T): boolean
}

export interface Composite {
  <T>(...tasks: Task<T>[]): Task<T>
}

export interface Decorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T>(task: Task<T>, ...args: any[]): Task<T>
}
