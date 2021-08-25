import { CompassDirection, Grid, neighborOf } from 'honeycomb-grid'
import { ANT_TICK_INTERVAL } from '../setting'
import { directionInDegrees, Tile } from '../types'
import { signedModulo } from '../utils'
import antSvgPath from './ant.svg'
import { performTask } from './behavior'

export function createAnt({ grid, tile, direction }: Omit<Ant, '_prevTimestamp'>): Ant {
  return {
    grid,
    tile,
    direction,
    _prevTimestamp: -1,
  }
}

export function tileInFrontOf({ direction, grid, tile }: Ant): Tile {
  // the (degrees) direction can be negative, so a regular modulus won't do
  const normalizedDegrees = signedModulo(direction, 360) as directionInDegrees
  const compassDirection = DEGREES_TO_COMPASS_DIRECTION_MAP[normalizedDegrees]
  return grid.getHex(neighborOf(tile, compassDirection))
}

export function render(ant: Ant): Ant {
  if (!ant.element) {
    ant.element = createAntElement()
    document.body.appendChild(ant.element as HTMLImageElement)
  }

  ant.element.style.top = `${ant.tile.y}px`
  ant.element.style.left = `${ant.tile.x}px`
  ant.element.style.transform = `rotate(${ant.direction}deg)`

  return ant
}

export function canWalk(ant: Ant): boolean {
  return ant.grid.store.has(tileInFrontOf(ant).toString())
}

export function walk(ant: Ant): boolean {
  if (!canWalk(ant)) {
    return false
  }
  ant.tile = tileInFrontOf(ant)
  return true
}

export function turnLeft(ant: Ant): true {
  ant.direction -= 60
  return true
}

export function turnRight(ant: Ant): true {
  ant.direction += 60
  return true
}

export function tick(ant: Ant, timestamp: number): Ant {
  if (timestamp - ant._prevTimestamp < ANT_TICK_INTERVAL) {
    return ant
  }
  ant._prevTimestamp = timestamp

  performTask(ant)

  return ant
}

export interface Ant {
  grid: Grid<Tile>
  tile: Tile
  direction: directionInDegrees
  element?: HTMLImageElement
  _prevTimestamp: number
}

// PRIVATES

// todo: this is shit, Honeycomb should offer a way to convert degrees to compass direction
export const DEGREES_TO_COMPASS_DIRECTION_MAP = {
  30: CompassDirection.NE,
  90: CompassDirection.E,
  150: CompassDirection.SE,
  210: CompassDirection.SW,
  270: CompassDirection.W,
  330: CompassDirection.NW,
}

function createAntElement() {
  const element = document.createElement('img')
  element.setAttribute('src', antSvgPath)
  element.classList.add('ant')
  return element
}
