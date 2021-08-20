import { Game } from './game'

const game = new Game()
game.init()

const antAmount = 1
const startTile = game.grid.getHex([-10, 40])
for (let i = 0; i < antAmount; i++) {
  game.addAnt(startTile)
}

const ant = game.ants[0]

document.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      ant.move()
      break
    case 'ArrowLeft':
      ant.turnLeft()
      break
    case 'ArrowRight':
      ant.turnRight()
      break
    case ' ':
      game.hasStarted ? game.stop() : game.start()
      break
    case 'Enter':
      ant.tick(performance.now())
      break
  }

  ant.render()
})
