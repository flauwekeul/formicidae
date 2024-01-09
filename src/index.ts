import { Game } from './game'
import { Renderer } from './renderer'
import { FOOD_MAX_PER_TILE } from './setting'
import { World } from './world'

const maxAnts = 3
const addAntIntervalInMs = 234
let intervalId: NodeJS.Timer | void

const renderer = new Renderer({ offset: { top: 200, left: 400 }, renderPheromones: true })
const world = new World(30, 30, renderer)
const game = new Game(world)

const nestHoleTile = world.getTile([1, 1])
world.addNestHole(nestHoleTile)
world.addFood(world.getTile([15, 29]), FOOD_MAX_PER_TILE)

document.addEventListener('keyup', (event) => {
  if (event.key === ' ') {
    game.isRunning ? game.stop() : game.start()
    intervalId = intervalId
      ? clearInterval(intervalId)
      : setInterval(() => {
          if (world.ants.length < maxAnts) {
            world.addAnt(nestHoleTile)
          }
        }, addAntIntervalInMs)
  } else if (event.key === 'Enter') {
    game.tick(performance.now())
  }
})
