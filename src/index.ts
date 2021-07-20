import { CompassDirection, createHexPrototype, Grid, rectangle } from 'honeycomb-grid'
import { createAnt, createAntElement } from './ant'
import { TILE_SIZE } from './setting'

const hexPrototype = createHexPrototype({ dimensions: { width: TILE_SIZE, height: TILE_SIZE } })
const grid = new Grid(hexPrototype, rectangle({ start: [0, 0], width: 40, height: 40 }))

const { x, y } = grid.getHex([20, 20])
const ant = createAnt({ x, y, direction: CompassDirection.SE })

document.body.appendChild(createAntElement(ant))
