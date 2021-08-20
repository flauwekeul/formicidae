import { CompassDirection, Grid, Hex, neighborOf } from 'honeycomb-grid'
import { ANT_TICK_INTERVAL } from '../setting'
import { directionInDegrees, Tile } from '../types'
import { signedModulo } from '../utils'
import antSvgPath from './ant.svg'

export class Ant {
  private prevTimestamp = -1

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

  tick(timestamp: number) {
    if (timestamp - this.prevTimestamp < ANT_TICK_INTERVAL) {
      return
    }

    this.prevTimestamp = timestamp
    const random = Math.random()
    if (random < 0.12) {
      random < 0.06 ? this.turnLeft() : this.turnRight()
    } else {
      this.move()
    }
  }

  render() {
    if (!this.element) {
      this.element = this.#createElement()
      document.body.appendChild(this.element as HTMLImageElement)
    }

    this.element.style.top = `${this.tile.y}px`
    this.element.style.left = `${this.tile.x}px`
    this.element.style.transform = `rotate(${this.direction}deg)`
  }

  move() {
    this.tile = this.tileInFront
  }

  turnLeft() {
    this.direction -= 60
  }

  turnRight() {
    this.direction += 60
  }

  #createElement() {
    const element = document.createElement('img')
    element.setAttribute('src', antSvgPath)
    element.classList.add('ant')
    return element
  }
}
