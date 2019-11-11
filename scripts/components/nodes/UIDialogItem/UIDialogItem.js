import {BaseComponent} from "../..";
import {createElement} from "../../../lib";

export default class UIDialogItem extends BaseComponent {

    nodeClassName() {
        return 'ui-dialog';
    }

    getClassName() {
        let classList = ['ui-dialog'];

        if (this.dialog) {
            if (this.dialog.type) {
                classList.push(`ui-dialog__${this.dialog.type}`)
            }

            if (this.dialog.isPinned) {
                classList.push('ui-dialog__pinned');
            }

            if (this.dialog.hasUnread) {
                classList.push('ui-dialog__unread');
            }
        }

        return classList.join(' ');
    }

    constructor(dialog = {}) {
        super({})
        this.dialog = dialog;
		this.node = createElement('li', {'class': this.getClassName()});
		// chatListItem.classList.add('ui-dialog__' + dialog.type);
		// if (dialog.pFlags.pinned) {
		// 	chatListItem.classList.add('ui-dialog__pinned');
		// }
		// chatListItem.setAttribute('id', Math.abs(dialog.peerID));
		// var photoNode = createElement(
		// 	'div',
		// 	'ui-dialog__photo-node',
		// 	chatListItem
		// );
		// var messageWrapper = createElement(
		// 	'div',
		// 	'ui-dialog__wrapper',
		// 	chatListItem
		// );
		// var titleNode = createElement(
		// 	'div',
		// 	'ui-dialog__title',
		// 	messageWrapper
		// );
		// var titleTextNode = createElement(
		// 	'span',
		// 	'ui-dialog__title-text',
		// 	titleNode
		// );
		// var peerData = dialog.peerData || {};
		// titleTextNode.innerText = dialog.title;
		// var timeNode = createElement('span', 'ui-dialog__timestamp', titleNode);
		// timeNode.innerText = dialog.dateText || '';
		// var messageNode = createElement(
		// 	'div',
		// 	'ui-dialog__message',
		// 	messageWrapper
		// );
		// var textNode = createElement('div', 'ui-dialog__text', messageNode);
		// textNode.innerHTML = (dialog.message.message || '').substring(0, 128);
		// if (dialog.isOnline && !dialog.peerData.pFlags.self) {
		// 	photoNode.classList.add('ui-dialog__online');
		// }
		// var pinnedBadge = null;
		// if (dialog.pFlags.pinned) {
		// 	pinnedBadge = createElement(
		// 		'div',
		// 		'ui-badge ui-badge__pinned',
		// 		messageNode
		// 	);
		// }
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
		// var photoNodeImage = createElement(
		// 	'img',
		// 	'ui-dialog__photo',
		// 	photoNode
		// );
		// if (dialog.peerData.pFlags.self) {
		// 	photoNodeImage.src = '/assets/fave.png';
		// } else if (dialog.peerData.photo) {
		// 	telegramApi
		// 		.downloadPhoto(dialog.peerData.photo.photo_small)
		// 		.then(function(data) {
		// 			var blob = new Blob(data.bytes, { type: data.type });
		// 			var url = URL.createObjectURL(blob);
		// 			photoNodeImage.src = url;
		// 		});
		// }
		// this.getNode = function() {
		// 	return chatListItem;
		// };
	}
}