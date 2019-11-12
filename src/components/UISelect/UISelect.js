import {BaseComponent} from "..";
import {createElement} from "../../lib";

export default class UISelect extends BaseComponent {

    constructor(options = {}) {
        super(options);
        this.node = createElement('div', {'class': this.getClassName()});
    }

    nodeClassName() {
        return 'ui-select';
    }
}