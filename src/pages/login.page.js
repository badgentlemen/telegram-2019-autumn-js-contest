import {createElement} from "../lib";
import {BaseComponent} from "../components";
import SignInNode from "../components/nodes/SignInNode/SignInNode";
import CodeConfirmNode from "../components/nodes/CodeConfirmNode/CodeConfirmNode";
import {removeAllChild, internationalPhoneValue} from "../utils";
import Auth2Node from "../components/nodes/Auth2Node";

var NODE_STATES = {
    SIGN_IN: 'SIGN_IN',
    CODE_CONFIRM: 'CODE_CONFIRM',
    AUTH2: 'AUTH2'
}

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
        this.auth2Node = null;

        this.phoneRawValue = null;

        this.state = NODE_STATES.AUTH2;

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

        this.renderCandidateNode();
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
                console.log(code);
                this.confirmCode = code;
                this.confirmSMSCode();
            }
        });

        this.loginInner.appendChild(this.confirmCodeNode.getNode());
    }

    renderAuth2Node() {
        this.removeAllNodes();

        this.auth2Node = new Auth2Node({

        });

        this.loginInner.appendChild(this.auth2Node.getNode());
    }

    renderCandidateNode() {
        switch (this.state) {
            case NODE_STATES.CODE_CONFIRM:
                this.renderCodeConfirmNode();
                break;
            case NODE_STATES.AUTH2:
                this.renderAuth2Node();
                break;
            default:
                this.renderSignInNode();
                break;
        }
    }

	removeAllNodes() {
        removeAllChild(this.loginInner);
        this.signInNode = null;
        this.confirmCodeNode = null;
        this.auth2Node = null;
    }

    checkPhone() {
        let isBadPhone = (this.phoneCountry || '') + (this.phoneNumber || '')
    }

    changeState(state) {
        this.state = state;
        this.renderCandidateNode();
    }

    sendCode() {

        this.signInNode.sendCodeButton.setLoading(true);

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
                this.changeState(NODE_STATES.CODE_CONFIRM);
            }, 3000);
        }
    }

    confirmSMSCode() {
        if (this.phoneNumber && this.phoneCodeHash && this.confirmCode) {
            // logIn(this.phoneNumber, this.phoneCodeHash, this.confirmCode).then(response => {
            //     return response;
            // });


        }

        setTimeout(() => {
            this.changeState(NODE_STATES.AUTH2);
        }, 1000)
    }

    logIn() {

    }
}
