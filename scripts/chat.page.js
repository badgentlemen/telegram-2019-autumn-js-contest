function ChatsPage(container) {
    container.classList.add('UiChat_layout');

    var node = createElement('div', 'UiChat_layout__node', container);

    var chatSidebar = new Sidebar({
        onDialogClick: fetchHistoryFor,
    });

    var chatContent = new ChatContent();

    var sidebarNode = null;
    var dialogs = [];
    var chatContentNode = null;

    var currentChat = null;
    var destroyed = false;
    var selectedChatId = null;

    chatLists = [];

    function renderMainWindow() {
        reset();

        sidebarNode = chatSidebar.getNode();
        chatContentNode = chatContent.getNode();
        node.appendChild(sidebarNode);
        node.appendChild(chatContentNode);

        fetchChatsList();
    }

    function renderChatList() {

    }

    function renderChatMessages() {

    }

    function fetchChatsList() {
        chatSidebar.setLoading(true);
        APIManager.getDialogs().then(function(dialogs) {
            console.log(dialogs);
            chatSidebar.setChats(dialogs);
        });
    }

    function fetchMessagesForChatId(id) {

    }

    function fetchHistoryFor(dialog) {
        if (currentChat !== dialog) {
            currentChat = dialog;
            var peerID = getPeerID(dialog.peer);
            // APIManager.getHistory(peerID).then(function(history) {
            //     console.log(history);
            // });
        }
    }

    function reset() {
        sidebarNode = null;
        chatContentNode = null;
    }

    this.destroy = function() {
        removeAllChild(container);
    }

    renderMainWindow();
}


function Sidebar(options) {

    options = options || {};

    var node = createElement('div', 'ui-sidebar');
    var header = null;
    var body = null;
    var loadingNode = null;

    function onSearch(queryString) {

    }

    function renderSidebarWrapper() {
        header = new SidebarHeader(node, onSearch);
        body = new SidebarBody(node, onChatListItemClick);
    }

    function onChatListItemClick(dialog) {
        options.onDialogClick && options.onDialogClick(dialog);
    }

    this.getNode = function() {
        return node;
    }

    this.destroy = function() {
        removeAllChild(node);
        node = null;
        header = null;
        body = null;
    }

    this.setLoading = function(loading) {
        if (loading) {
            loadingNode = createElement('div', 'ui-sidebar__loading-flow', node);
            createElement('div', 'ui-spinner', loadingNode);
        } else {
            if (loadingNode) {
                elementRemoveFromSuperView(loadingNode);
                loadingNode = null;
            }
        }
    };

    this.setChats = function(chats) {
        var chats = chats || [];
        this.setLoading(false);
        body.setChats(chats);
    };

    function renderChatsFlow() {

    }

    renderSidebarWrapper();
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
        })

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


function SidebarBody(container, onItemClick) {
    var node = createElement('div', 'ui-sidebar__body', container);
    var chatList = createElement('div', 'ui-dialog__list', node);
    var floatinButton = createElement('div', 'ui-dialog__floating-button', node);
    var pencilImage = createElement('img', 'ui-image__pencilImage', floatinButton);
    pencilImage.src = '/assets/newchat_filled_white.svg';
    var chatListItemNodes = [];
    var chatListItems = [];

    this.setChats = function(chats) {
        removeAllChild(chatList);
        chats = chats || [];
        for (let index = 0; index < chats.length; index++) {
            const chat = chats[index];
            const chatListItem = new ChatListItem(chat);
            const chatListItemNode = chatListItem.getNode();

            if (index > 0) {
                var prevChat = chats[index - 1];
                var prevChatisPinned = prevChat.pFlags.pinned;
                var currentChatisPinned = chat.pFlags.pinned || false;

                if (prevChatisPinned && !currentChatisPinned) {
                    var separator = createElement('div', 'ui-dialog__separator', chatList);
                }
            }

            chatListItemNode.addEventListener('click', function() {
                onItemClick(chat);
            }, false);

            chatListItems.push(chatListItem);
            chatListItemNodes.push(chatListItemNode);
            chatList.appendChild(chatListItemNode);
        }
    };

    this.getChatList = function() {
        return chatList;
    }
}



function ChatContent() {
    var node = createElement('div', 'ui-chat__content');
    var header = createElement('div', 'ui-chat__content_header', node);
    var body = createElement('div', 'ui-chat__content_body', node);

    this.getNode = function() {
        return node;
    }

    this.destroy = function() {
        removeAllChild(node);
        header = null;
        body = null;
    }

    this.setLoading = function(loading) {
        if (loading) {
            loadingNode = createElement('div', 'ui-chat-content__loading-flow', node);
            createElement('div', 'ui-spinner', loadingNode);
        } else {
            if (loadingNode) {
                elementRemoveFromSuperView(loadingNode);
                loadingNode = null;
            }
        }
    };

    renderChatClosedNode = function() {
        var actions = [{
            id: -10001,
            title: 'Private',
            iconScr: ''
        }, {
            id: -10002,
            title: 'Group',
            iconSrc: ''
        }, {
            id: -10003,
            title: 'Channel',
            iconSrc: ''
        }];

        if (body) {
            var chatClosedWrapper = createElement('div', 'ui-chat__closed-wrapper', body)
            var chatClosedNode = createElement('div', 'ui-chat__closed-node', chatClosedWrapper);

            var chatClosedImg = createElement('img', 'ui-chat__closes-image', chatClosedNode);
            chatClosedImg.src = '/assets/chat_closed_icon.svg';

            var chatClosedTitle = createElement('h2', 'ui-chat__closed-title', chatClosedNode);
            chatClosedTitle.innerHTML = 'Open Chat <br/> or create a new one';

            var chatClosedActionsNode = createElement('div', 'ui-chat__closed-actions-node', chatClosedNode);

            actions.forEach(function(action) {
                var actionItemNode = createElement('div', 'ui-actions_group-item', chatClosedActionsNode);
            });

        }
    }
}

function ChatListItem(dialog) {

    dialog = dialog || {};
    var chatListItem = createElement('div', 'ui-dialog');
    chatListItem.classList.add('ui-dialog__' + dialog.type);

    if (dialog.pFlags.pinned) {
        chatListItem.classList.add('ui-dialog__pinned');
    }

    chatListItem.setAttribute('id', Math.abs(dialog.peerID));

    var avatar = createElement('div', 'ui-dialog__avatar', chatListItem);
    var avatarImage = createElement('img', 'ui-dialog__avatar-img', avatar);

    var messageWrapper = createElement('div', 'ui-dialog__wrapper', chatListItem);
    var titleNode = createElement('div', 'ui-dialog__title', messageWrapper);
    var titleTextNode = createElement('span', 'ui-dialog__title-text', titleNode);

    var peerData = dialog.peerData || {};

    titleTextNode.innerText = dialog.title;

    var timeNode = createElement('span', 'ui-dialog__timestamp', titleNode);
    timeNode.innerText = dialog.dateText || '';

    var messageNodeWrapper = createElement('div', 'ui-dialog__message-wrapper', messageWrapper);
    var messageNode = candidateMessageNodeInner();
    messageNodeWrapper.appendChild(messageNode);

    function candidateMessageNodeInner() {
        var node = createElement('span', 'ui-dialog__message-node');
        node.innerHTML = dialog.message;
        return node;
    }

    if (dialog.isOnline && !dialog.peerData.pFlags.self) {
        avatar.classList.add('ui-dialog__online');
    }

    if (dialog.unreadCount > 0 || dialog.pinned) {
        var badge = createElement('div', 'ui-badge ui-dialog__list-item__badge');

        messageNode.appendChild(badge);

        if (dialog.pinned) {
            badge.classList.add('ui-badge__pinned')
        }

        if (dialog.unreadCount > 0) {
            badge.innerText = dialog.unreadCount;
        }
    }

    if (dialog.peerData.photo) {
        var photo = {};

        telegramApi.downloadPhoto(dialog.peerData.photo.photo_small).then(function(data) {
            var blob = new Blob(data.bytes, {type: data.type});
            var url = URL.createObjectURL(blob);
            avatarImage.src = url;
        });
    }

    this.getNode = function() {
        return chatListItem;
    }
}

function peerPhotoLink() {

}