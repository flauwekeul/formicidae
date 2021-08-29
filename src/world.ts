import { createHexPrototype, Grid, HexCoordinates, neighborOf, rectangle } from 'honeycomb-grid'
import { createAnt, render, renderUpdate, tick } from './ant'
import { DEGREES, DEGREES_TO_COMPASS_DIRECTION_MAP } from './constants'
import {
  ANT_PHEROMONE_DROP_AMOUNT,
  FOOD_MAX_PER_TILE,
  PHEROMONE_DECAY_PER_TICK,
  PHEROMONE_MAX,
  TILE_SIZE,
} from './setting'
import { Ant, Food, NestHole, Pheromone, pheromoneType, Tile } from './types'
import { createElement, normalizeDirection, randomArrayItem } from './utils'

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

  tick(): void {
    this.ants.forEach((ant) => {
      tick(ant)
      renderUpdate(ant)
    })
    this.#tickPheromones()
    this.#renderUpdatePheromones()
    this.#renderUpdateFoods()
  }

  addAnt(tile: Tile): Ant {
    const ant = createAnt({ world: this, tile, direction: randomArrayItem(DEGREES) })
    render(ant)
    this.ants.push(ant)
    return ant
  }

  addNestHole(tile: Tile): void {
    const element = createElement('div', { className: 'hole' })
    element.style.top = `${tile.y}px`
    element.style.left = `${tile.x}px`
    this.nestHoles.push({ tile, element })
  }

  addFood(tile: Tile, amount: number): void {
    const element = createElement('div', { className: 'food' })
    element.style.top = `${tile.y}px`
    element.style.left = `${tile.x}px`
    this.foods.push({ tile, amount, element })
    this.#renderUpdateFoods()
  }

  addPheromone(type: pheromoneType, tile: Tile, direction: number): void {
    const pheromone = this.pheromones.get(tile)
    const amount = ANT_PHEROMONE_DROP_AMOUNT + (pheromone?.amount ?? 0)
    const element = pheromone?.element ?? createElement('div', { className: 'pheromone' })
    element.style.top = `${tile.y}px`
    element.style.left = `${tile.x}px`
    this.pheromones.set(tile, {
      type,
      amount,
      // override any previous direction
      direction: normalizeDirection(direction),
      element,
    })
    this.#renderUpdatePheromones()
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

  #renderUpdateFoods(): void {
    this.foods.forEach((food) => {
      if (!food.element) {
        return
      }
      food.element.style.width = `${food.amount * (TILE_SIZE / FOOD_MAX_PER_TILE)}px`
      food.element.style.height = `${food.amount * (TILE_SIZE / FOOD_MAX_PER_TILE)}px`
    })
  }

  #tickPheromones(): void {
    this.pheromones.forEach((pheromone, tile) => {
      const amount = Math.min(PHEROMONE_MAX, pheromone.amount - PHEROMONE_DECAY_PER_TICK)
      if (amount > 0) {
        pheromone.amount = amount
      } else {
        this.pheromones.delete(tile)
      }
    })
  }

  #renderUpdatePheromones(): void {
    this.pheromones.forEach((pheromone) => {
      if (!pheromone.element) {
        return
      }
      pheromone.element.style.opacity = `${pheromone.amount / PHEROMONE_MAX}`
    })
  }
}
