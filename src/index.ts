import { render, tick, turnLeft, turnRight, walk } from './ant'
import { Game } from './game'

const game = new Game(80, 80)
game.init()

const maxAnts = 100
const startTile = game.grid.getHex([20, 40])
const addAntIntervalInMs = 200
let intervalId: NodeJS.Timer | void

game.addAnt(startTile)
const ant = game.ants[0]

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
            if (game.ants.length < maxAnts) {
              game.addAnt(startTile)
            }
          }, addAntIntervalInMs)
      break
    case 'Enter':
      tick(ant, performance.now())
      break
  }

  render(ant)
})
