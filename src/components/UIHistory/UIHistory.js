import BaseComponent from '../base.component';
import { createElement } from '../../lib';
import UIHistoryHeader from './UIHistoryHeader';
import UIHistoryBody from './UIHistoryBody';

export default class UIHistory extends BaseComponent {

    constructor(options = {}) {
        super(options);

        this.currentDialog = options.currentDialog || null;
        this.historyNode = createElement('div', {'class': 'ui-history__node'}, this.node);
        this.historyNodeHeader = new UIHistoryHeader();
        this.historyNodeBody = new UIHistoryBody({
            currentDialog: this.currentDialog
        });

        this.historyNode.appendChild(this.historyNodeHeader.getNode());
        this.historyNode.appendChild(this.historyNodeBody.getNode());

        // this.messageListNode = createElement('div', {
        //     'style': 'height: 2000px'
        // });

        // this.historyBodyScrollable.appendChild(this.messageListNode);
    }

    getNode() {
        return this.historyNode
    }
}
