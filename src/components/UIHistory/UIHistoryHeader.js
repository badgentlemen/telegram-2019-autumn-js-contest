import { BaseComponent } from "..";
import { createElement } from "../../lib";
export default class UIHistoryHeader extends BaseComponent {
    constructor(options = {}) {
        super(options);
        this.currentDialog = null
        this.node = createElement('div', {'class': 'ui-history__header'});

        if (this.options.currentDialog) {
            this.setCurrentDialog(this.options.currentDialog);
        }

        this.headerWrapper = createElement('div', {
            class: 'ui-history__header-wrapper'
        }, this.node);

    }

    setCurrentDialog(dialog) {
        this.currentDialog = dialog;
    }
}