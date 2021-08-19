import { Compass, CompassDirection, Grid, Hex, neighborOf } from 'honeycomb-grid'
import { ANT_SIZE_MODIFIER, TILE_SIZE } from '../setting'
import { Tile } from '../types'
import { directionToDegrees } from '../utils'
import antSvgPath from './ant.svg'

export class Ant {
  element?: HTMLImageElement

  get tileInFront() {
    return this.grid.getHex(neighborOf(this.tile, this.direction))
  }

  constructor(private grid: Grid<Hex>, public tile: Tile, public direction: CompassDirection) {}

  render() {
    if (!this.element) {
      this.element = this.#createElement()
    }

    this.element.style.top = `${this.tile.y}px`
    this.element.style.left = `${this.tile.x}px`
    // todo: directionToDegrees() should be something of Honeycomb
    this.element.style.transform = `rotate(${directionToDegrees(this.direction)}deg)`
    return this
  }

  move() {
    this.tile = this.tileInFront
    return this
  }

  turnLeft() {
    const newDirection = Compass.rotate(this.direction, -1)
    // todo: this is shit, Honeycomb should solve this
    this.direction = newDirection === 0 ? 7 : newDirection === 4 ? 3 : newDirection
    return this
  }

  turnRight() {
    const newDirection = Compass.rotate(this.direction, 1)
    // todo: this is shit, Honeycomb should solve this
    this.direction = newDirection === 0 ? 1 : newDirection === 4 ? 5 : newDirection
    return this
  }

  #createElement() {
    const element = document.createElement('img')
    element.setAttribute('src', antSvgPath)
    element.classList.add('ant')
    // todo: use css class for width and height
    element.style.width = `${TILE_SIZE * ANT_SIZE_MODIFIER}px`
    element.style.height = `${TILE_SIZE * ANT_SIZE_MODIFIER}px`
    return element
  }
}
