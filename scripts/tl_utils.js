import AppstoreInstance from "./app.store";
import Dialog from "./model/dialog";
import {tsNow} from "./utils";

var MessageServices = {
	history: {},
	saveMessages(messages, peerID) {
		if (this.history[peerID]) {
			this.history[peerID].concat(messages);
		} else {
			this.history[peerID] = messages;
		}
	}
};

export const PeerTypeCollection = [
	{
		key: 'peerUser',
		value: 'user_id',
		target: 'users',
		type: 'user'
	},
	{
		key: 'peerChannel',
		value: 'channel_id',
		target: 'chats',
		type: 'channel'
	},
	{
		key: 'peerChat',
		value: 'chat_id',
		target: 'chats',
		type: 'chat'
	}
];

function getPeerSettings(peerID) {
	var found = AppstoreInstance.dialogs.find(function(dialog) {
		return dialog.peerID === peerID;
	});
	if (!found) {
		return null;
	}

	return found['notify_settings'];
}

export const isPeerMuted = (peerID) => {
	var peerNotifySettings = getPeerSettings(peerID);

	if (!peerNotifySettings) {
		return false;
	}

	return isPeerNotificationMuted(peerNotifySettings);
}

export const isPeerNotificationMuted = (peerNotifySettings) => {
    return peerNotifySettings._ == 'peerNotifySettings' &&
    peerNotifySettings.mute_until > 0 &&
    peerNotifySettings.mute_until * 1000 > tsNow()
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
					title = peerData.first_name + ' ' + peerData.last_name;
				} else if (peerData.first_name) {
					title = peerData.first_name;
				} else {
					title = peerData.username || '';
				}
			}
			break;
		default:
			title = peerData.title;
			break;
	}

	return title;
}

export const onlineStatus = (user) => {
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

export const getPeerID = (peerObject) => {
	return peerObject.user_id
		? peerObject.user_id
		: -(peerObject.channel_id || peerObject.chat_id || -0);
}

function isChannel(peerID) {
	var target = AppstoreInstance.chats.find(function(chat) {
		return chat.id === Math.abs(peerID);
	});
	if (!target) {
		return false;
	}
	return target._ === 'channel';
}

function getDialog(peerID) {
	return AppstoreInstance.dialogs.find(function(dialog) {
		return dialog.peerID === peerID;
	});
}

function chatByChatId(chatId) {
	return AppstoreInstance.chats.find(function(chat) {
		return chat.id === chatId;
	});
}

function getUserById(userId) {
	return AppstoreInstance.users.find(function(user) {
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

function wrapForMessage(message) {}

export const wrapForDialog = object => {
    let dialog = new Dialog(object);
    const collectionTarget = AppstoreInstance.messagesTarget()[dialog.target];

    const peerData = collectionTarget.find(target => {
        return target.id === dialog.id;
    });

    const message = AppstoreInstance.messages.find(message => {
        const toId = message.to_id;
        return toId[dialog.idPreffix] === dialog.id;
    }) || {};

    dialog.setPeerData(peerData);
    dialog.setTitle(getTitleForPeerData(peerData));
    dialog.setMessage(message);
    return dialog;
};
