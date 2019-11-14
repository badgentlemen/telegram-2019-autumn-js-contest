import BaseComponent from '../../base.component';
import {
    createElement
} from '../../../lib';
import {
    removeAllChild
} from '../../../utils';
import chatClosedImage from '../../../assets/chat_closed_icon.svg';
import ScrollableView from '../../ScrollableView';
import UIHistory from '../../UIHistory/UIHistory';

export default class ChatContent extends BaseComponent {
    constructor(options = {}) {
        super(options);

        this.historyNode = null;

        this.currentDialog = options.currentDialog || null;
        this.state = !this.currentDialog ? 'closed' : 'history';
        var messages = [];
        this.node = createElement('div', {
            class: 'ui-chat__content'
        });
        this.renderLayoutSubviews();
    }

    renderLayoutSubviews() {
        switch (this.state) {
            case 'closed':
                this.renderClosedNode();
                break;
            default:
                this.renderPeerHistoryNode({
                    currentDialog: this.currentDialog
                });
                break;
        }
    }

    renderClosedNode() {
        removeAllChild(this.node);
        const self = this;
        var actions = [{
                id: -10001,
                title: 'Private',
                class: 'ui-action__private'
            },
            {
                id: -10002,
                title: 'Group',
                class: 'ui-action__group'
            },
            {
                id: -10003,
                title: 'Channel',
                class: 'ui-action__channel'
            }
        ];
        this.chatClosedWrapper = createElement(
            'div', {
                'class': 'ui-chat__closed-wrapper'
            },
            this.node
        );
        this.chatClosedNode = createElement(
            'div', {
                'class': 'ui-chat__closed-node'
            },
            this.chatClosedWrapper
        );
        this.chatClosedImg = createElement(
            'img', {
                'class': 'ui-chat__closes-image'
            },
            this.chatClosedNode
        );
        this.chatClosedImg.src = chatClosedImage;
        this.chatClosedImg.setAttribute('height', '137')
        this.chatClosedTitle = createElement(
            'h2', {
                'class': 'ui-chat__closed-title'
            },
            this.chatClosedNode
        );
        this.chatClosedTitle.innerHTML = 'Open Chat <br/> or create a new one';
        this.chatClosedActionsNode = createElement(
            'div', {
                'class': 'ui-chat__closed-actions-node'
            },
            this.chatClosedNode
        );

        actions.forEach(function (action) {
            const actionItemNode = createElement(
                'div', {
                    'class': `ui-actions_group-item ${action.class}`
                },
                self.chatClosedActionsNode
            );

            const actionItemIconNode = createElement('div', {'class': 'ui-action__icon'}, actionItemNode);
            const actionItemTitleNode = createElement('div', {'class': 'ui-action__title'}, actionItemNode);
            actionItemTitleNode.innerText = action.title;
        });
    }

    renderPeerHistoryNode() {
        if (this.historyNode == null) {
            this.historyNode = new UIHistory({
                dialog: this.currentDialog
            });
            removeAllChild(this.node);
            this.node.appendChild(this.historyNode.getNode());
        }
    }

    setCurrentDialog(dialog) {
        this.currentDialog = dialog;
        this.state = 'history';
        this.renderLayoutSubviews();
        this.historyNode.setCurrentDialog(dialog);
    }
}