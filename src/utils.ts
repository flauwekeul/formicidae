import { directionInDegrees } from './types'

export function signedModulo(dividend: number, divisor: number): number {
  return ((dividend % divisor) + divisor) % divisor
}

export function sample(probability: number): () => boolean {
  return () => Math.random() < probability
}

export function randomArrayItem<T>(array: Array<T>, random = Math.random): T {
  return array[Math.floor(random() * array.length)]
}

export function normalizeDirection(direction: number): directionInDegrees {
  // the (degrees) direction can be negative, so a regular modulus won't do
  return signedModulo(direction, 360) as directionInDegrees
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  props?: Record<string, unknown>,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName)
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      element[key as keyof HTMLElementTagNameMap[K]] = value as HTMLElementTagNameMap[K][keyof HTMLElementTagNameMap[K]]
    })
  }
  document.body.appendChild(element)
  return element
}
