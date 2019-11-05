function ChatsPage(container) {
    container.classList.add('UiChat_layout');

    var node = createElement('div', 'UiChat_layout__node', container);
    var chatSidebar = new ChatSidebar();
    var chatContent = new ChatContent();

    var destroyed = false;
    var selectedChatId = null;

    chatLists = [];

    function renderMainWindow() {
        removeAllChild(node);
        node.appendChild(chatSidebar.getNode());
        node.appendChild(chatContent.getNode());
    }

    function renderChatList() {

    }

    function fetchChatsList() {

    }

    renderMainWindow();
}


function ChatSidebar() {

    var node = createElement('div', 'ui-chat__sidebar');

    this.getNode = function() {
        return node;
    }
}

function ChatContent() {
    var node = createElement('div', 'ui-chat__content');

    this.getNode = function() {
        return node;
    }
}


function ChatListItem(container) {
    var listItem = createElement('div', 'ui-chat__list-item', container);

}