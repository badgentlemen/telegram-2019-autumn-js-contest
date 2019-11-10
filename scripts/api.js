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

}