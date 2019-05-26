import { html } from 'lit-html';
import { prettify } from '../modules/helpers'


const radio = (name, index, { pretty = true } = {}) => html`
  <div>
    <label>
      ${pretty ? prettify(name) : name}:
      ${index === 0
        ? html`<input
            name="cell-picker"
            type="radio"
            value="${index}"
            checked
          />`
        : html`<input
          name="cell-picker"
          type="radio"
          value="${index}"
        />`
      }
    </label>
  </div>
`;


export default radio;
