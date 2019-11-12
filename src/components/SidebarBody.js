import {createElement} from "../lib";
import {ChatListItem} from "../pages/chat.page";
import BaseComponent from "./base.component";

export default class SidebarBody extends BaseComponent {
    constructor(options) {
        super(options);
        this.node = createElement('div', {'class': 'ui-sidebar__body'});
        // var chatList = createElement('div', 'ui-dialog__list', node);
        // var floatinButton = createElement('div', 'ui-dialog__floating-button', node);
        // var pencilImage = createElement('img', 'ui-image__pencilImage', floatinButton);
        // pencilImage.src = '/assets/newchat_filled_white.svg';
        // var chatListItemNodes = [];
        // var chatListItems = [];
        // function unActiveAllItems() {
        //     chatListItems.forEach(function (item) {
        //         item.chatListItem.classList.remove('ui-dialog__active');
        //     });
        // }
        // this.setCurrentDialog = function (dialog) {
        //     unActiveAllItems();
        //     var item = chatListItems.find(function (item) {
        //         return item.dialog === dialog;
        //     });
        //     if (item) {
        //         item.chatListItem.classList.add('ui-dialog__active');
        //     }
        // };
        // this.setChats = function (chats) {
        //     removeAllChild(chatList);
        //     chats = chats || [];
        //     for (let index = 0; index < chats.length; index++) {
        //         const chat = chats[index];
        //         const chatListItem = new ChatListItem(chat);
        //         const chatListItemNode = chatListItem.getNode();
        //         if (index > 0) {
        //             var prevChat = chats[index - 1];
        //             var prevChatisPinned = prevChat.pFlags.pinned;
        //             var currentChatisPinned = chat.pFlags.pinned || false;
        //             if (prevChatisPinned && !currentChatisPinned) {
        //                 var separator = createElement('div', 'ui-dialog__separator', chatList);
        //             }
        //         }
        //         chatListItems.push({
        //             dialog: chat,
        //             chatListItem: chatListItemNode
        //         });
        //         chatListItemNode.addEventListener('click', function () {
        //             onItemClick(chat);
        //         }, false);
        //         chatListItemNodes.push(chatListItemNode);
        //         chatList.appendChild(chatListItemNode);
        //     }
        // };
        // this.getChatList = function () {
        //     return chatList;
        // };
    }
}
