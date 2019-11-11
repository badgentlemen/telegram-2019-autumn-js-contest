import { BaseComponent } from "../components";
import {createElement} from "../lib";
import Sidebar from "../components/nodes/Sidebar/Sidebar";
import {getDialogs} from "../lib/api.manager";

export default class ChatsPage extends BaseComponent {
	constructor(options) {
        super(options);
		this.node = createElement('div', {'class': 'UiChat_layout__node'});
		this.chatSidebar = new Sidebar({
			onDialogClick: _ => {

            }
		});
		// vchatContent = new ChatContent();
		// var sidebarNode = null;
		// var dialogs = [];
		// var chatContentNode = null;
		// var currentDialog = null;
		// var destroyed = false;
		// var selectedChatId = null;
		// chatLists = [];
		this.renderMainWindow();
	}

	renderMainWindow() {
		this.sidebarNode = this.chatSidebar.getNode();
		// this.chatContentNode = chatContent.getNode();
		this.node.appendChild(this.sidebarNode);
		// node.appendChild(chatContentNode);
		this.fetchChatsList();
	}
	renderChatList() {}

	renderChatMessages() {}

	fetchChatsList() {
        // this.chatSidebar.setLoading(true);
		// getDialogs().then(dialogs => {
        //     this.chatSidebar.setDialogs(dialogs);
        // }).catch(error => {
        //     console.log(error);
        //     this.chatSidebar.setDialogs([]);
        // });
	}

	fetchMessagesForChatId(id) {}

	fetchHistoryFor(dialog) {
		if (currentDialog !== dialog) {
			currentDialog = dialog;
			chatSidebar.setCurrentDialog(currentDialog);
			chatContent.setCurrentDialog(currentDialog);
			var peerID = getPeerID(dialog.peer);
			APIManager.getHistory(peerID).then(function(history) {
				MessageServices.saveMessages(history, peerID);
			});
		}
	}

	reset() {
		sidebarNode = null;
		chatContentNode = null;
	}

	destroy() {
		removeAllChild(container);
	}
}

function SidebarHeader(container, onSearchCallback) {
	var node = createElement('div', 'ui-sidebar__header', container);

	function renderMenuWrapper() {
		var menu = createElement('div', 'ui-hamburger-menu', node);
		var menuIcon = createElement('img', 'ui-hamburger-menu__icon', menu);
		menuIcon.src = '/assets/menu_svg.svg';
	}

	function renderSearchWrapper() {
		var search = createElement('div', 'ui-search', node);
		var loupeIcon = createElement('img', 'ui-search__loupeicon', search);
		loupeIcon.src = '/assets/ui-search_loupe-icon.svg';
		var input = createElement('input', 'ui-search__input', search);

		input.addEventListener('input', function() {
			onSearchCallback(this.value);
		});

		input.placeholder = 'Search';
		search.addEventListener('click', function() {
			input.focus();
		});
	}

	function renderWrapper() {
		renderMenuWrapper();
		renderSearchWrapper();
	}
	renderWrapper();
}

class ChatContent {
	constructor() {
		var currentDialog = null;
		var messages = [];
		var historyClasses = [
			'ui-history__user',
			'ui-history__chat',
			'ui-history__channel'
		];
		var node = createElement('div', 'ui-chat__content');
		var header = createElement('div', 'ui-chat__content_header', node);
		var body = createElement('div', 'ui-chat__content_body', node);
		var history = createElement('div', 'ui-history', body);
		var historyContainer = createElement(
			'div',
			'ui-history__container',
			history
		);
		this.getNode = function() {
			return node;
		};
		this.destroy = function() {
			removeAllChild(node);
			header = null;
			body = null;
		};
		this.setCurrentDialog = function(dialog) {
			currentDialog = dialog;
			historyClasses.forEach(function(className) {
				history.classList.remove(className);
			});
			history.classList.add('ui-history__' + dialog.peerData._);
			fetchHistory();
		};
		function fetchHistory() {
			APIManager.getHistory(currentDialog.peerID).then(function(
				response
			) {
				messages = response;
				renderHistoryWrap();
			});
		}
		function renderHistoryWrap() {
			removeAllChild(historyContainer);
			var lastMessageRow;
			for (var index = 0; index < messages.length; index++) {
				var message = messages[index];
				var currentFromId = message.from_id;
				var isBallonEffect = true;
				var isSameFromId = true;
				var isOut = message.pFlags.out;
				// if (index < messages.length - 1) {
				//     var nextMessage = messages[index + 1];
				//     var nextFromId = nextMessage.from_id;
				//     isSameFromId = currentFromId !== nextFromId;
				// }
				// console.log(isSameFromId);
				// var messageView = createElement('div', 'ui-message', messageRow);
				// messageView.innerHTML = message.message;
				if (isOut) {
					// messageRow.classList.add('ui-history__row_out');
					// messageView.classList.add('ui-message__out');
				}
				if (!isSameFromId) {
				} else {
				}
			}
		}
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
}

export class ChatListItem {

}

function peerPhotoLink() {}
