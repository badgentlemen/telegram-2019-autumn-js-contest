import { createElement } from '../../../lib';
import { BaseComponent, UIFormRow } from '../..';
import UIInput from '../../UIInput/UIInput';
import UICountySelect from '../../UICountrySelect';
import UIButton from '../../UIButton/UIButton';
import { phoneMaskByCode, isPhoneValid } from '../../../utils';

import './SignInNode.scss';

export default class SignInNode extends BaseComponent {
	constructor(options) {
		super(options);

		this.phoneValidated = false;
		this.country = null;

		options = options || {};
		this.phone_code_hash = null;
		this.targetTitle = 'Sign in to Telegram';
		this.targetText =
			'Please confirm your country and <br> enter your phone number';
		this.node = createElement('div', {
			class: 'ui-sign-in__node login-page__node'
		});
		this.sendCodeButton = null;
		this.renderForm();
	}

	renderForm() {
		createElement(
			'div',
			{
				class: 'ui-sign-in__logo ui-desktop__logo'
			},
			this.node
		);
		const title = createElement(
			'h1',
			{
				class: 'ui-sign-in__title ui-desktop__title'
			},
			this.node
		);
		title.innerText = this.targetTitle;
		const text = createElement(
			'p',
			{
				class: 'ui-sign-in__text ui-desktop__text'
			},
			this.node
		);
		text.innerHTML = this.targetText;
		const form = createElement(
			'div',
			{
				class:
					'ui-form ui-form__incolumn ui-form__confirm-country-phone'
			},
			this.node
        );

        this.sendCodeButton = new UIButton({
			title: 'NEXT',
			onClick: event => {
				event.preventDefault();
				if (this.options.onNextClicked) {
					this.options.onNextClicked(this.phoneValue, this.country);
				}
			}
		});

        const placeholder = 'Phone Number'

		this.phoneNumberInput = new UIInput({
            placeholder,
            labelPlaceholder: placeholder,
			requireValid: true,
			onChange: value => {
				this.phoneValue = value;
				this.togglePhoneInputValidate(isPhoneValid(value));
			},
			onFocus: event => {
				this.phoneNumberInput.setError(false);
			},
			onBlur: event => {
				this.phoneNumberInput.setError(!this.phoneValidated);
			},
			value: this.options.phoneNumber || '',
			class: 'ui-sign-in__phone-number-input'
		});

		this.phoneNumberInput.getNode().style.display = 'none';

		this.countrySelector = new UICountySelect({
			placeholder: 'Country',
			class: 'ui-sign-in__country-select',
			onChange: country => {
				this.country = country;

				const phoneCode = this.country.code;
				const phoneMask = phoneMaskByCode(phoneCode);

				if (this.country && this.phoneNumberInput) {
					this.phoneNumberInput.getNode().style.display = 'flex';
					this.phoneNumberInput.setMask(phoneMask);
				}
			},
			onBlur: _ => {
				this.countrySelector.skeletorWrapper.setError(
					this.country == null
				);
			}
        });

        [this.countrySelector, this.phoneNumberInput, this.sendCodeButton].forEach(item => {
            const formRow = UIFormRow(form);
            formRow.appendChild(item.getNode());
        });

		// var checkbox = new uiCheckbox({}, 'ui-sign-in__keep-state', new uiFormRow(form));
	}

	togglePhoneInputValidate(state) {
		this.phoneValidated = state;
		this.handleValidate();
	}

	handleValidate() {
		this.sendCodeButton.getNode().style.display = this.phoneValidated
			? 'block'
			: 'none';
	}
}
