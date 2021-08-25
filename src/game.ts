import { createHexPrototype, Grid, rectangle } from 'honeycomb-grid'
import { Ant, createAnt, DEGREES_TO_COMPASS_DIRECTION_MAP, render, tick } from './ant'
import { ANT_SIZE_MODIFIER, ANT_TRANSITION_DURATION_IN_MS, TILE_SIZE } from './setting'
import { directionInDegrees, Tile } from './types'
import { randomArrayItem } from './utils'

const DEGREES = Object.keys(DEGREES_TO_COMPASS_DIRECTION_MAP).map(
  (key) => Number.parseInt(key, 10) as directionInDegrees,
)

export class Game {
  grid!: Grid<Tile>
  ants: Ant[] = []
  requestAnimationId: number | null = null

  get isRunning(): boolean {
    return !!this.requestAnimationId
  }

  constructor(public gridWidth: number, public gridHeight: number) {}

  init(): void {
    this.#setStyles()
    this.#createGrid()
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

  addAnt(tile: Tile = this.grid.getHex()): void {
    this.ants.push(createAnt({ grid: this.grid, tile, direction: randomArrayItem(DEGREES) }))
  }

  tick(timestamp: number): void {
    this.ants.forEach((ant) => {
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

  #createGrid(): void {
    const hexPrototype = createHexPrototype<Tile>({ dimensions: { width: TILE_SIZE, height: TILE_SIZE } })
    this.grid = new Grid(hexPrototype, rectangle({ width: this.gridWidth, height: this.gridHeight }))
  }
}
