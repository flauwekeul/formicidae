import { Game } from './game'

const game = new Game(80, 80)
game.init()

const antAmount = 100
const startTile = game.grid.getHex([-10, 40])
for (let i = 0; i < antAmount; i++) {
  game.addAnt(startTile)
}

const ant = game.ants[0]

document.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      ant.walk()
      break
    case 'ArrowLeft':
      ant.turnLeft()
      break
    case 'ArrowRight':
      ant.turnRight()
      break
    case ' ':
      game.isRunning ? game.stop() : game.start()
      break
    case 'Enter':
      ant.tick(performance.now())
      break
  }

  ant.render()
})
