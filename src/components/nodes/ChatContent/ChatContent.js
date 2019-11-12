import BaseComponent from '../../base.component';
import {
    createElement
} from '../../../lib';
import {
    removeAllChild
} from '../../../utils';
import chatClosedImage from '../../../assets/chat_closed_icon.svg';
import ScrollableView from '../../ScrollableView/ScrollableView';

export default class ChatContent extends BaseComponent {
    constructor(options = {}) {
        super(options);
        this.currentDialog = options.currentDialog || null;
        this.state = options.state || 'history';
        var messages = [];
        var historyClasses = [
            'ui-history__user',
            'ui-history__chat',
            'ui-history__channel'
        ];
        this.node = createElement('div', {
            class: 'ui-chat__content'
        });
        // var header = createElement('div', 'ui-chat__content_header', node);
        // var body = createElement('div', 'ui-chat__content_body', node);
        // var history = createElement('div', 'ui-history', body);
        // var historyContainer = createElement(
        // 	'div',
        // 	'ui-history__container',
        // 	history
        // );
        this.renderMainView();
    }

    renderMainView() {
        removeAllChild(this.node);

        switch (this.state) {
            case 'closed':
                this.renderClosedNode();
                break;
            default:
                this.renderPeerHistoryNode();
                break;
        }
    }

    renderClosedNode() {
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
        this.historyNode = createElement('div', {'class': 'ui-history__node'}, this.node);
        this.historyHeaderNode = createElement('div', {'class': 'ui-history__header'}, this.historyNode);
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

    setCurrentDialog(dialog) {
        this.currentDialog = dialog;
        this.state = 'history';
        this.renderMainView();

        this.updateHeader();
    }

    // this.setCurrentDialog = function(dialog) {
    //     currentDialog = dialog;
    //     historyClasses.forEach(function(className) {
    //         history.classList.remove(className);
    //     });
    //     history.classList.add('ui-history__' + dialog.peerData._);
    //     fetchHistory();
    // };
    // function fetchHistory() {
    //     APIManager.getHistory(currentDialog.peerID).then(function(
    //         response
    //     ) {
    //         messages = response;
    //         renderHistoryWrap();
    //     });
    // }
    // function renderHistoryWrap() {
    //     removeAllChild(historyContainer);
    //     var lastMessageRow;
    //     for (var index = 0; index < messages.length; index++) {
    //         var message = messages[index];
    //         var currentFromId = message.from_id;
    //         var isBallonEffect = true;
    //         var isSameFromId = true;
    //         var isOut = message.pFlags.out;
    //         // if (index < messages.length - 1) {
    //         //     var nextMessage = messages[index + 1];
    //         //     var nextFromId = nextMessage.from_id;
    //         //     isSameFromId = currentFromId !== nextFromId;
    //         // }
    //         // console.log(isSameFromId);
    //         // var messageView = createElement('div', 'ui-message', messageRow);
    //         // messageView.innerHTML = message.message;
    //         if (isOut) {
    //             // messageRow.classList.add('ui-history__row_out');
    //             // messageView.classList.add('ui-message__out');
    //         }
    //         if (!isSameFromId) {
    //         } else {
    //         }
    //     }
    // }
    // function setLoading(loading) {
    //     if (loading) {
    //         if (!loadingNode) {
    //             loadingNode = createElement('div', 'ui-chat-content__loading-flow', node);
    //             createElement('div', 'ui-spinner', loadingNode);
    //         }
    //     } else {
    //         if (loadingNode) {
    //             elementRemoveFromSuperView(loadingNode);
    //             loadingNode = null;
    //         }
    //     }
    // };
    // renderChatClosedNode = function() {
    //     var actions = [{
    //         id: -10001,
    //         title: 'Private',
    //         iconScr: ''
    //     }, {
    //         id: -10002,
    //         title: 'Group',
    //         iconSrc: ''
    //     }, {
    //         id: -10003,
    //         title: 'Channel',
    //         iconSrc: ''
    //     }];
    //     if (body) {
    //         var chatClosedWrapper = createElement('div', 'ui-chat__closed-wrapper', body)
    //         var chatClosedNode = createElement('div', 'ui-chat__closed-node', chatClosedWrapper);
    //         var chatClosedImg = createElement('img', 'ui-chat__closes-image', chatClosedNode);
    //         chatClosedImg.src = '/assets/chat_closed_icon.svg';
    //         var chatClosedTitle = createElement('h2', 'ui-chat__closed-title', chatClosedNode);
    //         chatClosedTitle.innerHTML = 'Open Chat <br/> or create a new one';
    //         var chatClosedActionsNode = createElement('div', 'ui-chat__closed-actions-node', chatClosedNode);
    //         actions.forEach(function(action) {
    //             var actionItemNode = createElement('div', 'ui-actions_group-item', chatClosedActionsNode);
    //         });
    //     }
    // }
}