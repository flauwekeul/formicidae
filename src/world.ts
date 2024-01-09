import { createHexPrototype, Grid, HexCoordinates, neighborOf, rectangle } from 'honeycomb-grid'
import { createAnt, tick } from './ant'
import { DEGREES, DEGREES_TO_COMPASS_DIRECTION_MAP } from './constants'
import { Renderer } from './renderer'
import {
  ANT_CARRY_CAPACITY,
  ANT_PHEROMONE_DROP_AMOUNT,
  PHEROMONE_DECAY_PER_TICK,
  PHEROMONE_MAX,
  TILE_SIZE,
} from './setting'
import { Ant, Food, NestHole, Pheromone, pheromoneType, Tile } from './types'
import { normalizeDirection, randomArrayItem } from './utils'

export class World {
  #grid: Grid<Tile>

  ants: Ant[] = []
  nestHoles = new Map<string, NestHole>()
  foods = new Map<string, Food>()
  pheromones = new Map<string, Pheromone>()

  constructor(public gridWidth: number, public gridHeight: number, public renderer?: Renderer) {
    const hexPrototype = createHexPrototype<Tile>({ dimensions: { width: TILE_SIZE, height: TILE_SIZE } })
    this.#grid = new Grid(hexPrototype, rectangle({ width: this.gridWidth, height: this.gridHeight }))
  }

  tick(): void {
    this.#tickAnts()
    this.#tickPheromones()
  }

  addAnt(tile: Tile): Ant {
    const ant = createAnt({ world: this, tile, direction: randomArrayItem(DEGREES) })
    this.renderer?.renderAnt(ant)
    this.ants.push(ant)
    return ant
  }

  addNestHole(tile: Tile): void {
    const nestHole: NestHole = { tile }
    this.renderer?.renderNestHole(nestHole)
    this.nestHoles.set(tile.toString(), nestHole)
  }

  addFood(tile: Tile, amount: number): void {
    const food: Food = { tile, amount }
    this.renderer?.renderFood(food)
    this.foods.set(tile.toString(), food)
  }

  reduceFood(food: Food): number {
    const amount = Math.min(ANT_CARRY_CAPACITY, food.amount)
    food.amount -= amount
    return amount
  }

  addPheromone(type: pheromoneType, tile: Tile, direction: number): void {
    const id = this.pheromoneId(tile, type)
    const amount = ANT_PHEROMONE_DROP_AMOUNT + (this.pheromones.get(id)?.amount ?? 0)
    const pheromone: Pheromone = {
      tile,
      type,
      amount,
      // override any previous direction
      direction: normalizeDirection(direction),
    }
    this.renderer?.renderPheromone(pheromone)
    this.pheromones.set(id, pheromone)
  }

  pheromoneId(tile: Tile, type: pheromoneType): string {
    return `${tile.toString()}-${type}`
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

  #tickAnts(): void {
    this.ants.forEach((ant) => {
      tick(ant)
      this.renderer?.updateAnt(ant)
    })
  }

  #tickPheromones(): void {
    this.pheromones.forEach((pheromone, id) => {
      const amount = Math.min(PHEROMONE_MAX, pheromone.amount - PHEROMONE_DECAY_PER_TICK)
      if (amount > 0) {
        pheromone.amount = amount
      } else {
        this.pheromones.delete(id)
      }
      this.renderer?.updatePheromone(pheromone)
    })
  }
}
