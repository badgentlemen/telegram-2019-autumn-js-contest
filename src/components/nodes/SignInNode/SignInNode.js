import { createElement } from '../../../lib';
import { BaseComponent, UIFormRow } from '../..';
import UIInput from '../../UIInput/UIInput';
import UICountySelect from '../../UICountrySelect';
import UIButton from '../../UIButton/UIButton';
import { replaceAllString, phoneMaskByCode, isPhoneValid } from '../../../utils';

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
			class: 'ui-sign-in__node'
		});
        this.uibutton = null;
		this.renderForm();
	}

	renderForm() {
		createElement(
			'div',
			{
				class: 'ui-sign-in__logo'
			},
			this.node
		);
		const title = createElement(
			'h1',
			{
				class: 'ui-sign-in__title ui-text__center'
			},
			this.node
		);
		title.innerText = this.targetTitle;
		const text = createElement(
			'p',
			{
				class: 'ui-sign-in__text ui-text__center'
			},
			this.node
		);
		text.innerHTML = this.targetText;
		const form = createElement(
			'form',
			{
				class:
					'ui-form ui-form__incolumn ui-form__confirm-country-phone'
			},
			this.node
		);
		this.countrySelector = new UICountySelect({
			placeholder: 'Country',
            class: 'ui-sign-in__country-select',
            onChange: country => {
                this.country = country;

                if (this.country) {
                    this.phoneNumberInput.getNode().style.display = 'flex';
                }

                const phoneCode = this.country.code;
                const phoneMask = phoneMaskByCode(phoneCode);
                this.phoneNumberInput.setMask(phoneMask);
            },
            onBlur: _ => {
                this.countrySelector.skeletorWrapper.setError(this.country == null);
            }
		});
		var countrySelectFormRow = UIFormRow(form);
		countrySelectFormRow.appendChild(this.countrySelector.getNode());
		form.appendChild(countrySelectFormRow);
		this.phoneNumberInput = new UIInput({
			placeholder: 'Phone Number',
			requireValid: true,
			onChange: value => {
                this.phoneValue = value;
                this.togglePhoneInputValidate(isPhoneValid(value));
            },
			onFocus: event => {
				this.phoneNumberInput.setError(false);
			},
			onBlur: event => {
				console.log(this.phoneValidated);
				this.phoneNumberInput.setError(!this.phoneValidated);
            },
			value: this.options.phoneNumber || '',
			class: 'ui-sign-in__phone-number-input'
        });

        this.phoneNumberInput.getNode().style.display = 'none';

		var inputFormRow = UIFormRow(form);
		inputFormRow.appendChild(this.phoneNumberInput.getNode());
		form.appendChild(inputFormRow);
		this.uibutton = new UIButton({
			title: 'NEXT',
			onClick: event => {
				event.preventDefault();
				if (this.options.onNextClicked) {
                    this.options.onNextClicked(this.phoneValue, this.country)
				}
			}
		});
        form.appendChild(this.uibutton.getNode());
        this.togglePhoneInputValidate(false);




		// var checkbox = new uiCheckbox({}, 'ui-sign-in__keep-state', new uiFormRow(form));
		// var button = createElement('button', {'class': 'ui-button'}, new uiFormRow(form));
		// button.innerText = 'NEXT';
		// button.addEventListener('click', function (event) {
		//     event.preventDefault();
		//     var code = phoneNumberInput.getValue();
		//     APIManager.signIn('+79604245511', phone_code_hash, code).then(function (data) {
		//     });
		// });
		// phoneNumberInput.setError(null);
		// phoneNumberInput.type = 'text';
	}

	togglePhoneInputValidate(state) {
		this.phoneValidated = state;
		this.handleValidate();
	}

	handleValidate() {
		this.uibutton.getNode().style.display = this.phoneValidated
			? 'block'
			: 'none';
	}
}
