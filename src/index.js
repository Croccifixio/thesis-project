import style from './assets/styles/main.scss'
import { html, render, svg } from 'lit-html'
import { repeat } from 'lit-html/lib/repeat'

// Components
import input from './components/input'
import radio from './components/radio'

// Helpers
import { getConstraint, keycodes, pipeline, round } from './modules/helpers'

// Shapes
import { borderParams, getBorderArray } from './modules/shapes/border'
// import { crossParams as shapeParams, getOuterCrossArray as getOuterShapeArray } from './modules/shapes/cross'
import squareRing from './modules/shapes/square-ring'
import oscillator from './modules/shapes/oscillator'


const DOWNLOAD_SCALE = 0.001


class Shape {
  constructor() {
    this.cells = [
      oscillator,
      squareRing,
    ]
    this.currentCell = this.cells[0]
    this.initialParams = { ...borderParams, ...this.currentCell.params }
    this.currentParams = this.initialParams
    this.constraints = this.currentCell.constraints
    this.svgNode = document.querySelector('#svg')
    this.cellParametersNode = document.querySelector('#cell-parameters')
    this.cellSelectorNode = document.querySelector('#cell-selector')
  }


  /**
   * Returns the markup for the cell selector
   *
   * @returns
   * @memberof Shape
   */
  getCellSelectorMarkup() {
    return html`
      <h2>Cell Picker</h2>
      <div class="radios">
        ${this.cells.map(({ name }, index) => radio(name, index))}
      </div>
    `
  }


  /**
   * Returns the markup for parameter input fields
   *
   * @returns
   * @memberof Shape
   */
  getCellParameterMarkup() {
    const params = Object.keys(this.currentParams)

    return html`
      ${params
        .filter(param => param !== 'cellHeight' && param !== 'cellWidth')
        .map(param => input(param, this.currentParams))
      }
    `
  }


  /**
   * Listens for changes on the cell selector
   *
   * @memberof Shape
   */
  bindCellSelector() {
    const radios = document.querySelectorAll('#cell-selector input[type="radio"]')

    radios.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          this.unbindCellParameters()
          this.currentCell = this.cells[radio.value]
          this.currentParams = { ...borderParams, ...this.currentCell.params }
          this.constraints = this.currentCell.constraints
          this.renderParameterInputs()
          this.renderAntenna()
          this.bindCellParameters()
        }
      })
    })
  }


  /**
   * Listens for changes on the parameter input fields
   *
   * @memberof Shape
   */
  bindCellParameters() {
    const inputs = document.querySelectorAll('input[type="number"]')

    inputs.forEach((input) => {
      input.addEventListener('keydown', (e) => {
        if (!Object.values(keycodes).includes(e.which)) return

        e.preventDefault()
        const parameterName = input.getAttribute('name')
        let parameterValue = parseFloat(input.value * 1000)

        if (e.which === keycodes.upArrow) {
          if (!this.checkMaxConstraints(parameterName, parameterValue)) return
          parameterValue += 100
        } else if (e.which === keycodes.downArrow) {
          if (!this.checkMinConstraints(parameterName, parameterValue)) return
          parameterValue -= 100
        }

        input.value = round(parameterValue / 1000, 5)
        this.currentParams[parameterName] = parameterValue
        this.renderAntenna()
      })
    })
  }



  /**
   * Checks if the parameter can be increased
   *
   * @param {string} parameterName
   * @param {float} parameterValue
   * @returns
   * @memberof Shape
   */
  checkMaxConstraints(parameterName, parameterValue) {
    let fit = 0
    if (parameterName.endsWith('Horizontal') || parameterName.endsWith('Width')) fit = this.currentParams['cellWidth'] / 2
    if (parameterName.endsWith('Vertical') || parameterName.endsWith('Height')) fit = this.currentParams['cellHeight'] / 2 - 300

    const rawConstraint = (this.constraints[parameterName].max
      ? getConstraint(this.constraints[parameterName], this.currentParams)
      : 0)

    const rawConstraintAlt = (this.constraints[parameterName].maxAlt
      ? this.constraints[parameterName].maxAlt.reduce((acc, cur) => {
          if (cur.includes('Gap')) return acc + this.currentParams[cur] / 2
          return acc + this.currentParams[cur]
        }, 0)
      : 0)

    const constraint = fit - rawConstraint - this.constraints[parameterName].maxOffset
    const constraintAlt = fit - rawConstraintAlt - this.constraints[parameterName].maxAltOffset

    console.group()
    console.log('fit =>', fit)
    console.log('parameterName =>', parameterName)
    console.log('this.constraints[parameterName] =>', this.constraints[parameterName])
    console.log('rawConstraint =>', rawConstraint)
    console.log('constraint =>', constraint)
    console.groupEnd()

    if (rawConstraintAlt && constraintAlt < constraint) return (parameterValue - constraintAlt <= 100)
    if (parameterName.includes('Gap')) return (parameterValue - constraint * 2 <= 100)
    return (parameterValue - constraint <= 100)
  }


  /**
   * Checks if the parameter can be decreased
   *
   * @param {string} parameterName
   * @param {float} parameterValue
   * @returns
   * @memberof Shape
   */
  checkMinConstraints(parameterName, parameterValue) {
    return (parameterValue - this.constraints[parameterName].min > 100)
  }


  /**
   * Stops listening for changes on the parameter input fields
   *
   * @memberof Shape
   */
  unbindCellParameters() {
    const inputs = document.querySelectorAll('input[type="number"]')

    inputs.forEach((input) => {
      input.removeEventListener('change', () => {})
    })
  }


  /**
   * Scales the parameters to fit the shape in the SVG
   *
   * @param {float} scale
   * @returns
   * @memberof Shape
   */
  scaleParameters(scale) {
    let scaledParameters = {}
    const parameterNames = Object.keys(this.currentParams)
    const parameterValues = Object.values(this.currentParams)
    parameterNames.forEach((parameterName, index) => {
      scaledParameters[parameterNames[index]] = scale * parameterValues[index]
    })

    return scaledParameters
  }


  /**
   * Centers the points in the SVG
   *
   * @param {array<float>} points
   * @returns
   * @memberof Shape
   */
  shiftPoints(points) {
    return points.map((point) => [point[0] + 50, point[1] + 50])
  }


  /**
   * Outputs the points in an SVG compatible format
   *
   * @param {array<float>} points
   * @returns
   * @memberof Shape
   */
  flattenPointsSVG(points) {
    return points.reduce((acc, point, index) =>
      (index !== points.length - 1)
        ? `${acc} ${point[0]},${point[1]}`
        : acc
      , '')
  }


  /**
   * Outputs the points in an ASIC compatible format
   *
   * @param {array<float>} points
   * @returns
   * @memberof Shape
   */
  flattenPointsForDownload(points) {
    // TODO: uncomment if export function changes its implementation
    // return points.map((point) => `${point[0]} ${point[1]}`)
    return points
  }


  /**
  //  * Flips the sign of y coordinates
   *
   * @memberof Shape
   */
  flipYCoords(points) {
    return points.map((point) => [point[0], -point[1]])
  }


  /**
   * Listens for clicks on the download button
   *
   * @memberof Shape
   */
  downloadListener() {
    const downloadButton = document.querySelector('.download')
    downloadButton.addEventListener('click', () => {
      const textarea = document.createElement("textarea")
      textarea.textContent = this.downloadCell()
      textarea.style.position = "fixed"
      document.body.appendChild(textarea)
      textarea.select()
      console.log('copied =>', textarea.textContent)
      try {
        return document.execCommand('copy')
      } catch (e) {
        console.error(e)
      } finally {
        document.body.removeChild(textarea)
      }
    })
  }


  /**
   * Saves the antenna as a file
   *
   * @memberof Shape
   */
  downloadCell() {
    const shapeArrays = this.currentCell.shapes.map((shape) => {
      return pipeline(shape.points, this.flipYCoords, this.flattenPointsForDownload)(this.scaleParameters(DOWNLOAD_SCALE))
    })
    return this.currentCell.download(shapeArrays)
  }


  /**
   * Returns the SVG markup
   *
   * @returns
   * @memberof Shape
   */
  getAntenna() {
    const scale = 80 / this.initialParams['cellWidth']
    const scaledParameters = this.scaleParameters(scale)
    const substrate = pipeline(getBorderArray, this.shiftPoints, this.flattenPointsSVG)(scaledParameters)
    // const shape1 = pipeline(getOuterShapeArray, this.shiftPoints, this.flattenPointsSVG)(scaledParameters)
    // const shape2 = pipeline(getInnerShapeArray, this.shiftPoints, this.flattenPointsSVG)(scaledParameters)

    return svg`
      <g>
        <polygon class="substrate" points="${substrate}" />
        ${repeat(
          this.currentCell.shapes,
          (shape) => shape.id,
          (shape) => svg`
            <polygon class="${ shape.inverse ? 'inverse' : 'metal' }" points=${pipeline(shape.points, this.shiftPoints, this.flattenPointsSVG)(scaledParameters)} />
          `
        )}
      </g>
    `
  }


  /**
   * Renders the SVG
   *
   * @memberof Shape
   */
  renderAntenna() {
    render(this.getAntenna(), this.svgNode)
  }



  /**
   * Renders an antenna shape switcher
   *
   * @memberof Shape
   */
  renderCellSelector() {
    render(this.getCellSelectorMarkup(), this.cellSelectorNode)
  }


  /**
   * Renders the input fields
   *
   * @memberof Shape
   */
  renderParameterInputs() {
    render(this.getCellParameterMarkup(), this.cellParametersNode)
  }


  init() {
    this.renderCellSelector()
    this.renderParameterInputs()
    this.renderAntenna()
    this.bindCellSelector()
    this.bindCellParameters()
    this.downloadListener()
  }
}

const shape = new Shape()
shape.init()
