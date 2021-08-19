import { CompassDirection, createHexPrototype, Grid } from 'honeycomb-grid'
import { Ant } from './ant'
import { TILE_SIZE } from './setting'
import { Tile } from './types'

const hexPrototype = createHexPrototype<Tile>({ dimensions: { width: TILE_SIZE, height: TILE_SIZE } })
const grid = new Grid(hexPrototype)

const startTile = grid.getHex([20, 20])
const ant = new Ant(grid, startTile, CompassDirection.W)

ant.render()
document.body.appendChild(ant.element as HTMLImageElement)

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
  }

  ant.render()
})
