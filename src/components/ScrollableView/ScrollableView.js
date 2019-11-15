import { BaseComponent } from "..";
import { createElement } from "../../lib";
import SimpleBar from 'simplebar';
import './simple.bar.css';
import {removeAllChild} from "../../utils";

export default class ScrollableView extends BaseComponent {

    constructor(options) {
        super(options);
        this.node = createElement('div', {'class': this.getClassName(), style: 'height: 100%'});
        this.scrollableView = new SimpleBar(this.node);
        this.scrollableView.getScrollElement().addEventListener('scroll', event => {
            this.options.onScroll && this.options.onScroll(event);
        })
        this.node.setAttribute('data-simplebar', '');
        this.contentNode = this.scrollableView.getContentElement();
    }

    getContentNode() {
        return this.contentNode;
    }

    appendChild(element) {
        this.contentNode.appendChild(element);
        this.scrollableView.recalculate();
    }

    removeSubviews() {
        removeAllChild(this.contentNode);
    }

    nodeClassName() {
        return 'ui-scrollable-view'
    }
}