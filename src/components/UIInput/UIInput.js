import { BaseComponent } from '..';
import { createElement } from '../../lib';

export default class UIInput extends BaseComponent {
	constructor(options = {}) {
		super(options);
        this.type = options.type || 'text';
        this.placeholder = options.placeholder || '';
        this.labelPlaceholder = options.labelPlaceholder || this.placeholder;
		this.value = options.value || '';
		this.errorClassName = 'ui-input__error';
		this.focusClassName = 'ui-input__focus';
		this.notEmptyClassName = 'ui-input__not-empty';

        this.requireValid = this.options.requireValid || false;

        if (options.mask) {
            this.setMask(mask);
        }

		this.node = createElement('div', { class: this.getClassName() });
		this.input = createElement(
			'input',
			{ class: 'ui-input__input' },
			this.node
        );

        this.input.value = this.value;
        this.input.placeholder = this.placeholder;
        this.input.setAttribute('type', this.type);

        if (this.options.maxLength) {
            this.setMaxLength(this.options.maxLength);
        }

		this.label = createElement(
			'label',
			{ class: 'ui-input__label' },
			this.node
        );

        this.label.innerText = this.labelPlaceholder;
		this.addEventListeners();
	}

	addEventListeners() {
		this.input.addEventListener('focus', event => {
			this.node.classList.add(this.focusClassName);
			this.options.onFocus && this.options.onFocus(event);
		});

		this.input.addEventListener('blur', event => {
			this.node.classList.remove(this.focusClassName);
			this.options.onBlur && this.options.onBlur(event);
		});

		this.input.addEventListener('input', event => {
			this.value = event.target.value;
			if (this.value.length) {
				this.node.classList.add(this.notEmptyClassName);
			} else {
				this.node.classList.remove(this.notEmptyClassName);
			}

            this.options.onChange && this.options.onChange(this.value);
		});
    }

    getValue() {
        return this.value;
    }

    setMask(mask) {
        this.mask = mask;
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
        this.node.classList.remove(this.errorClassName);
    }

    addErrorFlag() {
        this.node.classList.add(this.errorClassName);
    }

    nodeClassName() {
        return 'ui-input';
    }
}
