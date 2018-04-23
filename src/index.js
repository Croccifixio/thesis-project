import style from './assets/styles/main.scss';
import { html, render, svg } from 'lit-html';
import { repeat } from 'lit-html/lib/repeat';

// Components
import input from './components/input';
import radio from './components/radio';

// Helpers
import pipeline from './modules/helpers/pipeline';

// Shapes
import { borderParams, getBorderArray } from './modules/shapes/border';
// import { crossParams as shapeParams, getOuterCrossArray as getOuterShapeArray } from './modules/shapes/cross';
import { squareRingParams, getOuterSquareRingArray, getInnerSquareRingArray } from './modules/shapes/square-ring';
import { oscillatorParams, getOuterOscillatorArray, getInnerOscillatorArray } from './modules/shapes/oscillator';


class Shape {
  constructor() {
    this.cells = [
      {
        name: 'squareRing',
        params: squareRingParams,
        shapes: [
          {
            id: 1,
            points: getOuterSquareRingArray,
          },
          {
            id: 2,
            points: getInnerSquareRingArray,
          },
        ],
      },
      {
        name: 'oscillator',
        params: oscillatorParams,
        shapes: [
          {
            id: 1,
            points: getOuterOscillatorArray,
          },
          {
            id: 2,
            inverse: true,
            points: getInnerOscillatorArray,
          },
        ],
      },
    ];
    this.currentCell = this.cells[0];
    this.initialParams = { ...borderParams, ...this.currentCell.params };
    this.currentParams = {...this.initialParams};
    this.svgNode = document.querySelector('#svg');
    this.cellParametersNode = document.querySelector('#cell-parameters');
    this.cellSelectorNode = document.querySelector('#cell-selector');
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
        ${this.cells.map((cell, index) => radio(cell.name, index))}
      </div>
    `;
  }


  /**
   * Returns the markup for parameter input fields
   *
   * @returns
   * @memberof Shape
   */
  getCellParameterMarkup() {
    const params = Object.keys(this.currentParams);

    return html`
      ${params.map(param => input(param, this.currentParams))}
    `;
  }


  /**
   * Listens for changes on the cell selector
   *
   * @memberof Shape
   */
  bindCellSelector() {
    const radios = document.querySelectorAll('#cell-selector input[type="radio"]');

    radios.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          this.unbindCellParameters();
          this.currentCell = this.cells[radio.value];
          this.currentParams = { ...borderParams, ...this.currentCell.params };
          this.renderParameterInputs();
          this.renderAntenna();
          this.bindCellParameters();
        }
      });
    })
  }


  /**
   * Listens for changes on the parameter input fields
   *
   * @memberof Shape
   */
  bindCellParameters() {
    const inputs = document.querySelectorAll('input[type="number"]');

    inputs.forEach((input) => {
      input.addEventListener('change', () => {
        const parameterName = input.getAttribute('name');
        const parameterValue = input.value;
        // TODO: validate constraints
        this.currentParams[parameterName] = parameterValue;
        this.renderAntenna();
      });
    });
  }


  /**
   * Stops listening for changes on the parameter input fields
   *
   * @memberof Shape
   */
  unbindCellParameters() {
    const inputs = document.querySelectorAll('input[type="number"]');

    inputs.forEach((input) => {
      input.removeEventListener('change', () => {});
    });
  }


  /**
   * Scales the parameters to fit the shape in the SVG
   *
   * @param {any} scale
   * @returns
   * @memberof Shape
   */
  scaleParameters(scale) {
    let scaledParameters = {};
    const parameterNames = Object.keys(this.currentParams);
    const parameterValues = Object.values(this.currentParams);
    parameterNames.forEach((parameterName, index) => {
      scaledParameters[parameterNames[index]] = scale * parameterValues[index];
    });

    return scaledParameters;
  }


  /**
   * Centers the points in the SVG
   *
   * @param {any} points
   * @returns
   * @memberof Shape
   */
  shiftPoints(points) {
    return points.map((point) => [point[0] + 50, point[1] + 50]);
  }


  /**
   * Outputs the points in an SVG compatible format
   *
   * @param {any} points
   * @returns
   * @memberof Shape
   */
  flattenPoints(points) {
    return points.reduce((acc, point, index) =>
      (index !== points.length - 1)
        ? `${acc} ${point[0]},${point[1]}`
        : acc
      , '');
  }


  /**
   * Returns the SVG markup
   *
   * @returns
   * @memberof Shape
   */
  getAntenna() {
    const scale = 80 / this.initialParams['cellWidth'];
    const scaledParameters = this.scaleParameters(scale);
    const substrate = pipeline(getBorderArray, this.shiftPoints, this.flattenPoints)(scaledParameters);
    // const shape1 = pipeline(getOuterShapeArray, this.shiftPoints, this.flattenPoints)(scaledParameters);
    // const shape2 = pipeline(getInnerShapeArray, this.shiftPoints, this.flattenPoints)(scaledParameters);


    return svg`
      <g>
        <polygon class="substrate" points="${substrate}" />
        ${repeat(
          this.currentCell.shapes,
          (shape) => shape.id,
          (shape) => svg`
            <polygon class="${ shape.inverse ? 'inverse' : 'metal' }" points=${pipeline(shape.points, this.shiftPoints, this.flattenPoints)(scaledParameters)} />
          `
        )}
      </g>
    `;
  }


  /**
   * Renders the SVG
   *
   * @memberof Shape
   */
  renderAntenna() {
    render(this.getAntenna(), this.svgNode);
  }


  renderCellSelector() {
    render(this.getCellSelectorMarkup(), this.cellSelectorNode);
  }


  /**
   * Renders the input fields
   *
   * @memberof Shape
   */
  renderParameterInputs() {
    render(this.getCellParameterMarkup(), this.cellParametersNode);
  }


  init() {
    this.renderCellSelector();
    this.renderParameterInputs();
    this.renderAntenna();
    this.bindCellSelector();
    this.bindCellParameters();
  }
}

const shape = new Shape();
shape.init();
