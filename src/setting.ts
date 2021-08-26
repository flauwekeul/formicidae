export const TILE_SIZE = 16
export const TICK_INTERVAL_IN_MS = 100

export const ANT_SIZE_MODIFIER = 1.3
// if the transition duration is more than the tick interval, the animation is smoother
export const ANT_TRANSITION_DURATION_IN_MS = TICK_INTERVAL_IN_MS * 2
export const ANT_PHEROMONE_DROP_AMOUNT = 50

export const PHEROMONE_MAX = 1000
export const PHEROMONE_DECAY_PER_MS = 0.02
