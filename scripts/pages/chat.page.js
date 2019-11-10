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

    var currentDialog = null;
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

    this.setCurrentDialog = function(dialog) {
        body.setCurrentDialog(dialog);
    }

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

    function unActiveAllItems() {
        chatListItems.forEach(function(item) {
            item.chatListItem.classList.remove('ui-dialog__active');
        })
    }

    this.setCurrentDialog = function(dialog) {
        unActiveAllItems();

        var item = chatListItems.find(function(item) {
            return item.dialog === dialog;
        })

        if (item) {
            item.chatListItem.classList.add('ui-dialog__active');
        }
    }

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

            chatListItems.push({
                dialog: chat,
                chatListItem: chatListItemNode
            });

            chatListItemNode.addEventListener('click', function() {
                onItemClick(chat);
            }, false);


            chatListItemNodes.push(chatListItemNode);
            chatList.appendChild(chatListItemNode);
        }


    };

    this.getChatList = function() {
        return chatList;
    }
}



function ChatContent() {
    var currentDialog = null;
    var messages = [];
    var historyClasses = ['ui-history__user', 'ui-history__chat', 'ui-history__channel'];
    var node = createElement('div', 'ui-chat__content');
    var header = createElement('div', 'ui-chat__content_header', node);
    var body = createElement('div', 'ui-chat__content_body', node);
    var history = createElement('div', 'ui-history', body);
    var historyContainer = createElement('div', 'ui-history__container', history);

    this.getNode = function() {
        return node;
    }

    this.destroy = function() {
        removeAllChild(node);
        header = null;
        body = null;
    }

    this.setCurrentDialog = function(dialog) {
        currentDialog = dialog;
        historyClasses.forEach(function(className) {
            history.classList.remove(className)
        });
        history.classList.add('ui-history__' + dialog.peerData._);
        fetchHistory();
    };

    function fetchHistory() {
        APIManager.getHistory(currentDialog.peerID).then(function(response) {
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

function ChatListItem(dialog) {

    dialog = dialog || {};
    var chatListItem = createElement('div', 'ui-dialog');
    chatListItem.classList.add('ui-dialog__' + dialog.type);

    if (dialog.pFlags.pinned) {
        chatListItem.classList.add('ui-dialog__pinned');
    }

    chatListItem.setAttribute('id', Math.abs(dialog.peerID));

    var photoNode = createElement('div', 'ui-dialog__photo-node', chatListItem);

    var messageWrapper = createElement('div', 'ui-dialog__wrapper', chatListItem);
    var titleNode = createElement('div', 'ui-dialog__title', messageWrapper);
    var titleTextNode = createElement('span', 'ui-dialog__title-text', titleNode);

    var peerData = dialog.peerData || {};

    titleTextNode.innerText = dialog.title;

    var timeNode = createElement('span', 'ui-dialog__timestamp', titleNode);
    timeNode.innerText = dialog.dateText || '';

    var messageNode = createElement('div', 'ui-dialog__message', messageWrapper);
    var textNode = createElement('div', 'ui-dialog__text', messageNode);
    textNode.innerHTML = (dialog.message.message || '').substring(0, 128);

    if (dialog.isOnline && !dialog.peerData.pFlags.self) {
        photoNode.classList.add('ui-dialog__online');
    }

    var pinnedBadge = null;

    if (dialog.pFlags.pinned) {
        pinnedBadge = createElement('div', 'ui-badge ui-badge__pinned', messageNode);
    }

    if (dialog.unreadCount > 0 && !dialog.pFlags.out || dialog.pinned) {
        var badge = createElement('div', 'ui-badge ui-badge__unread', messageNode);
        badge.setAttribute('unread-count', dialog.unreadCount);
        chatListItem.classList.add('ui-dialog__unread');

        if (isPeerMuted(dialog.peerID)) {
            badge.classList.add('ui-badge__unread__muted');
            chatListItem.classList.add('ui-dialog__muted');
        }

    }

    var photoNodeImage = createElement('img', 'ui-dialog__photo', photoNode);

    if (dialog.peerData.pFlags.self) {

        photoNodeImage.src = '/assets/fave.png';

    } else if (dialog.peerData.photo) {
        telegramApi.downloadPhoto(dialog.peerData.photo.photo_small).then(function(data) {
            var blob = new Blob(data.bytes, {type: data.type});
            var url = URL.createObjectURL(blob);
            photoNodeImage.src = url;
        });
    }

    this.getNode = function() {
        return chatListItem;
    }
}

function peerPhotoLink() {

}