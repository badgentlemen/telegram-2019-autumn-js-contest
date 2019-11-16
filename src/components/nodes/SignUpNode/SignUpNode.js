import BaseComponent from '../../base.component';

export default class SignUpNode extends BaseComponent {
    constructor(options = {}) {
        super(options);

        this.targetTitle = 'Your Name';
        this.targetText = 'Enter your name and add <br/> a profile picture';

        // this.node = createElement('div', {
		// 	class: 'ui-sign-up__node login-page__node'
		// });
    }
}