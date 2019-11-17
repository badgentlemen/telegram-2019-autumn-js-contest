class AppStore {

    constructor() {
        this.chats = [];
        this.messages = [];
        this.users = [];
        this.dialogs = [];
    }

    saveChats(chats) {
        this.chats = this.chats.concat(chats);
    }

    saveMessages(messages) {
        this.messages = this.messages.concat(messages);
    }

    saveUsers(users) {
        this.users = this.users.concat(users);
    }

    saveDialogs(dialogs) {
        this.dialogs = this.dialogs.concat(dialogs);
    }

    messagesTarget() {
        return {
            chats: this.chats,
            users: this.users
        };
    }

    peerDataFor(dialog) {

    }

    latestMessages(peerData) {

    }
}

const AppstoreInstance = new AppStore();
window.appStore = AppstoreInstance;
export default AppstoreInstance;