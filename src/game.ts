import { render, tick } from './ant'
import { ANT_SIZE_MODIFIER, ANT_TRANSITION_DURATION_IN_MS, TILE_SIZE } from './setting'
import { World } from './world'

export class Game {
  requestAnimationId: number | null = null

  get isRunning(): boolean {
    return !!this.requestAnimationId
  }

  constructor(public world: World) {
    this.#setStyles()
  }

  start(): void {
    this.requestAnimationId = requestAnimationFrame(this.tick.bind(this))
  }

  stop(): void {
    if (this.requestAnimationId) {
      cancelAnimationFrame(this.requestAnimationId)
      this.requestAnimationId = null
    }
  }

  tick(timestamp: number): void {
    this.world.ants.forEach((ant) => {
      render(tick(ant, timestamp))
    })
    this.start()
  }

  #setStyles(): void {
    Object.entries({
      '--ant-size': `${TILE_SIZE * ANT_SIZE_MODIFIER}px`,
      '--ant-transition-duration': `${ANT_TRANSITION_DURATION_IN_MS}ms`,
    }).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }
}
