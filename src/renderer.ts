import { render, renderUpdate } from './ant'
import { FOOD_MAX_PER_TILE, PHEROMONE_MAX, TILE_SIZE } from './setting'
import { Ant, Food, NestHole, Pheromone, RenderOptions } from './types'
import { createElement } from './utils'

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
    render(ant)
    this.updateAnt(ant)
  }

  updateAnt(ant: Ant): void {
    if (!this.options.renderAnts) {
      return
    }
    renderUpdate(ant)
  }

  renderNestHole({ tile }: NestHole): void {
    // todo: make createElement accept a style object
    const element = createElement('div', { className: 'hole' })
    element.style.top = `${tile.y}px`
    element.style.left = `${tile.x}px`
  }

  renderFood(food: Food): void {
    if (!this.options.renderFoods) {
      return
    }
    const element = createElement('div', { className: 'food' })
    element.style.top = `${food.tile.y}px`
    element.style.left = `${food.tile.x}px`
    food.element = element
    this.updateFood(food)
  }

  updateFood(food: Food): void {
    if (!this.options.renderFoods || !food.element) {
      return
    }
    food.element.style.width = `${food.amount * (TILE_SIZE / FOOD_MAX_PER_TILE)}px`
    food.element.style.height = `${food.amount * (TILE_SIZE / FOOD_MAX_PER_TILE)}px`
  }

  renderPheromone(pheromone: Pheromone): void {
    if (!this.options.renderPheromones) {
      return
    }
    const element = pheromone?.element ?? createElement('div', { className: 'pheromone' })
    element.style.top = `${pheromone.tile.y}px`
    element.style.left = `${pheromone.tile.x}px`
    pheromone.element = element
    this.updatePheromone(pheromone)
  }

  updatePheromone(pheromone: Pheromone): void {
    if (!this.options.renderPheromones || !pheromone.element) {
      return
    }
    pheromone.element.style.opacity = `${pheromone.amount / PHEROMONE_MAX}`
  }
}
