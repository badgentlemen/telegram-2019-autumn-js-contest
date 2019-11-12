import BaseComponent from '../base.component';
import { createElement } from '../../lib';
import ScrollableView from '../ScrollableView';
import UIHistoryHeader from './UIHistoryHeader';

export default class UIHistory extends BaseComponent {

    constructor(options = {}) {
        super(options);
        this.historyNode = createElement('div', {'class': 'ui-history__node'}, this.node);
        this.historyNodeHeader = new UIHistoryHeader();

        this.historyNode.appendChild(this.historyNodeHeader.getNode());

        this.historyBodyNode = createElement('div', {'class': 'ui-history__body'}, this.historyNode);

        this.historyBodyScrollable = new ScrollableView({
            className: 'ui-history__body-wrapper'
        });

        this.historyBodyNode.appendChild(this.historyBodyScrollable.getNode());

        this.historyNode.appendChild(this.historyBodyNode);

        this.messageListNode = createElement('div', {
            'style': 'height: 2000px'
        });

        this.historyBodyScrollable.appendChild(this.messageListNode);
    }

    getNode() {
        return this.historyNode
    }
}
