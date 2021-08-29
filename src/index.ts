import { Game } from './game'
import { Renderer } from './renderer'
import { FOOD_MAX_PER_TILE } from './setting'
import { World } from './world'

const maxAnts = 100
const addAntIntervalInMs = 234
let intervalId: NodeJS.Timer | void

const renderer = new Renderer({ renderPheromones: false })
const world = new World(80, 80, renderer)
const game = new Game(world)

world.addNestHole(world.getTile([2, 5]))
world.addFood(world.getTile([40, 60]), FOOD_MAX_PER_TILE)

document.addEventListener('keyup', (event) => {
  if (event.key === ' ') {
    game.isRunning ? game.stop() : game.start()
    intervalId = intervalId
      ? clearInterval(intervalId)
      : setInterval(() => {
          if (world.ants.length < maxAnts) {
            world.addAnt(world.nestHoles[0].tile)
          }
        }, addAntIntervalInMs)
    return
  }
})

// const selectedAnt = world.addAnt(world.nestHoles[0].tile)
// document.addEventListener('keyup', (event) => {
//   switch (event.key) {
//     case 'ArrowUp':
//       walk(selectedAnt)
//       renderUpdate(selectedAnt)
//       break
//     case 'ArrowLeft':
//       turnLeft(selectedAnt)
//       renderUpdate(selectedAnt)
//       break
//     case 'ArrowRight':
//       turnRight(selectedAnt)
//       renderUpdate(selectedAnt)
//       break
//     case 'Enter':
//       world.tick()
//       break
//   }
// })
