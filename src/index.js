import style from './assets/styles/main.scss';
import {html, render, svg, repeat} from 'lit-html';

// Components
import input from './components/input';

// Helpers
import pipeline from './modules/helpers/pipeline';

// Shapes
import { borderParams, getBorderArray } from './modules/shapes/border';
// import { crossParams as shapeParams, getOuterCrossArray as getOuterShapeArray } from './modules/shapes/cross';
import { squareRingParams as shapeParams, getOuterSquareRingArray as getOuterShapeArray, getInnerSquareRingArray as getInnerShapeArray } from './modules/shapes/square-ring';
// import { oscillatorParams as shapeParams, getOuterOscillatorArray as getOuterShapeArray, getInnerOscillatorArray as getInnerShapeArray } from './modules/shapes/oscillator';


class Shape {
  constructor() {
    this.initialParams = { ...borderParams, ...shapeParams };
    this.currentParams = {...this.initialParams};
    this.svgNode = document.querySelector('#svg');
    this.formNode = document.querySelector('#form');
  }


  /**
   * Returns the markup for parameter input fields
   *
   * @returns
   * @memberof Shape
   */
  getParameterInputMarkup() {
    const params = Object.keys(this.initialParams);

    return html`
      ${params.map(param => input(param, this.initialParams))}
    `;
  }


  /**
   * Listens for changes on the parameter input fields
   *
   * @memberof Shape
   */
  bindParameterInputs() {
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
    const shape1 = pipeline(getOuterShapeArray, this.shiftPoints, this.flattenPoints)(scaledParameters);
    const shape2 = pipeline(getInnerShapeArray, this.shiftPoints, this.flattenPoints)(scaledParameters);

    return svg`
      <g>
        <polygon class="substrate" points="${substrate}" />
        <polygon class="metal" points="${shape1}" />
        <polygon class="metal" points="${shape2}" />
      </g>
    `;

    // TODO: Is 'Oscillator' parametrised correctly?
    // return svg`
    //   <g>
    //     <polygon class="substrate" points="${substrate}" />
    //     <polygon class="metal" points="${shape2}" />
    //   </g>
    // `;
  }


  /**
   * Renders the SVG
   *
   * @memberof Shape
   */
  renderAntenna() {
    render(this.getAntenna(), this.svgNode);
  }


  /**
   * Renders the input fields
   *
   * @memberof Shape
   */
  renderParameterInputs() {
    render(this.getParameterInputMarkup(), this.formNode);
  }


  init() {
    this.renderAntenna();
    this.renderParameterInputs();
    this.bindParameterInputs();
  }
}

const shape = new Shape();
shape.init();
