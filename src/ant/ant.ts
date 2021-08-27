import { Ant, BaseAnt, Tile } from '../types'
import { createElement } from '../utils'
import antSvgPath from './ant.svg'

export function createAnt({ world, tile, direction }: BaseAnt): Ant {
  return {
    world,
    tile,
    direction,
  }
}

export function tileInFront({ world, tile, direction }: Ant, offset: -1 | 0 | 1 = 0): Tile {
  return world.neighborOfTile(tile, direction + offset * 60)
}

export function render(ant: Ant): Ant {
  if (!ant.element) {
    ant.element = createElement('img', { className: 'ant', src: antSvgPath })
  }

  ant.element.style.top = `${ant.tile.y}px`
  ant.element.style.left = `${ant.tile.x}px`
  ant.element.style.transform = `translate(-50%, -50%) rotate(${ant.direction}deg)`

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

export function dropPheromone({ world, tile, direction }: Ant): true {
  world.addPheromone('nest', tile, direction)
  return true
}
