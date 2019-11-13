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


        this.peerHistories = []
        this.selectedMsgs = {}
        this.selectedCount = 0
        this.historyState = {};
        this.historyState.selectActions = false
        this.historyState.botActions = false
        this.historyState.channelActions = false
        this.historyState.canDelete = false
        this.historyState.canReply = false
        this.historyState.missedCount = 0
        this.historyState.skipped = false
        this.state = {}
    }

    setCurrentDialog(dialog) {
        this.historyNodeBody.setCurrentDialog(dialog);
        this.historyNodeHeader.setCurrentDialog(dialog);
        console.log(dialog);
    }

    getNode() {
        return this.historyNode
    }

    getHeader() {

    }

    getBody() {

    }
}
