import { BaseComponent } from "../..";
import { createElement } from "../../../lib";

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
        }

        return classList.join(" ");
    }

    constructor(dialog = {}) {
        super({});
        this.dialog = dialog;
        const peerData = dialog.peerData || {};
        this.node = createElement("div", { class: this.getClassName() });
        this.node.setAttribute("id", Math.abs(dialog.peerID()));
        this.photoNode = createElement(
            "div",
            { class: "ui-dialog__photo-node" },
            this.node
        );

        if (dialog.isOnline && !dialog.peerData.pFlags.self) {
            this.photoNode.classList.add("ui-dialog__online");
        }

        this.messageWrapper = createElement(
            "div",
            { class: "ui-dialog__wrapper" },
            this.node
        );
        this.titleNode = createElement(
            "div",
            { class: "ui-dialog__title" },
            this.messageWrapper
        );
        this.titleTextNode = createElement(
            "span",
            { class: "ui-dialog__title-text" },
            this.titleNode
        );

        this.titleTextNode.innerText = dialog.title;
        // var timeNode = createElement('span', 'ui-dialog__timestamp', titleNode);
        // timeNode.innerText = dialog.dateText || '';
        this.messageNode = createElement(
            "div",
            { class: "ui-dialog__message" },
            this.messageWrapper
        );
        this.textNode = createElement(
            "div",
            { class: "ui-dialog__text" },
            this.messageNode
        );
        this.textNode.innerHTML = (dialog.message.message || "").substring(
            0,
            128
        );

        if (dialog.isPinned) {
            createElement(
                "div",
                { class: "ui-badge ui-badge__pinned" },
                this.messageNode
            );
        }

        if (dialog.hasUnread()) {
            const badge = createElement(
                "div",
                { class: "ui-badge ui-badge__unread" },
                this.messageNode
            );

            badge.setAttribute("unread-count", dialog.unreadCount);

            if (dialog.isMuted) {
                badge.classList.add("ui-badge__unread__muted");
            }
        }
        // if ((dialog.unreadCount > 0 && !dialog.pFlags.out) || dialog.pinned) {
        // 	var badge = createElement(
        // 		'div',
        // 		'ui-badge ui-badge__unread',
        // 		messageNode
        // 	);
        // 	badge.setAttribute('unread-count', dialog.unreadCount);
        // 	chatListItem.classList.add('ui-dialog__unread');
        // 	if (isPeerMuted(dialog.peerID)) {
        // 		badge.classList.add('ui-badge__unread__muted');
        // 		chatListItem.classList.add('ui-dialog__muted');
        // 	}
        // }
        if (dialog.peerData.pFlags.self) {
            this.setPhotoNodeImage("/assets/fave.png")
            this.photoNode.appendChild(this.photoNodeImage)
        } else if (dialog.peerData.photo) {
            telegramApi
                .downloadPhoto(dialog.peerData.photo.photo_small)
                .then(data => {
                    const blob = new Blob(data.bytes, { type: data.type });
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
}
