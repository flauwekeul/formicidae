import { randomSelect, select, sequence } from '../behaviorTree'
import { Ant } from '../types'
import { sample } from '../utils'
import { canWalk, tileInFront } from './ant'

export function walk(ant: Ant): boolean {
  if (!canWalk(ant)) {
    return false
  }
  ant.tile = tileInFront(ant)
  return true
}

export function turnLeft(ant: Ant): true {
  ant.direction -= 60
  return true
}

export function turnRight(ant: Ant): true {
  ant.direction += 60
  return true
}

export function dropPheromone({ world, tile, direction }: Ant): true {
  world.addPheromone('nest', tile, direction)
  return true
}

const randomTurn = randomSelect(turnLeft, turnRight)

export const tick = select(sequence(sample(0.12), randomTurn), sequence(walk, dropPheromone), randomTurn)
