import { BaseComponent } from "../../src/components";
import {createElement} from "../lib";
import Sidebar from "../../src/components/nodes/Sidebar/Sidebar";
import {getDialogs} from "../lib/api.manager";
import ChatContent from "../../src/components/nodes/ChatContent/ChatContent";

export default class ChatsPage extends BaseComponent {
	constructor(options) {
        super(options);
        this.node = createElement('div', {'class': 'UiChat_layout__node'});
        this.chatContent = new ChatContent();
		this.chatSidebar = new Sidebar({
			onDialogClicked: dialog => {
                this.handleDialogSelect(dialog);
            }
		});

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
		this.chatContentNode = this.chatContent.getNode();
		this.node.appendChild(this.sidebarNode);
		this.node.appendChild(this.chatContentNode);
		this.fetchDialogsList();
	}
	renderChatList() {}

	renderChatMessages() {}

	fetchDialogsList() {
        this.chatSidebar.setLoading(true);
		getDialogs().then(dialogs => {
            this.chatSidebar.setDialogs(dialogs);

            if (dialogs.length) {
                this.chatContent.setCurrentDialog(dialogs[0]);
            }

        }).catch(error => {
            console.log(error);
            this.chatSidebar.setDialogs([]);
        });
	}

    fetchMessagesForChatId(id) {}


    handleDialogSelect(dialog) {
        this.chatContent.setCurrentDialog(dialog);
    }
}
