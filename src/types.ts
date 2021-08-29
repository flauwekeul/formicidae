import { Hex } from 'honeycomb-grid'
import { World } from './world'

export type Tile = Hex

export interface Ant {
  world: World
  tile: Tile
  direction: number
  element?: HTMLImageElement
}

export type directionInDegrees = 30 | 90 | 150 | 210 | 270 | 330

export interface NestHole {
  tile: Tile
  element?: HTMLDivElement
}

export interface Food {
  tile: Tile
  amount: number
  element?: HTMLDivElement
}

export interface Pheromone {
  tile: Tile
  type: pheromoneType
  amount: number
  direction: directionInDegrees
  element?: HTMLDivElement
}

export type pheromoneType = 'nest' | 'food'

export interface RenderOptions {
  renderAnts: boolean
  renderFoods: boolean
  renderPheromones: boolean
}
