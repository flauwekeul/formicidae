import { render, tick, turnLeft, turnRight, walk } from './ant'
import { Game } from './game'
import { World } from './world'

const maxAnts = 100
const addAntIntervalInMs = 300
let intervalId: NodeJS.Timer | void

const world = new World(80, 80)
const game = new Game(world)

world.addHole(world.getTile([2, 5]))
world.addFood(world.getTile([40, 60]), 50)
world.render()

const selectedAnt = world.addAnt(world.nestHoles[0])

document.addEventListener('keyup', (event) => {
  if (event.key === ' ') {
    game.isRunning ? game.stop() : game.start()
    intervalId = intervalId
      ? clearInterval(intervalId)
      : setInterval(() => {
          if (world.ants.length < maxAnts) {
            world.addAnt(world.nestHoles[0])
          }
        }, addAntIntervalInMs)
    return
  }

  switch (event.key) {
    case 'ArrowUp':
      walk(selectedAnt)
      break
    case 'ArrowLeft':
      turnLeft(selectedAnt)
      break
    case 'ArrowRight':
      turnRight(selectedAnt)
      break
    case 'Enter':
      tick(selectedAnt, performance.now())
      break
  }

  render(selectedAnt)
})
