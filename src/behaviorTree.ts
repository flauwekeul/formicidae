const random = Math.random

// const FALSE = () => false

export const randomSelect: Composite = (...tasks) => tasks[Math.floor(random() * tasks.length)]

export const select: Composite =
  (...tasks) =>
  <T>(context: T) =>
    tasks.some((task) => task.call(context, context))

export const sequence: Composite =
  (...tasks) =>
  <T>(context: T) =>
    tasks.every((task) => task.call(context, context))

export interface Task {
  <T>(context: T): boolean
}

export interface Composite {
  (...tasks: Task[]): Task
}

export interface Decorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (task: Task, ...args: any[]): Task
}
