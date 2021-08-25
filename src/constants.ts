import { CompassDirection } from 'honeycomb-grid'
import { directionInDegrees } from './types'

export const DEGREES: directionInDegrees[] = [30, 90, 150, 210, 270, 330]

// todo: this is shit, Honeycomb should offer a way to convert degrees to compass direction
export const DEGREES_TO_COMPASS_DIRECTION_MAP = {
  [DEGREES[0]]: CompassDirection.NE,
  [DEGREES[1]]: CompassDirection.E,
  [DEGREES[2]]: CompassDirection.SE,
  [DEGREES[3]]: CompassDirection.SW,
  [DEGREES[4]]: CompassDirection.W,
  [DEGREES[5]]: CompassDirection.NW,
}
