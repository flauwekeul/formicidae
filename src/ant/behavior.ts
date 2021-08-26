import { dropPheromone, turnLeft, turnRight, walk } from '.'
import { randomSelect, select, sequence } from '../behaviorTree'
import { sample } from '../utils'

const randomTurn = randomSelect(turnLeft, turnRight)

export const tick = select(sequence(sample(0.12), randomTurn), sequence(walk, dropPheromone), randomTurn)
