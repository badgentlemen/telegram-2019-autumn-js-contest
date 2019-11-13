import AppstoreInstance from "./app.store";
import Dialog from "./model/dialog";
import {tsNow} from "./utils";
import { DateTime } from 'luxon';

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

export const getUser = (peerID) => {
    return AppstoreInstance.users.find(user => user.id === peerID);
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
        let preffix = dialog.idPreffix;
        let foundMsg = message['to_id'][preffix] === dialog.id;
        if (!foundMsg) {
            foundMsg = message['from_id'] === dialog.id && message['to_id']._ === dialog.peerType.key;
        }
        return foundMsg
    }) || { };

    dialog.setPeerData(peerData);
    dialog.setTitle(getTitleForPeerData(peerData));
    dialog.setMessage(message);
    return dialog;
}

export const wrapRichText = (text, options = {}) => {
    if (!text || !text.length) {
        return '';
    }

    const entries = options.entities;
    const contextSize = options.contextSize || 'Telegram';
    const contextExternal = contextSize !== 'Telegram';

    var emojiFound = false

    // if (entities === undefined) {
    //     entities =
    // }

    return text;
}

export const dateOrTimeFilter = (timestamp, extended = false) => {
    if (!timestamp) {
        return '';
    }

    const ticks = timestamp * 1000;
    const diff = Math.abs(tsNow() - ticks);
    let format = 'M/d/yy';

    if (diff > 518400000) {
        format = extended ? 'MMM d, y' : 'M/d/yy';
    } else if (diff > 43200000) {
        format = extended ? 'EEEE' : 'EEE';
    }
    return dateFilter(ticks, format);
}

export const dateFilter = (ticks, format) => {
    const date = DateTime.fromMillis(ticks);
    return date.toFormat(format);
}

export const wrapForDocument = (document = {}) => {

    if (document.thumb && document.thumb._ == 'photoSizeEmpty') {
        delete document.thumb;
    }

    (document.attributes || []).forEach(attribute => {
        switch (attribute._) {
            case 'documentAttributeFilename':
                document.fileName = attribute.file_name || '';
                break;
            case 'documentAttributeSticker':
                document.stickerEmoji = attribute.alt || '';
                document.type = 'sticker';
                break;
            case 'documentAttributeAudio':
                document.duration = attribute.duration
                document.audioTitle = attribute.title
                document.audioPerformer = attribute.performer
                document.type = attribute.pFlags.voice ? 'voice' : 'audio';
                break;
            case 'documentAttributeVideo':
                document.duration = attribute.duration
                document.w = attribute.w
                document.h = attribute.h
                if (document.thumb &&
                    attribute.pFlags.round_message) {
                    document.type = 'round'
                }
                else if (document.thumb) {
                    document.type = 'video'
                }
                break;
            case 'documentAttributeImageSize':
                document.w = attribute.w
                document.h = attribute.h
                break
            case 'documentAttributeAnimated':
                if ((document.mime_type == 'image/gif' || document.mime_type == 'video/mp4') &&
                    document.thumb) {
                    document.type = 'gif'
                }
                document.animated = true
                break
        }
    })

    if (!document.mime_type) {
        switch (document.type) {
          case 'gif':
            document.mime_type = 'video/mp4'
            break
          case 'video':
          case 'round':
            document.mime_type = 'video/mp4'
            break
          case 'sticker':
            document.mime_type = 'image/webp'
            break
          case 'audio':
            document.mime_type = 'audio/mpeg'
            break
          case 'voice':
            document.mime_type = 'audio/ogg'
            break
          default:
            document.mime_type = 'application/octet-stream'
            break
        }
      }

      if (!document.file_name) {
        document.fileName = ''
      }

      if (document._ == 'documentEmpty') {
        document.size = 0
      }

    return document;
}

export const ConversationType = {
    "conversation_you": "You",
	"conversation_draft": "Draft:",
	"conversation_media_photo": "Photo",
	"conversation_media_video": "Video",
	"conversation_media_round": "Video message",
	"conversation_media_document": "File",
	"conversation_media_sticker": "Sticker",
	"conversation_media_gif": "GIF",
	"conversation_media_audio": "Audio",
	"conversation_media_location": "Location",
	"conversation_media_contact": "Contact",
	"conversation_media_attachment": "Attachment",
    "conversation_media_unsupported": "Unsupported attachment",
    "conversation_media_game": "🎮"
}