import { BaseComponent } from "../../src/components";
import {createElement} from "../lib";
import Sidebar from "../../src/components/nodes/Sidebar/Sidebar";
import {getDialogs} from "../lib/api.manager";
import ChatContent from "../../src/components/nodes/ChatContent/ChatContent";
import { searchQuery } from "../utils";
import AppstoreInstance from "../app.store";

export default class ChatsPage extends BaseComponent {
	constructor(options) {
        super(options);
        this.node = createElement('div', {'class': 'UiChat_layout__node'});
        this.peerQuery = searchQuery()['peer'];

        this.chatContent = new ChatContent();
		this.chatSidebar = new Sidebar({
			onDialogClicked: dialog => {
                this.handleDialogSelect(dialog);
            }
        });

		this.renderMainWindow();
	}

	renderMainWindow() {
		this.sidebarNode = this.chatSidebar.getNode();
		this.chatContentNode = this.chatContent.getNode();
		this.node.appendChild(this.sidebarNode);
		this.node.appendChild(this.chatContentNode);
		this.fetchDialogsList();
    }

	fetchDialogsList() {
        this.chatSidebar.setLoading(true);
		getDialogs().then(dialogs => {
            this.chatSidebar.setDialogs(dialogs);

            if (this.peerQuery && this.peerQuery.length) {
                const currentDialog = AppstoreInstance.dialogs.find(dialog => dialog.peerString === this.peerQuery);

                if (currentDialog) {
                    this.handleDialogSelect(currentDialog);
                }
            }

        }).catch(error => {
            console.log(error);
            this.chatSidebar.setDialogs([]);
        });
    }

    handleDialogSelect(dialog) {
        this.chatSidebar.setDialog(dialog);
        this.chatContent.setCurrentDialog(dialog);
    }
}
