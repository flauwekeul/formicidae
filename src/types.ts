import { Hex } from 'honeycomb-grid'
import { World } from './world'

export type Tile = Hex

export interface Ant {
  world: World
  tile: Tile
  direction: number
  element?: HTMLImageElement
  transporting?: number
}

export type directionInDegrees = 30 | 90 | 150 | 210 | 270 | 330

export type directionOffset = -1 | 0 | 1

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
  offset: { top: number; left: number }
  renderAnts: boolean
  renderFoods: boolean
  renderPheromones: boolean
}
