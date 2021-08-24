import { CompassDirection, Grid, neighborOf } from 'honeycomb-grid'
import { randomSelect, select, sequence } from '../behaviorTree'
import { ANT_TICK_INTERVAL } from '../setting'
import { directionInDegrees, Tile } from '../types'
import { signedModulo } from '../utils'
import antSvgPath from './ant.svg'

// todo: this is shit, Honeycomb should offer a way to convert degrees to compass direction
const DEGREES_TO_COMPASS_DIRECTION_MAP = {
  30: CompassDirection.NE,
  90: CompassDirection.E,
  150: CompassDirection.SE,
  210: CompassDirection.SW,
  270: CompassDirection.W,
  330: CompassDirection.NW,
}

export class Ant {
  #prevTimestamp = -1

  element?: HTMLImageElement

  get tileInFront() {
    // the (degrees) direction can be negative, so a regular modulus won't do
    const normalizedDegrees = signedModulo(this.direction, 360) as directionInDegrees
    const compassDirection = DEGREES_TO_COMPASS_DIRECTION_MAP[normalizedDegrees]
    return this.grid.getHex(neighborOf(this.tile, compassDirection))
  }

  constructor(public grid: Grid<Tile>, public tile: Tile, public direction: directionInDegrees) {}

  tick(timestamp: number) {
    if (timestamp - this.#prevTimestamp < ANT_TICK_INTERVAL) {
      return
    }
    this.#prevTimestamp = timestamp

    const sample = (probability: number) => () => Math.random() < probability
    const randomTurn = randomSelect(this.turnLeft, this.turnRight)

    const task = select(sequence(select(sample(0.12)), randomTurn), this.walk, randomTurn)
    task(this)
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

  walk() {
    if (!this.canWalk()) {
      return false
    }
    this.tile = this.tileInFront
    return true
  }

  turnLeft() {
    this.direction -= 60
    return true
  }

  turnRight() {
    this.direction += 60
    return true
  }

  canWalk() {
    return this.grid.store.get(this.tileInFront.toString())
  }

  #createElement() {
    const element = document.createElement('img')
    element.setAttribute('src', antSvgPath)
    element.classList.add('ant')
    return element
  }
}
