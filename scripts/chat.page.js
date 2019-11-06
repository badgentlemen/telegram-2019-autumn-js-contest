function ChatsPage(container) {
    container.classList.add('UiChat_layout');

    var node = createElement('div', 'UiChat_layout__node', container);
    var chatSidebar = new Sidebar();
    var chatContent = new ChatContent();

    var sidebarNode = null;
    var chatContentNode = null;

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
        Networker.wrapApiCall('contacts.search', {q: 'awesome', limit: 10})
    }

    function fetchMessagesForChatId(id) {

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


function Sidebar() {
    var node = createElement('div', 'ui-sidebar');
    var header = null;
    var body = null;
    var loadingNode = null;

    function renderSidebarWrapper() {
        this.header = new SidebarHeader(node);
        this.body = new SidebarBody(node);
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
    };

    function renderChatsFlow() {

    }

    renderSidebarWrapper();
}

function SidebarHeader(container) {
    var node = createElement('div', 'ui-sidebar__header', container);
    var menu = createElement('div', 'ui-hamburger-menu', node);
    var search = createElement('div', 'ui-search', node);
    var menuIcon = createElement('img', 'ui-hamburger-menu__icon', menu);
    menuIcon.src = '/assets/menu_svg.svg';
}


function SidebarBody(container) {
    var node = createElement('div', 'ui-sidebar__body', container);
    var chatList = new ChatList(node);
}

function ChatContent() {
    var node = createElement('div', 'ui-chat__content');
    var header = createElement('div', 'ui-chat__content_header', node);
    var body = createElement('div', 'ui-chat__content_body', node);

    this.getNode = function() {
        return node;
    }

    this.destroy = function() {

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
}


function ChatList(container) {
    var chatList = createElement('div', 'ui-chat__list', container);

    this.setChats = function(chats) {
        removeAllChild(chatList);
        chats = chats || [];
        for (let index = 0; index < chats.length; index++) {
            const chat = chats[index];

        }
    };
}

function ChatListItem(container) {
    var listItem = createElement('div', 'ui-chat__list-item', container);
}