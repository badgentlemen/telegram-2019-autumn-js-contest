import BaseComponent from "../../base.component";
import {createElement} from "../../../lib";
import UIInput from "../../UIInput/UIInput";

export default class CodeConfirmNode extends BaseComponent {

    constructor(options = {}) {
        super(options);
        this.currentPhoneNumber = '+5423 432 42 34';
        this.validated = false;
        this.codeMaxLength = this.options.maxLength || 5;
        this.node = createElement('div', {'class': this.getClassName()});
        this.renderForm();
    }

    renderForm() {
        this.codeConfirmInput = new UIInput({
            placeholder: '•••••',
            labelPlaceholder: 'Code',
            maxLength: this.codeMaxLength,
            type: 'tel',
            requireValid: true,
            onChange: value => {
                this.validated = value.length === this.codeMaxLength;
                if (this.validated) {
                    this.options.onMaxLength && this.options.onMaxLength(value);
                }
            },
            onFocus: _ => {
                this.codeConfirmInput.setError(false)
            },
            onBlur: _ => {
                this.codeConfirmInput.setError(!this.validated)
            }
        });
        this.node.appendChild(this.codeConfirmInput.getNode());
    }

    nodeClassName() {
        return 'ui-code-confirm__node';
    }
}