import BaseComponent from "../base.component";
import {createElement} from "../../lib";
import ScrollableView from '../ScrollableView';

export default class UIHistoryBody extends BaseComponent {

    constructor(options) {
        super(options);

        this.currentDialog = this.options.currentDialog || null;

        this.node = createElement('div', {
            class: 'ui-history__body'
        });

        this.historyBodyScrollable = new ScrollableView({
            className: 'ui-history__body-wrapper'
        });

        this.node.appendChild(this.historyBodyScrollable.getNode());
    }


}