import { createHexPrototype, Grid, HexCoordinates, neighborOf, rectangle } from 'honeycomb-grid'
import { createAnt } from './ant'
import { DEGREES, DEGREES_TO_COMPASS_DIRECTION_MAP } from './constants'
import { TILE_SIZE } from './setting'
import { Ant, directionInDegrees, Tile } from './types'
import { randomArrayItem, signedModulo } from './utils'

export class World {
  #grid: Grid<Tile>

  ants: Ant[] = []
  nestHoles: Tile[] = []

  constructor(public gridWidth: number, public gridHeight: number) {
    const hexPrototype = createHexPrototype<Tile>({ dimensions: { width: TILE_SIZE, height: TILE_SIZE } })
    this.#grid = new Grid(hexPrototype, rectangle({ width: this.gridWidth, height: this.gridHeight }))
  }

  addAnt(tile: Tile): Ant {
    const ant = createAnt({ world: this, tile, direction: randomArrayItem(DEGREES) })
    this.ants.push(ant)
    return ant
  }

  addHole(tile: Tile): void {
    this.nestHoles.push(tile)
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

  neighborOfTile(tile: Tile, direction: number): Tile {
    // the (degrees) direction can be negative, so a regular modulus won't do
    const normalizedDegrees = signedModulo(direction, 360) as directionInDegrees
    const compassDirection = DEGREES_TO_COMPASS_DIRECTION_MAP[normalizedDegrees]
    return this.getTile(neighborOf(tile, compassDirection))
  }

  render(): void {
    this.nestHoles.forEach((hole) => {
      const element = this.#createHoleElement()
      document.body.appendChild(element)
      element.style.top = `${hole.y}px`
      element.style.left = `${hole.x}px`
    })
  }

  #createHoleElement(): HTMLDivElement {
    const element = document.createElement('div')
    element.classList.add('hole')
    return element
  }
}
