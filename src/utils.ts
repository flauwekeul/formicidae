import { CompassDirection } from 'honeycomb-grid'

export function directionToDegrees(direction: CompassDirection) {
  if (['N', 0, 'S', 4].includes(direction)) {
    throw new Error(`invalid direction: ${direction}`)
  }

  return {
    NE: 30,
    1: 30,
    E: 90,
    2: 90,
    SE: 150,
    3: 150,
    SW: 210,
    5: 210,
    W: 270,
    6: 270,
    NW: 330,
    7: 330,
  }[direction as string | number]
}
