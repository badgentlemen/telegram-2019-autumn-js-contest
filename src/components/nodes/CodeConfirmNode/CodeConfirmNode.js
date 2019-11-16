import BaseComponent from "../../base.component";
import {createElement} from "../../../lib";
import UIInput from "../../UIInput/UIInput";
import './CodeConfirmNode.scss';
import {UIFormRow} from "../..";

export default class CodeConfirmNode extends BaseComponent {

    constructor(options = {}) {
        super(options);
        this.currentPhoneNumber = options.currentPhoneNumber || '+5423 432 42 34';
        this.validated = false;

        this.targetText = 'We have sent your an SMS <br> with the code';
        this.codeMaxLength = this.options.maxLength || 5;
        this.node = createElement('div', {
            class: 'ui-code-confirm__node login-page__node'
        });
        this.renderForm();
    }

    renderForm() {

        this.logo = createElement('div', {
            class: 'code-confirm__logo ui-desktop__logo'
        }, this.node);


        this.titleNode = createElement('h1', {
            class: 'code-confirm__title ui-desktop__title'
        }, this.node)

        this.titleNode.innerHTML = this.currentPhoneNumber;

        this.textNode = createElement('p', {
            class: 'code-confirm__text ui-desktop__text'
        }, this.node)

        this.textNode.innerHTML = this.targetText;

        this.formNode = createElement('div', {
            class: 'ui-form'
        }, this.node);

        this.codeConfirmInput = new UIInput({
            placeholder: '•••••',
            errorPlaceholder: 'Invalid Code',
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

        const formRow = UIFormRow(this.formNode);
        formRow.appendChild(this.codeConfirmInput.getNode());
    }

    setCodeError(error = {}) {
        this.codeConfirmInput.setError(true);
    }
}