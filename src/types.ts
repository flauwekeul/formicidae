import { Hex } from 'honeycomb-grid'
import { Game } from './game'
import { World } from './world'

export type Tile = Hex

export interface BaseAnt {
  world: World
  tile: Tile
  direction: number
}

export interface Ant extends BaseAnt {
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
  type: pheromoneType
  amount: number
  timestamp: number
  direction: directionInDegrees
}

export type pheromoneType = 'nest' | 'food'

export type tickListener = (game: Game, timestamp: number) => void
