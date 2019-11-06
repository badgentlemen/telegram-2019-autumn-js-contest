// var fetchImpl = function() {
//     var request = new XMLHttpRequest();
//     request.open('POST')
// }

var APIManager = {
    getUserID: function(callbackFunction) {
        var user_auth = localStorage.getItem('user_auth');
        callbackFunction(user_auth);
    }
}


var invokeApi = function(method, params, options) {



};


var Networker = {
    sentMessages: {},
    wrapApiCall: function(method, params, options, callback) {
        var options = options || {};

        var serializer = new TLSerialization(options);
        serializer.storeInt(0xda9b0d0d, 'invokeWithLayer');
        serializer.storeInt(74, 'layer');
        serializer.storeInt(0xc7481da6, 'initConnection');
        serializer.storeInt(Config.App.id, 'api_id');

        options.resultType = serializer.storeMethod(method, params);

        var messageID = MtpTimeManager.generateMessageID();

        var message = {
            msg_id: messageID,
            body: serializer.getBytes(true),
            isAPI: true
        };

        return this.sendEncryptedRequest(message, options, callback);
    },

    pushMessage: function(message, options, callback) {
        this.sentMessages[message.msg_id] = Object.assign({message: message, options: message}, { callback: callback});
    },

    sendEncryptedRequest: function(message, options, callback) {
        var self = this;
        var options = options || {};
        var data = new TLSerialization({startMaxLength: message.body.length + 2048});
        data.storeIntBytes()
    }
}
