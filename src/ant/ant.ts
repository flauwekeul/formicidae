import { Ant, Tile } from '../types'

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

export function canWalk(ant: Ant): boolean {
  const tile = tileInFront(ant)
  return ant.world.tileExists(tile) && !ant.world.isTileObstructed(tile)
}
