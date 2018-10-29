import { html } from 'lit-html';
import { prettify, round } from '../modules/helpers';


const input = (param, initialParams) => html`
  <div>
    <label>
      ${prettify(param)}
      <input type="number" name=${param} value=${initialParams[param] / 1000} />
    </label>
  </div>
`;


export default input;
