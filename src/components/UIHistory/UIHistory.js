import BaseComponent from '../base.component';
import { createElement } from '../../lib';
import ScrollableView from '../ScrollableView';
import PeerPhoto from '../nodes/PeerPhoto';
import {safeReplaceObject, removeAllChild} from '../../utils';
import MessagesManagerInstance from '../../lib/messages.manager';
import {getPeerData} from '../../tl_utils';

export default class UIHistory extends BaseComponent {
	constructor(options = {}) {
		super(options);

		this.peerHistories = [];
		this.selectedMsgs = {};
		this.selectedCount = 0;
		this.historyState = {
            selectActions: false,
            botActions: false,
            channelActions: false,
            canDelete: false,
            canReply: false,
            missedCount: 0,
            skipped: false,
        };

		this.state = {};

		this.peerID = null;
		this.peerHistory = {

        };
		this.unreadAfterIdle = false;
		this.hasMore = false;
		this.hasLess = false;
		this.maxID = 0;
		this.minID = 0;
		this.lastSelectID = false;
		this.inputMediaFilters = {
			photos: 'inputMessagesFilterPhotos',
			video: 'inputMessagesFilterVideo',
			documents: 'inputMessagesFilterDocument',
			audio: 'inputMessagesFilterVoice',
			round: 'inputMessagesFilterRoundVideo',
			music: 'inputMessagesFilterMusic',
			urls: 'inputMessagesFilterUrl',
			mentions: 'inputMessagesFilterMyMentions'
		};
		this.jump = 0;
		this.moreJump = 0;
		this.moreActive = false;
		this.morePending = false;
		this.lessJump = 0;
		this.lessActive = false;
		this.lessPending = false;

		this.currentDialog = options.currentDialog || null;
		this.node = createElement(
			'div',
			{ class: 'ui-history__node' },
        );

        this.historyNodeHeader = null;
        this.historyNodeBody = null;

        this.renderMainView();
    }

    renderMainView() {
        this.renderHeader();
        this.renderBody();
		this.node.appendChild(this.historyNodeHeader);
		this.node.appendChild(this.historyNodeBody);
    }

    renderHeader() {
        this.historyNodeHeader = createElement('div', {
			class: 'ui-history__header'
		});

        this.historyNodeHeaderTitleWrapper = createElement('div', {
            class: 'ui-peer__title-wrapper'
        }, this.historyNodeHeader)

        this.peerPhotoNode = new PeerPhoto();
        this.historyNodeHeaderTitleWrapper.appendChild(this.peerPhotoNode.getNode());

        this.peerInfoNode = createElement('div', {
            class: 'ui-peer-info'
        }, this.historyNodeHeaderTitleWrapper);

        this.peerAdditionalsNode = createElement('div', {
            class: 'ui-peer-additionals'
        });

        this.historyNodeHeader.appendChild(this.peerAdditionalsNode);
    }

    renderBody() {
        this.historyNodeBody = createElement('div', {
			class: 'ui-history__body'
		});
		this.historyBodyScrollable = new ScrollableView({
			className: 'ui-history__body-scrollable'
        });
        this.historyNodeBodyNode = this.historyBodyScrollable.getNode();
        this.historyNodeBody.appendChild(this.historyNodeBodyNode);

        const bodyNodeContent = createElement('div', {
            class: 'ui-history__content'
        }, this.historyBodyScrollable.getContentNode());

        this.bodyNodeContainer = createElement('div', {
            class: 'ui-history__container'
        });

        bodyNodeContent.appendChild(this.bodyNodeContainer)
    }

    cleanBodyContent() {
        removeAllChild(this.bodyNodeContainer);
    }

    renderPeerHistory() {

        const self = this;
        this.cleanBodyContent();

        const messages = this.peerHistory.messages;

        let lastRow = null;
        let lastGrouped = null;

        for (let index = 0; index < messages.length; index++) {
            const message = messages[index];

            const isOut = message.pFlags.out || false;

            let historyRow = this.renderHistoryRow(message);

            const messageNode = this.renderMessageNode(message);

            if (index > 0) {
                const prevMessageFromID = messages[index - 1].messageFrom.id;
                const fromID = message.messageFrom.id;

                if (prevMessageFromID === fromID) {
                    if (!lastRow) {
                        lastRow = historyRow;
                    }

                    lastRow.appendChild(messageNode);
                } else {
                    appendInline();
                }
            } else {
               appendInline()
            }

            function appendInline() {
                lastRow = historyRow;
                messageNode.style.background = 'yellow';
                historyRow.appendChild(messageNode);
                self.bodyNodeContainer.appendChild(historyRow);
            }
        }
    }

    renderHistoryRow(message) {
        return createElement('div', {
            class: `ui-history__row${message.pFlags.out ? ' ui-history__row_out' : ''}`,
            'from-id': (message.messageFrom || {}).id || 0
        });
    }

    renderMessageNode(message) {
        const isOut = message.pFlags.out || false;

        const messageNode = createElement('div', {
            class: `ui-message${isOut ? ' ui-message__out' : ''}`
        });

        return messageNode;
    }

	setCurrentDialog(dialog) {
        console.log(dialog);
        this.applyDialogSelect(dialog);
	}

	applyDialogSelect(newDialog) {

        this.peerID = newDialog.peerID();

		if (this.currentDialog === newDialog) {
            this.messageFocusHistory();
		} else {
            this.currentDialog = newDialog;

            this.updateHistoryPeer(true);
            this.loadHistory();
        }

	}

	showEmptyHistory() {
        this.incrementJump();
        this.peerHistory = false;
        this.hasMore = false;
    }

    incrementJump(replace = false) {
        const newJump = this.jump + 1;
        if (replace) {
            this.jump = newJump;
        }
        return newJump;
    }

    // HISTORY METHODS

	messageFocusHistory() {
        let history = this.historiesQueueFind(this.peerID);

        if (history) {

        } else {
            this.loadHistory();
        }
    }

    createPeerHistory(peerID = 0) {
        return { peerID, messages: [], ids: [] };
    }

    historiesQueueFind(peerID) {
        return this.peerHistories.find(history => history.peerID === peerID) || false;
    }

    historiesQueuePush(peerID) {
        let position = -1;
        let maxLength = 10;
        let i, history, diff;

        for (let index = 0; index < this.peerHistories.length; index++) {
            const history = this.peerHistories[index];

            if (history.peerID === peerID) {
                position = index;
                break;
            }
        }

        if (position > -1) {
            history = this.peerHistories[position];
            return history
        }

        history = this.createPeerHistory(peerID);
        this.peerHistories.unshift(history);
        diff = this.peerHistories.length - maxLength;

        if (diff > 0) {
            this.peerHistories.splice(maxLength - 1, diff);
        }

        return history;
    }

    updateHistoryPeer(preload = false) {
        const peerData = getPeerData(this.peerID);

        if (!peerData || peerData.deleted) {
            this.state.loaded = false;
            return false;
        }

        this.peerHistory = this.historiesQueuePush(this.peerID);

        this.historyPeer = {
            id: this.peerID,
            data: this.currentDialog.peerData
        };

        if (preload) {
            (this.historyState.typing || []).splice(0, (this.historyState.typing || []).length);
        }
    }

    loadHistory(forceRecent = true) {
        this.historyState.missedCount = 0;
        this.historyState.skipped = this.hasLess = false;
        this.hasMore = false;

        this.maxID = 0;
        this.minID = 0;

        this.peerHistory = this.historiesQueuePush(this.peerID);

        let limit = 10;
        let backLimit = 0;


        if (this.currentDialog.messageID) {
            this.maxID = parseInt(this.currentDialog.messageID);
            limit = 15;
            backLimit = limit;
        } else if (forceRecent) {
            limit = 20;
        }

        this.state.moreActive = this.moreActive = false;
        this.morePending = false;
        this.state.lessActive = this.lessActive = false;
        this.lessPending = false;

        let prerenderedLen = this.peerHistory.messages.length;

        if (prerenderedLen && (this.maxID && backLimit)) {
            prerenderedLen = 0;
            this.peerHistory.messages = [];
            this.state.empty = true;
        }
        let currentJump = this.incrementJump()
        let getMessagesPromise = this.getHistory(this.maxID, limit, backLimit, prerenderedLen);
        this.state.maybeHasMore = true;

        getMessagesPromise.then(historyResult => {
            let fetchedLength = historyResult.history.length;

            this.minID = (historyResult.unreadSkip || (this.maxID && historyResult.history.indexOf(this.maxID) >= backLimit - 1))
                        ? historyResult.history[0]
                        : 0;

            this.maxID = historyResult.history[historyResult.history.length - 1];


            this.state.skipped = this.hasLess = this.minID > 0;
            this.hasMore = historyResult.missedCount === null || (fetchedLength && fetchedLength < historyResult.count)
            this.updateHistoryPeer();

            safeReplaceObject(this.state, {
                loaded: true,
                empty: !fetchedLength
            });

            this.peerHistory.messages = [];
            this.peerHistory.ids = [];

            historyResult.history.forEach(id => {
                let message = MessagesManagerInstance.wrapForHistory(id);
                if (this.historyState.skipped) {
                    delete message.pFlags.unread;
                }

                if (historyResult.unreadOffset) {
                    message.unreadAfter = true;
                }

                this.peerHistory.messages.push(message);
                this.peerHistory.ids.push(id);
            })

            this.peerHistory.messages.reverse();
            this.peerHistory.ids.reverse();


            this.renderPeerHistory();

        }).catch(error => {

            safeReplaceObject(this.state, {
                error,
                loaded: true
            });

        })
    }

    getHistory(maxID, limit, backLimit, prerenderedLen) {
        return MessagesManagerInstance.getHistory(this.currentDialog.peerID(), maxID, limit, backLimit, prerenderedLen);
    }

    fetchSearchHistory() {

    }

    toggleMessage() {

    }


    // CHANNEL/SUPERGROUP/CHAT METHODS

    joinChannel() {

    }

    togglePeerMuted() {

    }
}
