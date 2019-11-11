import {BaseComponent} from "..";
import {createElement} from "../../lib";

export default class UIButton extends BaseComponent {
    constructor(options) {
        super(options);
        this.title = options.title || '';
        this.node = createElement('button', {'class': this.getClassName()});
        this.node.innerText = this.title;
        this.theme = this.options.theme || 'primary';
        this.node.classList.add(this.themeClassName());
        this.addEventListeners();
    }

    themeClassName() {
        switch (this.theme) {
            case 'primary':
                return 'ui-button__primary';
            default:
                return 'ui-button__default';
        }
    }

    setLoading() {

    }

    nodeClassName() {
        return 'ui-button';
    }

    addEventListeners() {
        this.node.addEventListener('click', event => {
            this.options.onClick && this.options.onClick(event);
        });
    }
}