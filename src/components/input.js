import { html } from 'lit-html'
import { prettify, round } from '../modules/helpers'


const input = (param, initialParams, stepSize, min, max) => html`
  <div>
    <label>
      ${prettify(param)}
      <input type="number" name=${param} value=${initialParams[param] / 1000} step=${stepSize/ 1000} min=${min / 1000} max=${max / 1000} />
    </label>
  </div>
`


export default input
