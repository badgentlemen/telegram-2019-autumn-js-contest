import { BaseComponent } from '..';
import { createElement } from '../../lib';
import Inputmask from "inputmask";
import ComponentSkeleton from '../ComponentSkeleton';

export default class UIInput extends BaseComponent {
	constructor(options = {}) {
		super(options);
        this.type = options.type || 'text';
        this.placeholder = options.placeholder || '';
        this.labelPlaceholder = options.labelPlaceholder || this.placeholder;
		this.value = options.value || '';

        this.requireValid = this.options.requireValid || false;

        this.inputMask = null;

        if (options.mask) {
            this.setMask(mask);
        }

        this.skeletonNode = new ComponentSkeleton({
            class: this.getClassName()
        })

        this.node = this.skeletonNode.getContentNode();

		this.input = createElement(
			'input',
			{ class: 'ui-input__input' },
			this.node
        );

        this.skeletonNode.insertContentNode(this.input);

        this.input.value = this.value;
        this.input.placeholder = this.placeholder;
        this.input.setAttribute('type', this.type);

        if (this.options.maxLength) {
            this.setMaxLength(this.options.maxLength);
        }

        this.skeletonNode.setPlaceholder(this.labelPlaceholder);

		this.addEventListeners();
	}

	addEventListeners() {
		this.input.addEventListener('focus', event => {
            this.skeletonNode.setFocus(true);
			this.options.onFocus && this.options.onFocus(event);
		});

		this.input.addEventListener('blur', event => {
			this.skeletonNode.setFocus(false);
			this.options.onBlur && this.options.onBlur(event);
		});

		this.input.addEventListener('input', event => {
            this.value = event.target.value;
            this.handleInput();
            this.options.onChange && this.options.onChange(this.value);
		});
    }

    getNode() {
        return this.skeletonNode.getNode();
    }

    handleInput() {
        this.skeletonNode.setIsNotEmpty(this.value.length)
    }

    getValue() {
        return this.value;
    }

    setMask(mask) {
        this.mask = mask;
        this.inputMask = Inputmask({
            numericInput: true,
            mask: this.mask,
            placeholder: ''
        }).mask(this.input);

        this.inputMask.setValue(this.value);

        this.handleInput();
    }

    setError(error) {
        if (this.requireValid) {
            error ? this.addErrorFlag() : this.removeErrorFlag();
        } else {
            this.removeErrorFlag();
        }
    }

    setMaxLength(maxLength) {
        this.maxLength = maxLength;
        this.input.setAttribute('maxlength', maxLength);
    }

    removeErrorFlag() {
        this.skeletonNode.setError(false);
    }

    addErrorFlag() {
        this.skeletonNode.setError(true);
    }

    nodeClassName() {
        return 'ui-input';
    }
}
