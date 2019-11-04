function LoginPage(container) {

    var destroyed = false;
    var loginLayout = createElement(container, 'div', 'UiLogin__layout');

    var signInNode = null;
    var codeConfirmNode = null;
    var setPasswordNode = null;

    this.destroy = function() {
        destroyed = true;
        removeAllChild();
    };

    function renderSignInNode() {
        signInNode = new SignInNode(loginLayout);
    }

    function removeAllChild() {
        removeAllChild(loginLayout)
    }

    renderSignInNode();
}

function SignInNode(parentContainer) {
    var node = createElement(parentContainer, 'div', 'ui-login__sign-in-node');
}

function CodeConfirmNode(parentContainer) {

}

function SetPasswordNode(parentContainer) {

}

function UserInfoNode(parentContainer) {

}