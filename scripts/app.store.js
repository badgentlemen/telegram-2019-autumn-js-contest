class AppStore {

    constructor() {
        this.chats = [];
        this.messages = [];
        this.users = [];
    }

    saveChats(chats) {
        this.chats = chats;
    }

    saveMessages(messages) {
        this.messages = messages;
    }

    saveUsers(users) {
        this.users = users;
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

var appStore = new AppStore();