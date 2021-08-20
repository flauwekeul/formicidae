import { CompassDirection, Grid, Hex, neighborOf } from 'honeycomb-grid'
import { directionInDegrees, Tile } from '../types'
import { signedModulo } from '../utils'
import antSvgPath from './ant.svg'

export class Ant {
  element?: HTMLImageElement

  get tileInFront() {
    // todo: this is shit, Honeycomb should solve this
    // the (degrees) direction can be negative, so a regular modulus won't do
    const normalizedDegrees = signedModulo(this.direction, 360)
    const compassDirection = {
      30: CompassDirection.NE,
      90: CompassDirection.E,
      150: CompassDirection.SE,
      210: CompassDirection.SW,
      270: CompassDirection.W,
      330: CompassDirection.NW,
    }[normalizedDegrees] as CompassDirection
    return this.grid.getHex(neighborOf(this.tile, compassDirection))
  }

  constructor(private grid: Grid<Hex>, public tile: Tile, public direction: directionInDegrees) {}

  render() {
    if (!this.element) {
      this.element = this.#createElement()
    }

    this.element.style.top = `${this.tile.y}px`
    this.element.style.left = `${this.tile.x}px`
    this.element.style.transform = `rotate(${this.direction}deg)`
    return this
  }

  move() {
    this.tile = this.tileInFront
    return this
  }

  turnLeft() {
    this.direction -= 60
    return this
  }

  turnRight() {
    this.direction += 60
    return this
  }

  #createElement() {
    const element = document.createElement('img')
    element.setAttribute('src', antSvgPath)
    element.classList.add('ant')
    return element
  }
}
