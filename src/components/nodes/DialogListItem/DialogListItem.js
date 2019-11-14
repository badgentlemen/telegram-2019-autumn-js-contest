import {
    BaseComponent
} from "../..";
import {
    createElement
} from "../../../lib";
import faveIcon from "../../../assets/fave.png";
import {wrapRichText, ConversationType, isChannel} from "../../../tl_utils";
import {downloadPhoto} from "../../../lib/api.manager";
import PeerPhoto from "../PeerPhoto";

export default class DialogListItem extends BaseComponent {
    nodeClassName() {
        return "ui-dialog";
    }

    getClassName() {
        let classList = ["ui-dialog"];

        if (this.dialog) {
            if (this.dialog.type) {
                classList.push(`ui-dialog__${this.dialog.type}`);
            }

            if (this.dialog.isPinned) {
                classList.push("ui-dialog__pinned");
            }

            if (this.dialog.isMuted) {
                classList.push("ui-dialog__muted");
            }

            if (this.dialog.hasUnread()) {
                classList.push("ui-dialog__unread");
            }

            if (this.dialog.hasUnreadMentions()) {
                classList.push('ui-dialog__unread_mentions');
            }
        }

        return classList.join(" ");
    }

    constructor(dialog = {}) {
        super({});
        this.dialog = dialog;
        const peerData = dialog.peerData || {};
        this.node = createElement("div", {
            class: this.getClassName(),
            id: Math.abs(dialog.peerID())
        });

        this.photoNode = new PeerPhoto({
            'num': peerData.num,
            'peer-initials': this.dialog.title.substring(0, 2),
            'online': this.dialog.isOnline && !this.dialog.peerData.pFlags.self
        });

        this.node.appendChild(this.photoNode.getNode());

        this.messageWrapper = createElement(
            "div", {
                class: "ui-dialog__wrapper"
            },
            this.node
        );
        this.titleNode = createElement(
            "div", {
                class: "ui-dialog__title"
            },
            this.messageWrapper
        );
        this.titleTextNode = createElement(
            "span", {
                class: "ui-dialog__title-text"
            },
            this.titleNode
        );

        this.titleTextNode.innerText = dialog.title;

        const titleAdditionalsNode = createElement('span', {
            class: 'ui-dialog__title_additionals'
        }, this.titleNode)

        if (this.dialog.message.pFlags.out) {
            const messageUnread = this.dialog.isMessageUnread();
            const messageStatusNode = createElement('span', {
                class: `ui-dialog__message-status ui-dialog__message-status-${messageUnread ? 'unread' : 'read'}`
            });

            titleAdditionalsNode.appendChild(messageStatusNode);
        }

        this.timeNode = createElement('span', {'class': 'ui-dialog__timestamp'});
        titleAdditionalsNode.appendChild(this.timeNode)

        this.timeNode.innerText = dialog.message.dateText || '';
        this.messageNode = createElement(
            "div", {
                class: "ui-dialog__message"
            },
            this.messageWrapper
        );

        this.messageNode.appendChild(this.textNodeText());

        const textAdditionalsNode = createElement('span', {
            'class': 'ui-dialog__text_additionals'
        }, this.messageNode);

        if (dialog.isPinned) {
            createElement(
                "div", {
                    class: "ui-badge ui-badge__pinned"
                },
                textAdditionalsNode
            );
        }

        if (dialog.hasUnreadMentions()) {
            const menthionsBadge = createElement('div', {
                'class': 'ui-badge ui-badge__unread__mentions'
            }, textAdditionalsNode);
        }

        if (dialog.hasUnread()) {
            const badge = createElement(
                "div", {
                    class: "ui-badge ui-badge__unread"
                },
                textAdditionalsNode
            );

            badge.setAttribute("unread-count", dialog.unreadCount);

            if (dialog.isMuted) {
                badge.classList.add("ui-badge__unread__muted");
            }
        }

        if (dialog.peerData.pFlags.self) {
            this.photoNode.setImageSrc(faveIcon);
        } else if (dialog.peerData.photo && dialog.peerData.photo.photo_small) {
            downloadPhoto(dialog.peerData.photo.photo_small).then(url => {
                this.photoNode.setImageSrc(url);
            });
        }
    }

    textNodeText() {
        const message = this.dialog.message || {};
        const type = message.action && message.action._ === 'messageActionCustomAction' ? 'actionMessage' : ( this.dialog.typing ? 'typing' : (!this.dialog.unreadCount && this.dialog.draft ? 'draft' : (this.dialog.deleted ? 'deleted' : 'message')));

        const dialogText = createElement('span', {'class': 'ui-dialog__text'});

        switch (type) {
            case 'actionMessage':
                dialogText.innerText = message.action.message || '';
                break;
            case 'typing':
                dialogText.innerText = 'typing...';
                break;
            case 'deleted':
                dialogText.innerText = '&nbsp;';
                break;
            case 'draft':
                dialogText.innerText = 'draft';
                break;
            default:
                let conversation = this.shortConversation();
                if (conversation) {
                    dialogText.appendChild(conversation)
                }

                let mediaMessage = this.shortMessageMedia();

                if (mediaMessage) {
                    const dialogMedia = createElement('span', {'class': 'ui-dialog__text-media', 'media-type': this.dialog.message.media ? this.dialog.message.media._ : ''});
                    dialogMedia.innerText = mediaMessage;
                    dialogText.appendChild(dialogMedia);
                }

                let text = this.shortMessageText();

                if (text) {
                    const messageNode = createElement('span', {'class': 'ui-dialog__text-message'})
                    messageNode.innerText = text;

                    dialogText.appendChild(messageNode);
                }
            break;
        }

        return dialogText;
    }

    shortMessageText() {
        const messageObject = this.dialog.message || {};
        if (messageObject.message && messageObject.message.length && (!messageObject.media || messageObject.media._ === 'messageMediaWebPage')) {
            return wrapRichText(messageObject.message)
        }

        return null;
    }

    shortConversation() {
        const dialogConveration = createElement('span', {'class': 'ui-dialog__text_conversation'});
        const conversation = this.dialog.peerID() > 0 || this.dialog.fromID < 0;
        if (this.dialog.fromID > 0) {

            let conversationNode = null

            if (conversation) {

                if (this.dialog.message.pFlags.out && this.dialog.fromID > 0) {
                    conversationNode = this.createConversationNode('You');
                }
            } else {
                if (this.dialog.message.pFlags.out && this.dialog.message._ !== 'messageService') {
                    conversationNode = this.createConversationNode('You');
                } else {
                    const messageFrom = this.dialog.message.messageFrom || {};
                    conversationNode = this.createConversationNode(messageFrom.first_name || messageFrom.username || '');
                }
            }

            if (conversationNode) {
                dialogConveration.appendChild(conversationNode);
                return dialogConveration;
            }
        }

        return;
    }

    createConversationNode(from, requireDot = true) {

        const conversationFromNode = createElement('span', {
            'class': 'ui-dialog__text_conversation_from'
        });
        conversationFromNode.innerText = from;
        if (requireDot) {
            conversationFromNode.classList.add('ui-dots__vertical_after');
        }

        return conversationFromNode
    }

    shortMessageMedia() {
        const media = this.dialog.message.media || null;

        if(!media) {
            return null;
        }
        const mediaType = media._;

        switch (mediaType) {
            case "messageMediaPhoto":
                return ConversationType.conversation_media_photo;
            case "messageMediaDocument":
                const documentType = media.document.type;
                switch (documentType) {
                    case 'sticker':
                        return `${ConversationType.conversation_media_sticker} ${media.document.stickerEmoji}`;
                    case 'gif':
                        return ConversationType.conversation_media_gif;
                    case 'round':
                        return ConversationType.conversation_media_round;
                    case 'audio':
                    case 'voice':
                        return ConversationType.conversation_media_audio;
                    case 'video':
                        return ConversationType.conversation_media_video
                    default:
                        return media.document.fileName || '';
                }

            case "messageMediaGeo",
                "messageMediaVenue":
                return ConversationType.conversation_media_location;
            case "messageMediaContact":
                return ConversationType.conversation_media_contact;
            case "messageMediaGame":
                return ConversationType.conversation_media_game;
            case "messageMediaUnsupported":
            case "messageMediaUnsupportedWeb":
                return ConversationType.conversation_media_unsupported;
            default:
                return '';
        }
    }
}