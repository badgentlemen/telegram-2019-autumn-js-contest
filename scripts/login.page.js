function LoginPage(layout) {
    layout.classList.add('UiLogin_layout');
    var destroyed = false;

    var loginLayoutWrapper = createElement(layout, 'div', 'UiLogin_layout__wrapper');
    var containerWrapper = createElement(loginLayoutWrapper, 'div', 'ui-container');
    var loginInner = createElement(containerWrapper, 'div', 'UiLogin_layout__container')

    var signInNode = null;
    var codeConfirmNode = null;
    var setPasswordNode = null;

    this.destroy = function() {
        destroyed = true;
        removeAllNodes();
    };

    function renderSignInNode() {
        signInNode = new SignInNode(loginInner);
    }

    function removeAllNodes() {
        removeAllChild(layout);
    }

    renderSignInNode();
}

function SignInNode(parentContainer) {

    var targetTitle = 'Sign in to Telegram';
    var targetText = 'Please confirm your country and <br> enter your phone number';

    var node = createElement(parentContainer, 'div', 'ui-sign-in__node');
    createElement(node, 'div', 'ui-sign-in__logo');
    var title = createElement(node, 'h1', 'ui-sign-in__title ui-text__center');
    title.innerText = targetTitle;

    var text = createElement(node, 'h3', 'ui-sign-in__text ui-text__center');
    text.innerHTML = targetText;

    var form = createElement(node, 'form', 'ui-form ui-form__incolumn ui-form__confirm-country-phone');
    var countrySelector = createElement(form, 'div', 'ui-select ui-sign-in__country-select');
    var phoneNumberInput = new uiInput(form, {}, 'ui-sign-in__phone-number-input');

    phoneNumberInput.setError(null);
    phoneNumberInput.type = 'text';

    this.destroy = function() {
        removeAllChild(parentContainer);
    }

}

function CodeConfirmNode(parentContainer) {
    var node = createElement(parentContainer, 'div', 'ui-login__')
}

function SetPasswordNode(parentContainer) {

}

function UserInfoNode(parentContainer) {

}