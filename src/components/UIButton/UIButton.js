import {BaseComponent} from "..";
import {createElement} from "../../lib";
import {uiSpinner} from "../../utils";

const loadingClass = 'ui-button__loading';
const spinnerClass = 'ui-button__spinner';

export default class UIButton extends BaseComponent {

    constructor(options) {
        super(options);
        this.title = options.title || '';
        this.node = createElement('button', {'class': this.getClassName()});

        this.titleNode = createElement('span', {
            class: 'ui-button__title'
        }, this.node);

        this.titleNode.innerText = this.title;
        this.loadingSpinner = uiSpinner(spinnerClass);
        this.node.appendChild(this.loadingSpinner);
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

    setLoading(state) {
        if (state) {
            this.node.classList.add(loadingClass);
            this.titleNode.innerText = this.options.waitText || 'PLEASE WAIT...';
            this.node.setAttribute('disabled', 'disabled');
        } else {
            this.node.classList.remove(loadingClass);
            this.titleNode.innerText = this.title;
            this.node.removeAttribute('disabled');
        }
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