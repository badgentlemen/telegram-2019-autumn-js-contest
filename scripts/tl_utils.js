
function isPeerMuted(peerID) {

}

function getTitleForPeerData(peerData) {
	var type = peerData._;
	var title = '';
	switch (type) {
		case 'user':
			if (peerData.pFlags.self) {
				title = 'Saved Messages';
			} else {
                if (peerData.first_name && peerData.last_name) {
                    userName = peerData.first_name + ' ' + peerData.last_name;
                } else if (peerData.first_name) {
                    userName = peerData.first_name;
                } else {
                    userName = peerData.username || '';
                }
                title = userName;
            }
            break;
		default:
            title = peerData.title;
			break;
    }

    return title;
}

function onlineStatus(user) {
	var statusType = user.status && user.status._;

	if (!statusType) {
		return false;
	}

	var statusTitle;

	switch (statusType) {
		case 'userStatusOnline':
            statusTitle = 'online';
            break;
		case 'userStatusOffline':
            statusTitle = '';
            break;
		case 'userStatusRecently':
            statusTitle = 'last seen recently';
            break;
		case 'userStatusLastWeek':
            statusTitle = 'last seen within a week';
            break;
		case 'userStatusLastMonth':
            statusTitle = 'user_status_last_month';
            break;
		default:
			statusTitle = 'last seen a long time ago';
			break;
    }

    return {
        statusType: statusType,
        statusTitle: statusTitle
    }
}

function wrapForDialog(dialog) {

	var peer = dialog.peer;
	var key = peer._;
	var id_preffix = 'user_id';
	var id = 0;
	var target = 'chats';
	var type = 'user';
	var foundBtf = batiscaff.find(function(btf) {
		return btf.key === key;
	});

	if (foundBtf) {
		id_preffix = foundBtf.value;
		id = peer[id_preffix];
		target = foundBtf.target;
		type = foundBtf.type;
	}

	dialog.type = type;

	var collectionTarget = appStore.messagesTarget()[target];
	var message =
		appStore.messages.find(function(message) {
			var toId = message.to_id;
			return toId[id_preffix] === id;
		}) || {};
	dialog.message = message;

	dialog.peerData = collectionTarget.find(function(target) {
		return target.id === id;
    });
    dialog.onlineStatus = onlineStatus(dialog.peerData);
	dialog.isOnline = dialog.onlineStatus.statusType === 'userStatusOnline';
    dialog.title = getTitleForPeerData(dialog.peerData);

    dialog.unreadCount = dialog.unread_count;
    delete dialog.unread_count

	return dialog;
}