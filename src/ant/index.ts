import { ANT_TICK_INTERVAL } from '../setting'
import { directionInDegrees, Tile } from '../types'
import { World } from '../world'
import antSvgPath from './ant.svg'
import { performTask } from './behavior'

export function createAnt({ world, tile, direction }: Omit<Ant, '_prevTimestamp'>): Ant {
  return {
    world,
    tile,
    direction,
    _prevTimestamp: -1,
  }
}

export function tileInFrontOf({ world, tile, direction }: Ant): Tile {
  return world.neighborOfTile(tile, direction)
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
  const tileInFront = tileInFrontOf(ant)
  return ant.world.tileExists(tileInFront) && !ant.world.isTileObstructed(tileInFront)
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
  world: World
  tile: Tile
  direction: directionInDegrees
  element?: HTMLImageElement
  _prevTimestamp: number
}

// PRIVATES

function createAntElement() {
  const element = document.createElement('img')
  element.setAttribute('src', antSvgPath)
  element.classList.add('ant')
  return element
}
