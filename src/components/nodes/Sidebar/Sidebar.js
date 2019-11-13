import BaseComponent from '../../base.component';
import {
    createElement
} from '../../../lib';
import {
    removeAllChild
} from '../../../utils';
import UIDialogItem from '../UIDialogItem/UIDialogItem';
import ScrollableView from '../../ScrollableView/ScrollableView';

import menuIcon from '../../../assets/menu_svg.svg';
import loupeIcon from '../../../assets/ui-search_loupe-icon.svg';

export default class Sidebar extends BaseComponent {
    constructor(options) {
        super(options);
        this.dialogs = options.dialogs || [];
        this.dialogListItems = [];

        this.node = createElement('div', {
            class: 'ui-sidebar'
        });

        this.renderHeader();

        this.sidebarBody = createElement(
            'div', {
                class: 'ui-sidebar__body'
            },
            this.node
        );
        this.dialogScrollableView = new ScrollableView({
            className: 'ui-dialog__list',
        });
        this.dialogList = this.dialogScrollableView.getNode();
        this.sidebarBody.appendChild(this.dialogList);

        this.floatingButton = createElement(
            'div', {
                class: 'ui-dialog__floating-button'
            },
            this.sidebarBody
        );

        this.loadingNode = createElement(
            'div', {
                class: 'ui-sidebar__loading-flow'
            },
            this.node
        );

        createElement('div', {
            class: 'ui-spinner'
        }, this.loadingNode);
        this.dialogScrollableView.removeSubviews();
    }

    unActiveAllItems() {}

    renderHeader() {
        this.sidebarHeader = createElement(
            'div', {
                class: 'ui-sidebar__header'
            },
            this.node
        );

        const menu = createElement(
            'div', {
                class: 'ui-hamburger-menu'
            },
            this.sidebarHeader
        );

        const menuIconImage = createElement(
            'img', {
                class: 'ui-hamburger-menu__icon',
                src: menuIcon
            },
            menu
        );

        const search = createElement(
            'div', {
                class: 'ui-search'
            },
            this.sidebarHeader
        );

        const loupeIconImage = createElement(
            'img', {
                class: 'ui-search__loupeicon',
                src: loupeIcon
            },
            search
        );

        const searchInputNode = createElement('input', {'class': 'ui-search__input', 'placeholder': 'Search'}, search);

        search.addEventListener('click', () => {
            searchInputNode.focus();
        });
    }



    renderBody() {}

    renderDialogList() {
        this.dialogs.forEach((dialog, index) => {
            const dialogListItem = new UIDialogItem(dialog);
            const dialogListItemNode = dialogListItem.getNode();

            if (index > 0) {
                var prevDialog = this.dialogs[index - 1];
                var prevChatPinned = prevDialog.isPinned || false;
                var currentChatIsPinned = dialog.isPinned || false;
                if (prevChatPinned && !currentChatIsPinned) {
                    var separatorNode = createElement('div', {
                        class: 'ui-dialog__separator',
                    });
                    this.dialogScrollableView.appendChild(separatorNode);
                }
            }

            this.dialogListItems.push({
                dialog,
                chatListItem: dialogListItemNode,
            });

            dialogListItemNode.addEventListener(
                'click',
                event => {
                    this.handleDialogTapped(dialog);
                },
                false
            );

            this.dialogScrollableView.appendChild(dialogListItemNode);
        })
    }

    handleDialogTapped(dialog) {
        this.setDialog(dialog);
        this.options.onDialogClicked && this.options.onDialogClicked(dialog);
    }

    setLoading(loading) {
        this.loadingNode.style.display = loading ? 'flex' : 'none';
    }

    setDialog(dialog) {
        this.dialogListItems.forEach(item => {
            if (item.dialog === dialog) {
                item.chatListItem.classList.add('ui-dialog__active')
            } else {
                item.chatListItem.classList.remove('ui-dialog__active');
            }
        })
    }

    setDialogs(dialogs) {
        this.dialogs = dialogs;
        this.setLoading(false);
        this.renderDialogList();
    }
}