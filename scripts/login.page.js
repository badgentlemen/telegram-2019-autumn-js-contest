function LoginPage(layout) {
	layout.classList.add('UiLogin_layout');
	var destroyed = false;

	var loginLayoutWrapper = createElement(
		'div',
        'UiLogin_layout__wrapper',
        layout
    );

	var containerWrapper = createElement(
		'div',
        'ui-container',
        loginLayoutWrapper
    );

	var loginInner = createElement(
		'div',
        'UiLogin_layout__container',
        containerWrapper
	);

	var signInNode = null;
	var codeConfirmNode = null;
    var setPasswordNode = null;

	this.destroy = function() {
		destroyed = true;
		removeAllNodes();
	};

	function renderSignInNode() {
        var signInNode = new SignInNode();
        loginInner.appendChild(signInNode.getNode());
	}

	function removeAllNodes() {
		removeAllChild(layout);
	}

	renderSignInNode();
}

function SignInNode(options) {
    options = options || {};

    var phone_code_hash = null;

    APIManager.sendCode('+79604245511').then(function(data) {
        phone_code_hash = data.phone_code_hash;
    })

    var targetTitle = 'Sign in to Telegram';
	var targetText =
		'Please confirm your country and <br> enter your phone number';

	var node = createElement('div', 'ui-sign-in__node');

	function renderForm() {

        removeAllChild(node);

		createElement('div', 'ui-sign-in__logo', node);
		var title = createElement(
			'h1',
            'ui-sign-in__title ui-text__center',
            node
		);
		title.innerText = targetTitle;

		var text = createElement(
			'p',
            'ui-sign-in__text ui-text__center',
            node
		);
		text.innerHTML = targetText;

		var form = createElement(
			'form',
            'ui-form ui-form__incolumn ui-form__confirm-country-phone',
            node
        );

		var countrySelector = new uiSelect(
			{
				placeholder: 'Phone Number',
			},
            'ui-sign-in__country-select',
            new uiFormRow(form)
        );

		var phoneNumberInput = new uiInput(
			{
                placeholder: 'Phone Number',
                onChange: function(value) {
                    console.log(value);
                }
			},
            'ui-sign-in__phone-number-input',
            new uiFormRow(form),
        );

        var checkbox = new uiCheckbox({

        }, 'ui-sign-in__keep-state', new uiFormRow(form));

        var button = createElement('button', 'ui-button', new uiFormRow(form));
        button.innerText = 'NEXT';
        button.addEventListener('click', function(event) {
            event.preventDefault();
            var code = phoneNumberInput.getValue();
            APIManager.signIn('+79604245511', phone_code_hash, code).then(function(data) {
                console.log(data);
            })
        });

        phoneNumberInput.setError(null);
	    phoneNumberInput.type = 'text';
	}

	this.destroy = function() {
		removeAllChild(parentContainer);
    };

    this.getNode = function() {
        return node;
    }

    renderForm();
}

function CodeConfirmNode(parentContainer) {
	var node = createElement(parentContainer, 'div', 'ui-login__');
}

function SetPasswordNode(parentContainer) {}

function UserInfoNode(parentContainer) {}
