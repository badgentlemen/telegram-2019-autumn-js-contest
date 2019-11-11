var MessageServices = {
    history: {},
    saveMessages(messages, peerID) {
        if (this.history[peerID]) {
            this.history[peerID].concat(messages);
        } else {
            this.history[peerID] = messages;
        }
    }
}


function getPeerSettings(peerID) {
    var found = appStore.dialogs.find(function(dialog) {
        return dialog.peerID === peerID
    });
    if (!found) {
        return null
    }

    return found['notify_settings'];
}

function isPeerMuted(peerID) {
    var peerNotifySettings = getPeerSettings(peerID);

    if (!peerNotifySettings) {
        return false;
    }

    return peerNotifySettings._ == "peerNotifySettings" && peerNotifySettings.mute_until > 0 && peerNotifySettings.mute_until * 1000 > tsNow()
}

function getFileName(location) {
	switch (location._) {
		case 'inputDocumentFileLocation':
			var fileName = (location.file_name || '').split('.', 2);
			var ext = fileName[1] || '';
			if (location.sticker) {
				ext += '.png';
			}
			var versionPart = location.version ? 'v' + location.version : '';
			return fileName[0] + '_' + location.id + versionPart + '.' + ext;

		default:
			if (!location.volume_id) {
				return;
			}
			var ext = 'jpg';
			if (location.sticker) {
				ext = 'webp';
			}
			return (
				location.volume_id +
				'_' +
				location.local_id +
				'_' +
				location.secret +
				'.' +
				ext
			);
	}
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
	};
}

function getPeerID(peerObject) {
	return peerObject.user_id
		? peerObject.user_id
		: -(peerObject.channel_id || peerObject.chat_id || -0);
}

function isChannel(peerID) {
	var target = appStore.chats.find(function(chat) {
		return chat.id === Math.abs(peerID);
	});
	if (!target) {
		return false;
	}
	return target._ === 'channel';
}

function getDialog(peerID) {
	return appStore.dialogs.find(function(dialog) {
		return dialog.peerID === peerID;
	});
}

function chatByChatId(chatId) {
	return appStore.chats.find(function(chat) {
		return chat.id === chatId;
	});
}

function getUserById(userId) {
	return appStore.users.find(function(user) {
		return user.id === userId;
	});
}

function getPeerPhoto(peerID) {}

function getInputPeerByID(peerID) {
	if (!peerID) {
		return { _: 'inputPeerEmpty' };
	}

	if (peerID < 0) {
		var chatID = -peerID;
		if (!isChannel(chatID)) {
			return {
				_: 'inputPeerChat',
				chat_id: chatID
			};
		} else {
			return {
				_: 'inputPeerChannel',
				channel_id: chatID,
				access_hash: chatByChatId(chatID).access_hash || 0
			};
		}
	} else {
		return {
			_: 'inputPeerUser',
			user_id: peerID,
			access_hash: getUserById(peerID).access_hash || 0
		};
	}
}

function wrapForMessage(message) {

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
    dialog.hasAvatar = dialog.peerData.photo !== undefined

	if (message['from_id'] > 0) {
		dialog.peerID = message['from_id'];
		dialog.foundHistory = true;
	}

    dialog.peerID = getPeerID(dialog.peer);

	dialog.unreadCount = dialog.unread_count;
    delete dialog.unread_count;

	return dialog;
}
