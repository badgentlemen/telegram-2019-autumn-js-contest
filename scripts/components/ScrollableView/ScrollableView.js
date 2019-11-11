import { BaseComponent } from "..";
import { createElement } from "../../lib";
import 'simplebar';
import './simple.bar.css';

export default class ScrollableView extends BaseComponent {

    constructor(options) {
        super(options);
        this.node = createElement('div', {'class': this.getClassName()});
        this.node.setAttribute('data-simplebar', '');
    }

    nodeClassName() {
        return 'ui-scrollable-view'
    }
}