import { ANT_TICK_INTERVAL } from '../setting'
import { Tile } from '../types'
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

export function tileInFront({ world, tile, direction }: Ant, offset: -1 | 0 | 1 = 0): Tile {
  return world.neighborOfTile(tile, direction + offset * 60)
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
  const tile = tileInFront(ant)
  return ant.world.tileExists(tile) && !ant.world.isTileObstructed(tile)
}

export function walk(ant: Ant): boolean {
  if (!canWalk(ant)) {
    return false
  }
  ant.tile = tileInFront(ant)
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
  direction: number
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
