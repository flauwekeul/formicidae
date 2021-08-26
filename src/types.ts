import { Hex } from 'honeycomb-grid'
import { World } from './world'

export type Tile = Hex

export interface BaseAnt {
  world: World
  tile: Tile
  direction: number
}

export interface Ant extends BaseAnt {
  element?: HTMLImageElement
  _prevTimestamp: number
}

export type directionInDegrees = 30 | 90 | 150 | 210 | 270 | 330

export interface Food {
  tile: Tile
  amount: number
}

export interface Pheromone {
  type: pheromoneType
  amount: number
  timestamp: number
  direction: directionInDegrees
}

export type pheromoneType = 'nest' | 'food'
