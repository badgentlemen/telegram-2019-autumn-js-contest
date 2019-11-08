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
            if (response.result.dialogs.length) {
                var dialogs = dialogsResult.dialogs;
                dialogs.forEach(function(dialog) {

                });

                return dialogs;
            }
        })
    }
}