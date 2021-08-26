import { createHexPrototype, Grid, HexCoordinates, neighborOf, rectangle } from 'honeycomb-grid'
import { createAnt } from './ant'
import { DEGREES, DEGREES_TO_COMPASS_DIRECTION_MAP } from './constants'
import { ANT_PHEROMONE_DROP_AMOUNT, PHEROMONE_DECAY_PER_MS, PHEROMONE_MAX, TILE_SIZE } from './setting'
import { Ant, Food, Pheromone, pheromoneType, Tile } from './types'
import { normalizeDirection, randomArrayItem } from './utils'

export class World {
  #grid: Grid<Tile>

  ants: Ant[] = []
  nestHoles: Tile[] = []
  foods: Food[] = []
  pheromones = new Map<Tile, Pheromone>()

  constructor(public gridWidth: number, public gridHeight: number) {
    const hexPrototype = createHexPrototype<Tile>({ dimensions: { width: TILE_SIZE, height: TILE_SIZE } })
    this.#grid = new Grid(hexPrototype, rectangle({ width: this.gridWidth, height: this.gridHeight }))
  }

  addAnt(tile: Tile): Ant {
    const ant = createAnt({ world: this, tile, direction: randomArrayItem(DEGREES) })
    this.ants.push(ant)
    return ant
  }

  addHole(tile: Tile): void {
    this.nestHoles.push(tile)
  }

  addFood(tile: Tile, amount: number): void {
    this.foods.push({ tile, amount })
  }

  addPheromone(type: pheromoneType, tile: Tile, direction: number): void {
    const pheromone = this.pheromones.get(tile)
    const amount = pheromone ? this.#nextPheromoneAmount(pheromone) : ANT_PHEROMONE_DROP_AMOUNT
    this.pheromones.set(tile, {
      type,
      amount,
      timestamp: Date.now(),
      // override any previous direction
      direction: normalizeDirection(direction),
    })
  }

  tileExists(tile: Tile): boolean {
    return this.#grid.store.has(tile.toString())
  }

  isTileObstructed(tile: Tile): boolean {
    return this.ants.some((ant) => ant.tile.equals(tile))
  }

  getTile(coordinates: HexCoordinates): Tile {
    return this.#grid.getHex(coordinates)
  }

  neighborOfTile(tile: Tile, direction: number): Tile {
    const normalizedDirection = normalizeDirection(direction)
    const compassDirection = DEGREES_TO_COMPASS_DIRECTION_MAP[normalizedDirection]
    return this.getTile(neighborOf(tile, compassDirection))
  }

  render(): void {
    this.#renderNestHoles()
    this.#renderFoods()
  }

  #renderNestHoles(): void {
    this.nestHoles.forEach((hole) => {
      const element = this.#createHoleElement()
      document.body.appendChild(element)
      element.style.top = `${hole.y}px`
      element.style.left = `${hole.x}px`
    })
  }

  #renderFoods(): void {
    this.foods.forEach(({ tile, amount }) => {
      const element = this.#createFoodElement()
      document.body.appendChild(element)
      element.style.width = `${amount * (TILE_SIZE / 100)}px`
      element.style.height = `${amount * (TILE_SIZE / 100)}px`
      element.style.top = `${tile.y}px`
      element.style.left = `${tile.x}px`
    })
  }

  #createHoleElement(): HTMLDivElement {
    const element = document.createElement('div')
    element.classList.add('hole')
    return element
  }

  #createFoodElement(): HTMLDivElement {
    const element = document.createElement('div')
    element.classList.add('food')
    return element
  }

  #nextPheromoneAmount({ amount, timestamp }: Pheromone): number {
    // todo: use _prevTimestamp?
    const decay = (Date.now() - timestamp) * PHEROMONE_DECAY_PER_MS
    return Math.min(PHEROMONE_MAX, Math.max(0, amount + ANT_PHEROMONE_DROP_AMOUNT - decay))
  }
}
