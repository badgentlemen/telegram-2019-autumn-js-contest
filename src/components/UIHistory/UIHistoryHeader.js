import { BaseComponent } from "..";
import { createElement } from "../../lib";
export default class UIHistoryHeader extends BaseComponent {
    constructor(options = {}) {
        super(options);
        this.node = createElement('div', {'class': 'ui-history__header'});
    }
}