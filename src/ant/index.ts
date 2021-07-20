import { CompassDirection } from 'honeycomb-grid'
import { ANT_SIZE_MODIFIER, TILE_SIZE } from '../setting'
import { Ant } from '../types'
import { directionToDegrees } from '../utils'
import antSvgPath from './ant.svg'

export function createAnt({ x = 0, y = 0, direction = CompassDirection.NE }: Partial<Ant>): Ant {
  return { x, y, direction }
}

export function createAntElement({ x, y, direction }: Ant) {
  const element = document.createElement('img')
  element.setAttribute('src', antSvgPath)
  element.classList.add('ant')
  // todo: use css class for width and height
  element.style.width = `${TILE_SIZE * ANT_SIZE_MODIFIER}px`
  element.style.height = `${TILE_SIZE * ANT_SIZE_MODIFIER}px`
  element.style.top = `${y}px`
  element.style.left = `${x}px`
  element.style.transform = `rotate(${directionToDegrees(direction)}deg)`
  return element
}
