import { api, LightningElement } from 'lwc';

export default class App extends LightningElement {
  @api message = 'Default Message';

  connectedCallback() {
    console.log(`connected in ${import.meta.env.SSR ? 'SSR' : 'CSR'} environment`);
  }
}
