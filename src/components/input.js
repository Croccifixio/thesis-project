import { html } from 'lit-html';
import prettify from '../modules/helpers/prettify'
import { round } from '../modules/helpers/math';


const input = (param, initialParams) => html`
  <div>
    <label>
      ${prettify(param)}
      <input type="number" name=${param} value=${initialParams[param] / 1000} />
    </label>
  </div>
`;


export default input;
