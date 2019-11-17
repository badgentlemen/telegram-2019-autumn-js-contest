import {BaseComponent} from "..";
import {createElement} from "../../lib";
import './UICheckbox.scss';

import checkboxIcon from '../../assets/check_white.svg';

export default class UIChecbox extends BaseComponent {
    constructor(options = {}) {
        super(options);

        this.checked = this.options.checked || false;

        this.node = createElement('div', {
            class: this.getClassName()
        });
        this.node.innerText = options.title || '';

        this.node.addEventListener('click', event => {
            this.toggleChecked();
        });

        this.checkmarkNode = createElement('span', {
            class: 'ui-checkbox__checkmark'
        }, this.node);

        const imageIcon = createElement('img', {
            src: checkboxIcon,
            class: 'ui-checkbox__icon'
        })

        this.checkmarkNode.appendChild(imageIcon);

        this.checkboxNative = createElement('input', {
            class: 'ui-input__checkbox',
            type: 'checkbox',
            checked: this.checked
        }, this.node);

        this.updateContext();
    }

    updateContext() {
        this.checked
            ? this.node.classList.add('ui-checkbox__checked')
            : this.node.classList.remove('ui-checkbox__checked');

        this.checkboxNative.checked = this.checked;
    }

    toggleChecked() {
        this.checked = !this.checked;
        this.updateContext();
    }

    getValue() {
        return this.checkboxNative.checked
    }

    nodeClassName() {
        return 'ui-checkbox';
    }
}