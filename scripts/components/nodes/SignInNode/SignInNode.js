import {createElement} from "../../../lib";
import {BaseComponent, UIFormRow} from "../..";
import UIInput from "../../UIInput/UIInput";
import UISelect from "../../UISelect/UISelect";
import UIButton from "../../UIButton/UIButton";

export default class SignInNode extends BaseComponent {
    constructor(options) {
        super(options);
        options = options || {};
        this.phone_code_hash = null;
        this.targetTitle = 'Sign in to Telegram';
        this.targetText = 'Please confirm your country and <br> enter your phone number';
        this.node = createElement('div', {'class': 'ui-sign-in__node'});
        this.renderForm();
    }
    renderForm() {
        // removeAllChild(node);
        createElement('div', {'class': 'ui-sign-in__logo'}, this.node);
        const title = createElement('h1', {'class': 'ui-sign-in__title ui-text__center'}, this.node);
        title.innerText = this.targetTitle;
        const text = createElement('p', {'class': 'ui-sign-in__text ui-text__center'}, this.node);
        text.innerHTML = this.targetText;
        const form = createElement('form', {'class': 'ui-form ui-form__incolumn ui-form__confirm-country-phone'}, this.node);
        var countrySelector = new UISelect({
            placeholder: 'Country',
            class: 'ui-sign-in__country-select'
        });
        var countrySelectFormRow = UIFormRow(form);
        countrySelectFormRow.appendChild(countrySelector.getNode());
        form.appendChild(countrySelectFormRow);
        var phoneNumberInput = new UIInput({
            placeholder: 'Phone Number',
            onChange: value => {
                this.value = value;
            },
            value: '+79604245511',
            class: 'ui-sign-in__phone-number-input'
        });
        var inputFormRow = UIFormRow(form);
        inputFormRow.appendChild(phoneNumberInput.getNode());
        form.appendChild(inputFormRow);
        var uibutton = new UIButton({
            title: 'NEXT',
            onClick: event => {
                ;
                event.preventDefault();
                if (this.options.onNextClicked) {
                    const phoneNumber = phoneNumberInput.getValue();
                    this.options.onNextClicked(phoneNumber);
                }
            }
        });
        form.appendChild(uibutton.getNode());
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
}
