import BaseComponent from '../../base.component';
import { createElement } from '../../../lib';
import UIInput from '../../UIInput/UIInput';
import UIButton from '../../UIButton/UIButton';
import { UIFormRow } from '../..';
import {makePasswordHash} from '../../../lib/api.manager';

const notWatchingClassName = 'ui-monkey-logo__not_watching';
const watchingClassName = 'ui-monkey-logo__watching';

export default class Auth2Node extends BaseComponent {
	constructor(options = {}) {
		super(options);

        this.passwordValidated = false;
        this.passVisible = false;
        this.password = null;

		this.targetTitle = 'Enter a Password';
		this.targetText =
			'Your account is protected with <br/> an additional password';

		this.node = createElement('div', {
			class: 'ui-auth-2__node login-page__node'
		});

		this.logoNode = createElement(
			'div',
			{
				class: `${notWatchingClassName} ui-monkey-logo ui-auth2__logo`
			},
			this.node
		);

		this.titleNode = createElement(
			'h1',
			{
				class: 'ui-desktop__title ui-auth2__title'
			},
			this.node
        );
		this.titleNode.innerText = this.targetTitle;

		this.textNode = createElement(
			'p',
			{
				class: 'ui-desktop__text ui-auth2__text'
			},
			this.node
		);
		this.textNode.innerHTML = this.targetText;

		this.formNode = createElement(
			'div',
			{
				class: 'ui-form ui-form__incolumn'
			},
			this.node
		);

		this.passwordInput = new UIInput({
			errorPlaceholder: 'Invalid Password',
			placeholder: 'Password',
            type: 'password',
            requireValid: true
        });

        this.eyeNode = createElement('div', {
            class: 'ui-eye ui-eye__closed'
        });

        this.eyeNode.addEventListener('click', () => {
            this.handleEyeClick();
        })

        this.passwordInput.insertAdditional(this.eyeNode);

		this.nextButton = new UIButton({
            title: 'NEXT',
            onClick: _ => {
                this.password = this.passwordInput.getValue();
                this.handleValidate();
            }
		});

		[this.passwordInput, this.nextButton].forEach(item => {
			const formRow = UIFormRow(this.formNode);
			formRow.appendChild(item.getNode());
        });

        this.updateContext();
    }

    handleValidate() {
        this.passwordValidated = this.password.length > 2;
        if (this.passwordValidated) {
            this.options.onPasswordConfirm && this.options.onPasswordConfirm(this.password);
        }
        this.passwordInput.setError(!this.passwordValidated);
    }

    handleEyeClick() {
        this.passVisible = !this.passVisible;
        this.updateContext();
    }

    updateContext() {
        if (this.passVisible) {
            this.eyeNode.classList.add('ui-eye__closed')
        } else {
            this.eyeNode.classList.remove('ui-eye__closed')
        }

        this.monkeyLogoUpdate();
        this.passwordInput.setType(this.passVisible ? 'text' : 'password');
    }

    monkeyLogoUpdate() {

        const classList = this.logoNode.classList;
        classList.add(this.passVisible ? watchingClassName : notWatchingClassName);
        classList.remove(this.passVisible ? notWatchingClassName: watchingClassName);
    }
}
