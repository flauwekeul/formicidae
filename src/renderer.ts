import antSvgPath from './ant/ant.svg'
import { FOOD_MAX_PER_TILE, PHEROMONE_MAX, TILE_SIZE } from './setting'
import { Ant, Food, NestHole, Pheromone, RenderOptions } from './types'
import { createElement, updateStyle } from './utils'

export class Renderer {
  options: RenderOptions = {
    renderAnts: true,
    renderFoods: true,
    renderPheromones: true,
  }

  constructor(options: Partial<RenderOptions> = {}) {
    Object.assign(this.options, options)
  }

  renderAnt(ant: Ant): void {
    if (!this.options.renderAnts) {
      return
    }
    ant.element = createElement('img', { className: 'ant', src: antSvgPath })
    this.updateAnt(ant)
  }

  updateAnt(ant: Ant): void {
    if (!this.options.renderAnts || !ant.element) {
      return
    }
    updateStyle(ant.element, {
      top: `${ant.tile.y}px`,
      left: `${ant.tile.x}px`,
      transform: `translate(-50%, -50%) rotate(${ant.direction}deg)`,
    })
  }

  renderNestHole(nestHole: NestHole): void {
    const element = createElement('div', { className: 'hole' })
    updateStyle(element, {
      top: `${nestHole.tile.y}px`,
      left: `${nestHole.tile.x}px`,
    })
    nestHole.element = element
  }

  renderFood(food: Food): void {
    if (!this.options.renderFoods) {
      return
    }
    const element = createElement('div', { className: 'food' })
    updateStyle(element, {
      top: `${food.tile.y}px`,
      left: `${food.tile.x}px`,
    })
    food.element = element
    this.updateFood(food)
  }

  updateFood(food: Food): void {
    if (!this.options.renderFoods || !food.element) {
      return
    }
    updateStyle(food.element, {
      width: `${food.amount * (TILE_SIZE / FOOD_MAX_PER_TILE)}px`,
      height: `${food.amount * (TILE_SIZE / FOOD_MAX_PER_TILE)}px`,
    })
  }

  renderPheromone(pheromone: Pheromone): void {
    if (!this.options.renderPheromones) {
      return
    }
    const element = pheromone?.element ?? createElement('div', { className: 'pheromone' })
    updateStyle(element, {
      top: `${pheromone.tile.y}px`,
      left: `${pheromone.tile.x}px`,
    })
    pheromone.element = element
    this.updatePheromone(pheromone)
  }

  updatePheromone(pheromone: Pheromone): void {
    if (!this.options.renderPheromones || !pheromone.element) {
      return
    }
    updateStyle(pheromone.element, { opacity: `${pheromone.amount / PHEROMONE_MAX}` })
  }
}
