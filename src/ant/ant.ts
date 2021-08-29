import { Ant, Tile } from '../types'
import { createElement } from '../utils'
import antSvgPath from './ant.svg'

export function createAnt({ world, tile, direction }: Ant): Ant {
  return {
    world,
    tile,
    direction,
  }
}

export function tileInFront({ world, tile, direction }: Ant, offset: -1 | 0 | 1 = 0): Tile {
  return world.neighborOfTile(tile, direction + offset * 60)
}

export function render(ant: Ant): void {
  ant.element = createElement('img', { className: 'ant', src: antSvgPath })
  renderUpdate(ant)
}

export function renderUpdate(ant: Ant): void {
  if (!ant.element) {
    return
  }

  ant.element.style.top = `${ant.tile.y}px`
  ant.element.style.left = `${ant.tile.x}px`
  ant.element.style.transform = `translate(-50%, -50%) rotate(${ant.direction}deg)`
}

export function canWalk(ant: Ant): boolean {
  const tile = tileInFront(ant)
  return ant.world.tileExists(tile) && !ant.world.isTileObstructed(tile)
}
