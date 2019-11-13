import {
    BaseComponent
} from "../..";
import {
    createElement
} from "../../../lib";
import faveIcon from "../../../assets/fave.png";
import {wrapRichText} from "../../../tl_utils";

export default class UIDialogItem extends BaseComponent {
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
            class: this.getClassName()
        });
        this.node.setAttribute("id", Math.abs(dialog.peerID()));
        this.photoNode = createElement(
            "div", {
                class: "ui-dialog__photo-node"
            },
            this.node
        );

        if (dialog.isOnline && !dialog.peerData.pFlags.self) {
            this.photoNode.classList.add("ui-dialog__online");
        }

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
        this.timeNode = createElement('span', {'class': 'ui-dialog__timestamp'}, this.titleNode);
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

        this.photoNode.setAttribute(
            "peer-initials",
            this.dialog.title.substring(0, 2)
        );

        if (dialog.peerData.pFlags.self) {
            this.setPhotoNodeImage(faveIcon);
            this.photoNode.appendChild(this.photoNodeImage);
        } else if (dialog.peerData.photo && dialog.peerData.photo.photo_small) {
            telegramApi
                .downloadPhoto(dialog.peerData.photo.photo_small)
                .then(data => {
                    const blob = new Blob(data.bytes, {
                        type: data.type
                    });
                    const url = URL.createObjectURL(blob);
                    this.setPhotoNodeImage(url);
                });
        }
    }

    setPhotoNodeImage(imageSrc) {
        if (!this.photoNodeImage) {
            this.photoNodeImage = createElement("img", {
                class: "ui-dialog__photo"
            });
        }
        this.photoNodeImage.src = imageSrc;
        this.photoNode.appendChild(this.photoNodeImage);
    }

    textNodeText() {

        const type = this.dialog.typing ? 'typing' : (!this.dialog.unreadCount && this.dialog.draft ? 'draft' : (this.dialog.deleted ? 'deleted' : 'message'));

        switch (type) {
            case 'typing':
                return 'typing...';
            case 'deleted':
                return '&nbsp;';
            case 'draft':
                return 'draft';
            default:
                const dialogText = createElement('span', {'class': 'ui-dialog__text'});

                let conversation = this.shortConversation();
                if (conversation) {
                    dialogText.appendChild(conversation)
                }
                const dialogMedia = createElement('span', {'class': 'ui-dialog__text-media', 'media-type': this.dialog.message.media ? this.dialog.message.media._ : ''});
                dialogMedia.innerText = this.shortMessageMedia()
                dialogText.appendChild(dialogMedia);

                let text = this.shortMessageText();

                if (text) {

                    const messageNode = createElement('span', {'class': 'ui-dialog__text-message'})
                    messageNode.innerText = text;

                    dialogText.appendChild(messageNode);

                }

                return dialogText;

        }

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
                    conversationNode = this.createConversation('You');
                }
            } else {
                if (this.dialog.pFlags.out && this.dialog.message._ !== 'messageService') {
                    conversationNode = this.createConversation('You');
                } else {
                    const messageFrom = this.dialog.message.messageFrom || {};
                    conversationNode = this.createConversation(messageFrom.first_name || messageFrom.username || '');
                }
            }

            if (conversationNode) {
                dialogConveration.appendChild(conversationNode);
                return dialogConveration;
            }
        }

        return;
    }

    createConversation(from, requiredDot = true) {

        const conversationFromNode = createElement('span', {
            'class': 'ui-dialog__text_conversation_from'
        });
        conversationFromNode.innerText = from;
        if (requiredDot) {
            conversationFromNode.classList.add('ui-dots__vertical_after');
        }

        return conversationFromNode
    }

    shortMessageMedia() {
        const media = this.dialog.message.media || null;

        if (media) {
            const mediaType = media._;

            switch (mediaType) {
                case "messageMediaPhoto":
                    return "Photo";
                case "messageMediaDocument":
                    const documentType = media.document;
                    switch (documentType) {

                        case 'sticker':
                            const attribute = media.document.attributes.find(attribute => attribute._ === 'documentAttributeSticker');
                            if (attribute && attribute.alt) {
                                return attribute.alt;
                            } else {
                                return '';
                            }
                        default:
                            return '';
                    }

                    case "messageMediaGeo":
                        return "Location";
                    case "messageMediaVenue":
                        return "Venue";
                    case "messageMediaContact":
                        return "Contact";
                    case "messageMediaGame":
                        return "🎮";
                    case "messageMediaUnsupported":
                        return "Unsupported attachment";
                    case "messageMediaUnsupportedWeb":
                        return "Unsupported web";
                    default:
                        return '';
            }
        } else {
            return '';
        }
    }
}