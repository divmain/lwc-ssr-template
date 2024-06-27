import { api, LightningElement, setHooks } from 'lwc';
import { linkTextNodes } from './linkTextNodes';

const isCSR = !import.meta.env.SSR;


setHooks({
    sanitizeHtmlContent(rawHTMLString) {
        return rawHTMLString;
    }
})

export default class App extends LightningElement {
    initialRender = true;
    connected = false;
    richText = null;
    serverRenderedContent = null;
    _value = '';

    @api
    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val === undefined || val === null ? '' : String(val);
        console.log(`SERVER`);
        this.renderRichText();
    }

    renderedCallback() {
        if (this.initialRender) {
            this.renderRichText();
            this.initialRender = true;
        }
    }

    connectedCallback() {
        this.connected = true;

        // If loading on the client
        if (isCSR) {
            // But already set a value on the server
            this.serverRenderedContent = this.container?.innerHTML;
            console.log(this.serverRenderedContent);

            if (this.serverRenderedContent) {
                // FIXME: In the example this isn't getting set
                this.richText = this.serverRenderedContent;
            }
        }
    }

    sanitize(value) {
        // Hardcoding this function for simplicity
        // Should sanitize when loaded CSR
        return `<p> THIS IS example.com AND salesforce.com </p>`;
    }

    renderRichText() {
        console.log(`isCSR: ${isCSR}`);
        if (!isCSR) {
            // If SSR, do not sanitize the value
            console.log('SSR');
            this.richText = this.value;
        }

        if (this.connected) {
            const container = this.container;
            
            if (!this.initialRender || !this.serverRenderedContent) {
                // If CSR, do sanitize the value
                this.richText = this.sanitize(this.value);
            }

            console.log(container.innerHTML);

            // I know that this function is working correctly
            // but for debugging purposes I have included it.
            // What's broken is what is getting inputted as the container.
            linkTextNodes(container);
            this.addLinkClickListener();
        }
    }

    addLinkClickListener() {
        this.links.forEach((link) => {
            link.addEventListener('click', this.handleClick.bind(this));
        })
    }

    get links() {
        return this.container ? [...this.container.querySelectorAll('a')] : [];
    }

    get container() {
        return this.template.querySelector('span');
    }

    handleClick(event) {
        const anchor = event.currentTarget;
        const url = anchor.href;
        console.log(`handling click for ${url}`);
    }

}