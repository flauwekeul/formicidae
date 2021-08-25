import { turnLeft, turnRight, walk } from '.'
import { randomSelect, select, sequence } from '../behaviorTree'
import { sample } from '../utils'

const randomTurn = randomSelect(turnLeft, turnRight)

export const performTask = select(sequence(select(sample(0.12)), randomTurn), walk, randomTurn)
