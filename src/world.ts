import { CompassDirection, createHexPrototype, Grid, HexCoordinates, neighborOf, rectangle } from 'honeycomb-grid'
import { Ant, createAnt } from './ant'
import { TILE_SIZE } from './setting'
import { directionInDegrees, Tile } from './types'
import { randomArrayItem, signedModulo } from './utils'

const DEGREES: directionInDegrees[] = [30, 90, 150, 210, 270, 330]

// todo: this is shit, Honeycomb should offer a way to convert degrees to compass direction
export const DEGREES_TO_COMPASS_DIRECTION_MAP = {
  [DEGREES[0]]: CompassDirection.NE,
  [DEGREES[1]]: CompassDirection.E,
  [DEGREES[2]]: CompassDirection.SE,
  [DEGREES[3]]: CompassDirection.SW,
  [DEGREES[4]]: CompassDirection.W,
  [DEGREES[5]]: CompassDirection.NW,
}

export class World {
  #grid: Grid<Tile>

  ants: Ant[] = []

  constructor(public gridWidth: number, public gridHeight: number) {
    const hexPrototype = createHexPrototype<Tile>({ dimensions: { width: TILE_SIZE, height: TILE_SIZE } })
    this.#grid = new Grid(hexPrototype, rectangle({ width: this.gridWidth, height: this.gridHeight }))
  }

  addAnt(tile: Tile): void {
    this.ants.push(createAnt({ world: this, tile, direction: randomArrayItem(DEGREES) }))
  }

  tileExists(tile: Tile): boolean {
    return this.#grid.store.has(tile.toString())
  }

  isTileObstructed(tile: Tile): boolean {
    return this.ants.some((ant) => ant.tile.equals(tile))
  }

  getTile(coordinates: HexCoordinates): Tile {
    return this.#grid.getHex(coordinates)
  }

  neighborOfTile(tile: Tile, direction: directionInDegrees): Tile {
    // the (degrees) direction can be negative, so a regular modulus won't do
    const normalizedDegrees = signedModulo(direction, 360) as directionInDegrees
    const compassDirection = DEGREES_TO_COMPASS_DIRECTION_MAP[normalizedDegrees]
    return this.getTile(neighborOf(tile, compassDirection))
  }
}
