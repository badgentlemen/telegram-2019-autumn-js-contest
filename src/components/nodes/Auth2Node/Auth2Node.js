import BaseComponent from '../../base.component';
import {createElement} from '../../../lib';
import UIInput from '../../UIInput/UIInput';
import UIButton from '../../UIButton/UIButton';
import {UIFormRow} from '../..';

export default class Auth2Node extends BaseComponent {
    constructor(options = {}) {
        super(options);

        this.passVisible = false;

        this.targetTitle = 'Enter a Password';
        this.targetText = 'Your account is protected with <br/> an additional password';

        this.node = createElement('div', {
            class: 'ui-auth-2__node login-page__node'
        });

        this.logoNode = createElement('div', {
            class: 'ui-desktop__logo ui-auth2__logo'
        }, this.node);

        this.titleNode = createElement('h1', {
            class: 'ui-desktop__title ui-auth2__title'
        }, this.node);
        this.titleNode.innerText = this.targetTitle;

        this.textNode = createElement('p', {
            class: 'ui-desktop__text ui-auth2__text'
        }, this.node);
        this.textNode.innerHTML = this.targetText

        this.formNode = createElement('div', {
            class: 'ui-form ui-form__incolumn'
        }, this.node);

        this.passwordInput = new UIInput({
            errorPlaceholder: 'Invalid Password',
            placeholder: 'Password',
            type: 'password'
        });

        this.nextButton = new UIButton({
            title: 'NEXT'
        });

        [this.passwordInput, this.nextButton].forEach(item => {
            const formRow = UIFormRow(this.formNode);
            formRow.appendChild(item.getNode());
        });
    }
}