import { render, tick, turnLeft, turnRight, walk } from './ant'
import { Game } from './game'
import { World } from './world'

const world = new World(4, 4)
const game = new Game(world)

const maxAnts = 3
const startTile = world.getTile([1, 1])
const addAntIntervalInMs = 200
let intervalId: NodeJS.Timer | void

world.addAnt(startTile)
const ant = world.ants[0]

document.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      walk(ant)
      break
    case 'ArrowLeft':
      turnLeft(ant)
      break
    case 'ArrowRight':
      turnRight(ant)
      break
    case ' ':
      game.isRunning ? game.stop() : game.start()
      intervalId = intervalId
        ? clearInterval(intervalId)
        : setInterval(() => {
            if (world.ants.length < maxAnts) {
              world.addAnt(startTile)
            }
          }, addAntIntervalInMs)
      break
    case 'Enter':
      tick(ant, performance.now())
      break
  }

  render(ant)
})
