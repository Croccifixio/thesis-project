import { html } from 'lit-html'
import { prettify } from '../modules/helpers'


const radio = ({index, label, name, value }) => html`
  <div>
    <label>
      ${index === 0
        ? html`<input
            name="${name}"
            type="radio"
            value="${value}"
            checked
          />`
        : html`<input
          name="${name}"
          type="radio"
          value="${value}"
        />`
      }
      ${label}
    </label>
  </div>
`


export default radio
