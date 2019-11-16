import {createElement} from "../lib";
import {BaseComponent} from "../components";
import SignInNode from "../components/nodes/SignInNode/SignInNode";
import CodeConfirmNode from "../components/nodes/CodeConfirmNode/CodeConfirmNode";
import {removeAllChild, internationalPhoneValue} from "../utils";

export default class LoginPage extends BaseComponent {

    constructor() {
        super();

        this.destroyed = false;
        this.phoneCountry = null;
        this.phoneNumber = null;
        this.phoneCodeHash = null;
        this.confirmCode = null;

        this.signInNode = null;
        this.confirmCodeNode = null;
        this.setPasswordNode = null;

        this.phoneRawValue = null;

        this.node = createElement(
            'div',
            {'class': 'UiLogin_layout__wrapper'},
        );

        this.containerWrapper = createElement(
            'div',
            {'class': 'ui-container'},
            this.node
        );

        this.loginInner = createElement(
            'div',
            {'class': 'UiLogin_layout__container'},
            this.containerWrapper
        );

        this.renderSignInNode();
    }

    destroy() {
		this.destroyed = true;
		removeAllNodes();
	};

	renderSignInNode() {
        this.removeAllNodes();
        const self = this;
        this.signInNode = new SignInNode({
            onNextClicked: (phoneNumber, phoneCountry) => {
                self.phoneRawValue = phoneNumber;
                self.phoneCountry = phoneCountry
                self.phoneNumber = internationalPhoneValue(phoneNumber);
                self.sendCode();
            },
            phoneNumber: this.phoneNumber
        });
        this.loginInner.appendChild(this.signInNode.getNode());
    }

    renderCodeConfirmNode() {
        this.removeAllNodes();
        this.confirmCodeNode = new CodeConfirmNode({
            onMaxLength: code => {
                this.confirmCode = code;
                this.sendNext();
            }
        });

        this.loginInner.appendChild(this.confirmCodeNode.getNode());
    }

	removeAllNodes() {
        removeAllChild(this.loginInner);
        this.signInNode = null;
        this.confirmCodeNode = null;
    }

    checkPhone() {
        let isBadPhone = (this.phoneCountry || '') + (this.phoneNumber || '')
    }

    sendCode() {

        this.signInNode.uibutton.setLoading(true);

        if (this.phoneNumber) {
            // sendCode(this.phoneNumber).then(response => {
            //     if (response.pFlags.phone_registered && response.phone_code_hash) {
            //         this.phoneCodeHash = response.phone_code_hash;
            //         this.renderCodeConfirmNode();
            //     }
            // }).catch(error => {
            //     console.log(error);
            //     alert(error);
            // });

            setTimeout(() => {
                this.renderCodeConfirmNode();
            }, 2000);
        }
    }

    sendNext() {
        if (this.phoneNumber && this.phoneCodeHash && this.confirmCode) {
            // logIn(this.phoneNumber, this.phoneCodeHash, this.confirmCode).then(response => {
            //     return response;
            // });
        }
    }

    logIn() {

    }
}
