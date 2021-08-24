const random = Math.random

// const FALSE = () => false

export const randomSelect: Composite = (...tasks) => tasks[Math.floor(random() * tasks.length)]

export const select: Composite =
  (...tasks) =>
  () =>
    tasks.some((task) => task())

export const sequence: Composite =
  (...tasks) =>
  () =>
    tasks.every((task) => task())

export interface Task {
  (): boolean
}

export interface Composite {
  (...tasks: Task[]): Task
}

export interface Decorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (task: Task, ...args: any[]): Task
}
