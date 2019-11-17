import BaseComponent from '../../base.component';
import {createElement} from '../../../lib';
import UIInput from '../../UIInput/UIInput';
import {UIFormRow} from '../..';
import UIButton from '../../UIButton/UIButton';

export default class SignUpNode extends BaseComponent {
    constructor(options = {}) {
        super(options);

        this.targetTitle = 'Your Name';
        this.targetText = 'Enter your name and add <br/> a profile picture';

        this.node = createElement('div', {
			class: 'ui-sign-up__node login-page__node'
        });

        this.renderForm();
    }

    renderForm() {
        this.logoNode = createElement('div', {
            class: 'ui-sign-up__logo ui-desktop__logo'
        }, this.node);

        this.titleNode = createElement('h1', {
            class: 'ui-sign-up__title ui-desktop__title'
        }, this.node);
        this.titleNode.innerText = this.targetTitle;

        this.textNode = createElement('p', {
            class: 'ui-sign-up__text ui-desktop__text'
        }, this.node);
        this.textNode.innerHTML = this.targetText;

        this.form = createElement('div', {
            class: 'ui-form ui-form__incolumn'
        }, this.node);

        this.firstNameNode = new UIInput({
            placeholder: 'Name',
            requireValid: true,
            minLength: 3
        });

        this.nextButtonNode = new UIButton({
            title: 'START MESSAGING',
            onClick: () => {
                const firstName = this.firstNameNode.getValue();
                const lastName = this.lastNameNode.getValue() || '';
                this.options.onNextClicked && this.options.onNextClicked(firstName, lastName);
            }
        });

        this.lastNameNode = new UIInput({
            placeholder: 'Last Name (optional)'
        });

        [this.firstNameNode, this.lastNameNode, this.nextButtonNode].forEach(component => {
            const formRow = UIFormRow(this.form);
            formRow.appendChild(component.getNode());
        });
    }
}