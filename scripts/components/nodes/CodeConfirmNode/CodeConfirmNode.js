import BaseComponent from "../../base.component";
import {createElement} from "../../../lib";
import UIInput from "../../UIInput/UIInput";
import UIButton from "../../UIButton/UIButton";

export default class CodeConfirmNode extends BaseComponent {

    constructor(options = {}) {
        super(options);
        this.codeMaxLength = 5;
        this.node = createElement('div', {'class': this.getClassName()});
        this.renderForm();
    }

    renderForm() {
        var codeConfirmInput = new UIInput({
            placeholder: '•••••',
            labelPlaceholder: 'Code',
            maxLength: this.codeMaxLength,
            type: 'tel',
            onChange: value => {
                if (value.length === this.codeMaxLength) {
                    this.options.onMaxLength && this.options.onMaxLength(value);
                }
            }
        });
        this.node.appendChild(codeConfirmInput.getNode());
    }

    nodeClassName() {
        return 'ui-code-confirm__node';
    }
}