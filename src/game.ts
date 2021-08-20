import { createHexPrototype, Grid } from 'honeycomb-grid'
import { Ant } from './ant'
import { ANT_SIZE_MODIFIER, ANT_TRANSITION_DURATION_IN_MS, TILE_SIZE } from './setting'
import { Tile } from './types'

export class Game {
  grid!: Grid<Tile>
  ants: Ant[] = []
  requestAnimationId: number | null = null

  get hasStarted() {
    return !!this.requestAnimationId
  }

  init() {
    this.#setStyles()
    this.#createGrid()
  }

  start() {
    this.requestAnimationId = requestAnimationFrame(this.tick.bind(this))
  }

  stop() {
    if (this.requestAnimationId) {
      cancelAnimationFrame(this.requestAnimationId)
      this.requestAnimationId = null
    }
  }

  addAnt(tile: Tile = this.grid.getHex()) {
    this.ants.push(new Ant(this.grid, tile, 90))
  }

  tick(timestamp: number) {
    this.ants.forEach((ant) => {
      ant.tick(timestamp)
      ant.render()
    })
    this.start()
  }

  #setStyles() {
    Object.entries({
      '--ant-size': `${TILE_SIZE * ANT_SIZE_MODIFIER}px`,
      '--ant-transition-duration': `${ANT_TRANSITION_DURATION_IN_MS}ms`,
    }).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }

  #createGrid() {
    const hexPrototype = createHexPrototype<Tile>({ dimensions: { width: TILE_SIZE, height: TILE_SIZE } })
    this.grid = new Grid(hexPrototype)
  }
}
