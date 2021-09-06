import { randomSelect, select, sequence, Task } from '../behaviorTree'
import { ANT_CARRY_CAPACITY } from '../setting'
import { Ant, directionOffset, pheromoneType, Tile } from '../types'
import { sample } from '../utils'

const tileInFront = ({ world, tile, direction }: Ant, offset: directionOffset = 0): Tile => {
  return world.neighborOfTile(tile, direction + offset * 60)
}

const canWalk = (ant: Ant): boolean => {
  const tile = tileInFront(ant)
  return ant.world.tileExists(tile) && !ant.world.isTileObstructed(tile)
}

const walk = (ant: Ant): boolean => {
  if (!canWalk(ant)) {
    return false
  }
  ant.tile = tileInFront(ant)
  return true
}

const turnLeft = (ant: Ant): true => {
  ant.direction -= 60
  return true
}

const turnRight = (ant: Ant): true => {
  ant.direction += 60
  return true
}

const dropPheromone = ({ world, tile, direction }: Ant): true => {
  world.addPheromone('nest', tile, direction)
  return true
}

const tileHasFood =
  (offset: directionOffset): Task<Ant> =>
  (ant) =>
    ant.world.foods.has(tileInFront(ant, offset).toString())

const tileHasPheromone =
  (type: pheromoneType) =>
  (offset: directionOffset): Task<Ant> =>
  (ant) =>
    ant.world.pheromones.get(tileInFront(ant, offset).toString())?.type === type

const tileIsNest =
  (offset: directionOffset): Task<Ant> =>
  (ant: Ant): boolean =>
    ant.world.nestHoles.has(tileInFront(ant, offset).toString())

const takeFood = (ant: Ant): boolean => {
  const food = ant.world.foods.get(tileInFront(ant).toString())
  if (!food) {
    return false
  }
  const amount = Math.min(ANT_CARRY_CAPACITY, food.amount)
  food.amount -= amount
  ant.transporting = amount
  return true
}

const dropFood = (ant: Ant): boolean => {
  const nest = ant.world.nestHoles.get(tileInFront(ant).toString())
  if (!nest) {
    return false
  }
  ant.transporting = 0
  return true
}

const turnToward = (inDirection: (offset: directionOffset) => Task<Ant>) =>
  select(inDirection(0), sequence(inDirection(-1), turnLeft), sequence(inDirection(1), turnRight))

const isTransportingFood = (ant: Ant): boolean => !!ant.transporting && ant.transporting > 0

const randomTurn = randomSelect(turnLeft, turnRight)

const scout = select(sequence(sample(0.12), randomTurn), sequence(walk, dropPheromone), randomTurn)

const transportFood = sequence(
  isTransportingFood,
  select(sequence(turnToward(tileIsNest), dropFood), sequence(turnToward(tileHasPheromone('nest')), walk), turnLeft),
)

export const tick = select(transportFood, sequence(turnToward(tileHasFood), takeFood), scout)

export const createAnt = ({ world, tile, direction }: Ant): Ant => {
  return {
    world,
    tile,
    direction,
  }
}
