import { LightningElement } from 'lwc';

export default class App extends LightningElement {
  connectedCallback() {
    console.log(`connected in ${import.meta.env.SSR ? 'SSR' : 'CSR'} environment`);
  }
}
