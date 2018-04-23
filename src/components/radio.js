import { html } from 'lit-html';
import prettify from '../modules/helpers/prettify'


const radio = (name, index) => html`
  <div>
    <label>
      ${prettify(name)}:
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
