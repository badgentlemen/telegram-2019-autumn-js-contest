telegramApi.setConfig({
    app: Config.App,
    server: {
        test: [{
            id: 2,
            host: '149.154.167.40',
            port: 443
        }],
        production: [{
            id: 2,
            host: '149.154.167.50',
            port: 443
        }]
    }
});

var batiscaff = [{
    key: 'peerUser',
    value: 'user_id',
    target: 'users',
    type: 'user'
}, {
    key: 'peerChannel',
    value: 'channel_id',
    target: 'chats',
    type: 'channel'
}, {
    key: 'peerChat',
    value: 'chat_id',
    target: 'chats',
    type: 'chat'
}];


var APIManager = {
    getContacts: function() {
        return telegramApi.invokeApi('contacts.getContacts', {
            hash: 0
        });
    },
    sendCode: function(phoneNumber) {
        return telegramApi.sendCode(phoneNumber);
    },
    signIn: function(phone_number ,phone_code_hash, code) {
        return telegramApi.signIn(phone_number ,phone_code_hash, code);
    },
    getUserID: function(callbackFunction) {
        var user_auth = localStorage.getItem('user_auth');
        callbackFunction(user_auth);
    },
    getDialogs: function() {
        return telegramApi.getDialogs(0, 200).then(function(response) {
            var result = response.result;
            var dialogs = [];
            appStore.saveChats(result.chats || []);
            appStore.saveMessages(result.messages || []);
            appStore.saveUsers(result.users || []);

            if (result.dialogs.length) {
                result.dialogs.forEach(function(dlg) {
                    var dialog = wrapForDialog(dlg);
                    dialogs.push(dialog)
                });
            }

            return dialogs;
        })
    }
}