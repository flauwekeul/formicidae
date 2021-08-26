import { createHexPrototype, Grid, HexCoordinates, neighborOf, rectangle } from 'honeycomb-grid'
import { createAnt, render } from './ant'
import { DEGREES, DEGREES_TO_COMPASS_DIRECTION_MAP } from './constants'
import {
  ANT_PHEROMONE_DROP_AMOUNT,
  FOOD_MAX_PER_TILE,
  PHEROMONE_DECAY_PER_MS,
  PHEROMONE_MAX,
  TILE_SIZE,
} from './setting'
import { Ant, Food, NestHole, Pheromone, pheromoneType, Tile } from './types'
import { normalizeDirection, randomArrayItem } from './utils'

export class World {
  #grid: Grid<Tile>

  ants: Ant[] = []
  nestHoles: NestHole[] = []
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
    this.nestHoles.push({ tile })
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
    this.#renderAnts()
  }

  #renderNestHoles(): void {
    this.nestHoles.forEach((hole) => {
      if (!hole.element) {
        hole.element = this.#createElement('div', ['hole'])
        document.body.appendChild(hole.element)
        hole.element.style.top = `${hole.tile.y}px`
        hole.element.style.left = `${hole.tile.x}px`
      }
    })
  }

  #renderFoods(): void {
    this.foods.forEach((food) => {
      if (!food.element) {
        food.element = this.#createElement('div', ['food'])
        document.body.appendChild(food.element)
        food.element.style.top = `${food.tile.y}px`
        food.element.style.left = `${food.tile.x}px`
      }
      food.element.style.width = `${food.amount * (TILE_SIZE / FOOD_MAX_PER_TILE)}px`
      food.element.style.height = `${food.amount * (TILE_SIZE / FOOD_MAX_PER_TILE)}px`
    })
  }

  #renderAnts(): void {
    this.ants.forEach((ant) => {
      render(ant)
    })
  }

  #createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, classes: string[] = []): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName)
    element.classList.add(...classes)
    return element
  }

  #nextPheromoneAmount({ amount, timestamp }: Pheromone): number {
    // todo: use _prevTimestamp?
    const decay = (Date.now() - timestamp) * PHEROMONE_DECAY_PER_MS
    return Math.min(PHEROMONE_MAX, Math.max(0, amount + ANT_PHEROMONE_DROP_AMOUNT - decay))
  }
}
