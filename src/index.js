import { html, render, svg } from 'lit-html'
import { repeat } from 'lit-html/directives/repeat'
import omit from 'lodash.omit'

import style from './assets/styles/main.scss'

// Components
import input from './components/input'
import radio from './components/radio'

// Helpers
import { $, $$, getConstraint, keycodes, round } from './modules/helpers'

// Shapes
import { borderParams, getBorderArray } from './modules/shapes/border'
// import { crossParams as shapeParams, getOuterCrossArray as getOuterShapeArray } from './modules/shapes/cross'
import squareRing from './modules/shapes/square-ring'
import oscillator from './modules/shapes/oscillator'


const CELLS = {
  'square-ring': squareRing,
  'oscillator': oscillator,
}
const DOWNLOAD_SCALE = 0.000001
const INPUT_EVENTS = ['blur', 'keyup', 'mouseup']
const SIMULATION_SETTINGS = {
  'fft': 'FFT',
  's-parameters': 'S-parameters',
}
const STEP_SIZE = 100


class Shape {
  currentCell = CELLS[CELLS |> Object.keys |> #[0]]
  initialParams = { ...borderParams, ...this.currentCell.params }
  currentParams = this.initialParams
  constraints = this.currentCell.constraints
  scale = 80 / this.initialParams['cellWidth']
  $svgNode = $('#svg')
  $cellParametersNode = $('#cell-parameters')
  $cellSelectorNode = $('#cell-selector')
  $simulationSettingsNode = $('#simulation-settings')


  /**
   * Listens for changes on the parameter input fields
   *
   */
  bindCellParameters = () => {
    const inputs = $$('input[type="number"]')

    inputs.forEach((input) => {
      INPUT_EVENTS.forEach(eventType => {
        input.addEventListener(eventType, () => {
          this.updateCellParameters(input)
        })
      })
    })
  }


  /**
   * Listens for changes on the cell selector
   *
   */
  bindCellSelector = () => {
    const radios = $$('#cell-selector input[type="radio"]')

    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          this.unbindCellParameters()
          this.currentCell = CELLS[radio.value]
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
   * Listens for changes in the simulation settings
   *
   */
  bindSimulationSettings = () => {
    const radios = $$('#simulation-settings input[type="radio"]')

    radios.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          this.simulationSettings = radio.value
        }
      })
    })
  }


  /**
   * Checks if the provided input is valid
   *
   * @param {node} input
   * @returns {boolean}
   */
  checkValidity = input => input.validity
    |> omit(#, ['stepMismatch', 'Symbol(Symbol.toStringTag)', 'valid'])
    |> Object.values
    |> #.every(value => value === false)


  /**
   * Saves the antenna as a file
   *
   * @returns
   */
  downloadCell = () => {
    const borderParams = {
      cellHeight: this.currentParams.cellHeight,
      cellWidth: this.currentParams.cellWidth,
    }
    const scaledBorderParams = this.scaleParameters(borderParams, DOWNLOAD_SCALE)
    const shapeArrays = this.currentCell.shapes.map(shape =>
      this.currentParams
      |> this.scaleParameters(#, DOWNLOAD_SCALE)
      |> shape.points
      |> this.flipYCoords(#)
    )

    return this.currentCell.download(this.currentCell.name, shapeArrays, scaledBorderParams, this.simulationSettings)
  }


  /**
   * Listens for clicks on the download button
   *
   */
  downloadListener = () => {
    const downloadButton = $('.download')
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
   * Outputs the points in an SVG compatible format
   *
   * @param {float[]} points
   * @returns {float[]}
   */
  flattenPointsSVG = points => points.reduce((acc, point, index) =>
      (index !== points.length - 1)
        ? `${acc} ${point[0]},${point[1]}`
        : acc
      , '')


  /**
   * Flips the sign of y coordinates
   *
   * @param {float[]} points
   * @returns {float[]}
   */
  flipYCoords = points => points.map(point => [point[0], -point[1]])


  /**
   * Returns the SVG markup
   *
   * @returns
   */
  getAntenna = () => {
    const scaledParameters = this.scaleParameters(this.currentParams, this.scale)
    const substrate = scaledParameters
      |> getBorderArray
      |> this.shiftPoints(#)
      |> this.flattenPointsSVG(#)

    return svg`
      <g>
        <polygon class="substrate" points="${substrate}" />
        ${repeat(
          this.currentCell.shapes,
          shape => shape.id,
          shape => svg`
            <polygon
              class="${ shape.inverse ? 'inverse' : 'metal'}"
              points="${scaledParameters
                |> shape.points
                |> this.shiftPoints(#)
                |> this.flattenPointsSVG(#)
              }"
            />
          `
        )}
      </g>
    `
  }


  /**
   * Returns the markup for parameter input fields
   *
   * @returns
   */
  getCellParameterMarkup = () => html`
    ${this.currentParams
      |> Object.keys
      |> #.map(param => input(
        param,
        this.currentParams,
        STEP_SIZE,
        (param !== 'cellHeight' && param !== 'cellWidth') ? this.getMinConstraint(param) : 14 * 10**3,
        (param !== 'cellHeight' && param !== 'cellWidth') ? this.getMaxConstraint(param) : 18 * 10**3
      ))
    }
  `


  /**
   * Returns the markup for the cell selector
   *
   * @returns
   */
  getCellSelectorMarkup = () => html`
    <div>
      <h2>Cell Picker</h2>
      <div class="radios">
        ${CELLS
          |> Object.keys
          |> #.map((key, index) => radio({
              index,
              label: CELLS[key].name,
              name: 'cell-picker',
              value: key,
            }))
        }
      </div>
    </div>
  `


  /**
   * Gets the maximum value of the parameter
   *
   * @param {string} parameterName
   * @returns {float}
   */
  getMaxConstraint = parameterName => {
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

    return (rawConstraintAlt && constraintAlt < constraint)
      ? constraintAlt
      : (parameterName.includes('Gap'))
      ? constraint * 2
      : constraint
  }


  /**
   * Gets the minimum value of the parameter
   *
   * @param {string} parameterName
   * @returns {float}
   */
  getMinConstraint = parameterName => this.constraints[parameterName].min


  /**
   * Returns the markup for the simulation settings
   *
   * @returns
   */
  getSimulationSettingsMarkup = () => html`
    <div>
      <h2>Simulation Settings</h2>
      <div class="radios">
        ${SIMULATION_SETTINGS
          |> Object.keys
          |> #.map((key, index) => radio({
              index,
              label: SIMULATION_SETTINGS[key],
              name: 'simulation-type',
              value: key,
            }))
        }
      </div>
    </div>
  `


  renderAntenna = () => {
    render(this.getAntenna(), this.$svgNode)
  }


  renderCellSelector = () => {
    render(this.getCellSelectorMarkup(), this.$cellSelectorNode)
  }


  renderParameterInputs = () => {
    render(this.getCellParameterMarkup(), this.$cellParametersNode)
  }


  renderSimulationSettings = () => {
    render(this.getSimulationSettingsMarkup(), this.$simulationSettingsNode)
  }


  /**
   * Scales the parameters to fit the shape in the SVG
   *
   * @param {object} parameters
   * @param {float} scale
   * @returns {object}
   */
  scaleParameters = (parameters, scale) => {
    let scaledParameters = {}
    const parameterNames = Object.keys(parameters)
    const parameterValues = Object.values(parameters)
    parameterNames.forEach((parameterName, index) => {
      scaledParameters[parameterNames[index]] = scale * parameterValues[index]
    })

    return scaledParameters
  }


  /**
   * Centers the points in the SVG
   *
   * @param {float[]} points
   * @returns {float[]}
   */
  shiftPoints = points => points.map(point => [point[0] + 50, point[1] + 50])


  /**
   * Stops listening for changes on the parameter input fields
   *
   */
  unbindCellParameters = () => {
    const inputs = $$('input[type="number"]')

    inputs.forEach((input) => {
      input.removeEventListener('change', () => {})
    })
  }


  /**
   * Updates the cell parameters
   *
   * @param {node} input
   */
  updateCellParameters = input => {
    const parameterName = input.getAttribute('name')
    let parameterValue = parseFloat(input.value * 1000)

    if (!this.checkValidity(input)) {
      input.classList.add('invalid')
      return
    }

    input.classList.remove('invalid')
    this.currentParams[parameterName] = parameterValue
    this.renderAntenna()
  }


  init = () => {
    this.renderCellSelector()
    this.renderSimulationSettings()
    this.renderParameterInputs()
    this.renderAntenna()
    this.bindCellSelector()
    this.bindSimulationSettings()
    this.bindCellParameters()
    this.downloadListener()
  }
}


const shape = new Shape()
shape.init()
