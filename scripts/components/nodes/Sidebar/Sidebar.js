import BaseComponent from "../../base.component";
import {createElement} from "../../../lib";
import {removeAllChild} from "../../../utils";
import UIDialogItem from "../UIDialogItem/UIDialogItem";
import ScrollableView from "../../ScrollableView/ScrollableView";


export default class Sidebar extends BaseComponent {
    constructor(options) {
        super();
        this.dialogs = options.dialogs || [];

        this.node = createElement('div', {'class': 'ui-sidebar'});

        this.sidebarHeader = createElement('div', {'class': 'ui-sidebar__header'}, this.node);

        this.sidebarBody = createElement('div', {'class': 'ui-sidebar__body'}, this.node);
        this.dialogScrollableView = new ScrollableView({
            className: 'ui-dialog__list'
        });
        this.dialogList = this.dialogScrollableView.getNode();
        this.sidebarBody.appendChild(this.dialogList);

        this.floatingButton = createElement('div', {'class': 'ui-dialog__floating-button'}, this.sidebarBody);

        this.loadingNode = createElement(
            'div',
            {'class': 'ui-sidebar__loading-flow'},
            this.node
        );

        createElement('div', {'class': 'ui-spinner'}, this.loadingNode);
        this.renderDialogList();
    }

    unActiveAllItems() {

    }

    renderDialogList() {
        for (let index = 0; index < this.dialogs.length; index++) {
            const dialog = this.dialogs[index];
            const dialogListItem = new UIDialogItem(dialog);
            const dialogListItemNode = dialogListItem.getNode();

            this.dialogScrollableView.appendChild(dialogListItemNode);

            // if (index > 0) {
            //     var prevChat = chats[index - 1];
            //     var prevChatisPinned = prevChat.pFlags.pinned;
            //     var currentChatisPinned = chat.pFlags.pinned || false;
            //     if (prevChatisPinned && !currentChatisPinned) {
            //         var separator = createElement('div', 'ui-dialog__separator', chatList);
            //     }
            // }
            // chatListItems.push({
            //     dialog: chat,
            //     chatListItem: chatListItemNode
            // });
            // chatListItemNode.addEventListener('click', function () {
            //     onItemClick(chat);
            // }, false);
            // chatListItemNodes.push(chatListItemNode);
            // chatList.appendChild(chatListItemNode);
        }
    }

    handleDialogTapped() {

    }

    setLoading(loading) {
        this.loadingNode.style.display = loading ? 'flex': 'none';
    };

    setDialogs(dialogs) {
        this.dialogs = dialogs;
        this.setLoading(false);
        this.renderDialogList();
    }
}