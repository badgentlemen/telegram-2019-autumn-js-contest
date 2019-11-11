import { BaseComponent } from "..";
import { createElement } from "../../lib";
import SimpleBar from 'simplebar';
import './simple.bar.css';

export default class ScrollableView extends BaseComponent {

    constructor(options) {
        super(options);
        this.node = createElement('div', {'class': this.getClassName()});
        this.scrollableView = new SimpleBar(this.node);
        this.scrollableView.getScrollElement().addEventListener('scroll', event => {
            this.options.onScroll && this.options.onScroll(event);
        })
        this.node.setAttribute('data-simplebar', '');
    }

    appendChild(element) {
        this.scrollableView.getContentElement().appendChild(element)
    }

    nodeClassName() {
        return 'ui-scrollable-view'
    }
}