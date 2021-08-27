import { tick } from './ant'
import { ANT_SIZE_MODIFIER, ANT_TRANSITION_DURATION_IN_MS, TICK_INTERVAL_IN_MS, TILE_SIZE } from './setting'
import { tickListener } from './types'
import { World } from './world'

export class Game {
  #requestAnimationId: number | null = null
  #prevTimestamp = 0
  #tickListeners: tickListener[] = []

  get isRunning(): boolean {
    return !!this.#requestAnimationId
  }

  constructor(public world: World) {
    this.#setStyles()
  }

  start(): void {
    this.#requestAnimationId = requestAnimationFrame(this.tick.bind(this))
  }

  stop(): void {
    if (this.#requestAnimationId) {
      cancelAnimationFrame(this.#requestAnimationId)
      this.#requestAnimationId = null
    }
  }

  tick(timestamp: number): void {
    const elapsed = performance.now() - this.#prevTimestamp
    if (elapsed > TICK_INTERVAL_IN_MS) {
      this.#prevTimestamp = timestamp
      this.world.ants.forEach((ant) => {
        tick(ant)
      })
      this.#tickListeners.forEach((listener) => listener(this, timestamp))
    }
    this.start()
  }

  onTick(listener: tickListener): void {
    this.#tickListeners.push(listener)
  }

  #setStyles(): void {
    Object.entries({
      '--tile-size': `${TILE_SIZE}px`,
      '--ant-size': `${TILE_SIZE * ANT_SIZE_MODIFIER}px`,
      '--ant-transition-duration': `${ANT_TRANSITION_DURATION_IN_MS}ms`,
    }).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }
}
