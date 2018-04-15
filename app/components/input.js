import { html } from 'lit-html';
import prettify from '../modules/helpers/prettify'
import { round } from '../modules/helpers/math';


const input = (param, initialParams) => html`
  <div>
    <label>
      ${prettify(param)}
      <input type="number" step="0.1" name=${param} value=${round(initialParams[param], 2)} />
    </label>
  </div>
`;


export default input;
