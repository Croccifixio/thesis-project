import style from './assets/styles/main.scss'
import { html, render, svg } from 'lit-html'
import { repeat } from 'lit-html/directives/repeat'

// Components
import input from './components/input'
import radio from './components/radio'

// Helpers
import { $, $$, arrToObj, getConstraint, keycodes, round } from './modules/helpers'

// Shapes
import { borderParams, getBorderArray } from './modules/shapes/border'
// import { crossParams as shapeParams, getOuterCrossArray as getOuterShapeArray } from './modules/shapes/cross'
import squareRing from './modules/shapes/square-ring'
import oscillator from './modules/shapes/oscillator'


const DOWNLOAD_SCALE = 0.000001
const SIMULATION_SETTINGS = arrToObj(['FFT', 'S-parameters'])


class Shape {
    cells = [
      squareRing,
      oscillator,
    ]
    currentCell = this.cells[0]
    initialParams = { ...borderParams, ...this.currentCell.params }
    currentParams = this.initialParams
    constraints = this.currentCell.constraints
    $svgNode = $('#svg')
    $cellParametersNode = $('#cell-parameters')
    $cellSelectorNode = $('#cell-selector')
    $simulationSettingsNode = $('#simulation-settings')


  /**
   * Returns the markup for the cell selector
   *
   * @returns
   */
  getCellSelectorMarkup = () =>
    html`
      <h2>Cell Picker</h2>
      <div class="radios">
        ${this.cells.map(({ name }, index) => radio(name, index))}
      </div>
    `


  /**
   * Returns the markup for parameter input fields
   *
   * @returns
   */
  getCellParameterMarkup = () =>
    html`
      ${this.currentParams
        |> Object.keys
        |> #.filter(param => param !== 'cellHeight' && param !== 'cellWidth')
        |> #.map(param => input(param, this.currentParams))
      }
    `


  /**
   * Returns the markup for the simulation settings
   *
   * @returns
   */
  getSimulationSettingsMarkup = () =>
    html`
      <h2>Simulation Settings</h2>
      <div class="radios">
        ${SIMULATION_SETTINGS
          |> Object.values
          |> #.map((name, index) => radio(name, index, { pretty: false }))}
      </div>
    `


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
   */
  bindCellParameters = () => {
    const inputs = $$('input[type="number"]')

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
   * Listens for changes in the simulation settings
   *
   */
  bindSimulationSettings = () => {
    const radios = $$('#simulation-settings input[type="radio"]')

    radios.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          this.simulationSettings = SIMULATION_SETTINGS[radio.value]
        }
      })
    })
  }


  /**
   * Checks if the parameter can be increased
   *
   * @param {string} parameterName
   * @param {float} parameterValue
   * @returns
   */
  checkMaxConstraints = (parameterName, parameterValue) => {
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
   */
  checkMinConstraints = (parameterName, parameterValue) =>
    (parameterValue - this.constraints[parameterName].min > 100)



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
   * Scales the parameters to fit the shape in the SVG
   *
   * @param {object} parameters
   * @param {float} scale
   * @returns
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
   * @param {array<float>} points
   * @returns
   */
  shiftPoints = points => {
    return points.map(point => [point[0] + 50, point[1] + 50])
  }


  /**
   * Outputs the points in an SVG compatible format
   *
   * @param {array<float>} points
   * @returns
   */
  flattenPointsSVG = points => {
    return points.reduce((acc, point, index) =>
      (index !== points.length - 1)
        ? `${acc} ${point[0]},${point[1]}`
        : acc
      , '')
  }


  /**
   * Flips the sign of y coordinates
   *
   */
  flipYCoords = points => {
    return points.map(point => [point[0], -point[1]])
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
   * Saves the antenna as a file
   *
   */
  downloadCell = () => {
    const scaledBorderParams = this.scaleParameters(borderParams, DOWNLOAD_SCALE)
    const shapeArrays = this.currentCell.shapes.map(shape =>
      this.scaleParameters(this.currentParams, DOWNLOAD_SCALE)
      |> shape.points
      |> this.flipYCoords(#)
    )
    return this.currentCell.download(this.currentCell.name, shapeArrays, scaledBorderParams, this.simulationSettings)
  }


  /**
   * Returns the SVG markup
   *
   * @returns
   */
  getAntenna = () => {
    const scale = 80 / this.initialParams['cellWidth']
    const scaledParameters = this.scaleParameters(this.currentParams, scale)
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
              points=${scaledParameters
                |> shape.points
                |> this.shiftPoints(#)
                |> this.flattenPointsSVG(#)
              }
            />
          `
        )}
      </g>
    `
  }


  renderAntenna = () => {
    render(this.getAntenna(), this.$svgNode)
  }


  renderCellSelector = () => {
    render(this.getCellSelectorMarkup(), this.$cellSelectorNode)
  }


  renderSimulationSettings = () => {
    render(this.getSimulationSettingsMarkup(), this.$simulationSettingsNode)
  }


  renderParameterInputs = () => {
    render(this.getCellParameterMarkup(), this.$cellParametersNode)
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
