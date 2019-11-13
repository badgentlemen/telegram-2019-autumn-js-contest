import { getValue, removeValue } from './storage';
import AppstoreInstance from '../app.store';
import {wrapForDialog, getPeerID} from '../tl_utils';

export const annihilation = () => {
	removeValue(['user_auth']);
};

export const getContacts = () => {
	return telegramApi.invokeApi('contacts.getContacts', {
		hash: 0
	});
};

export const sendCode = phoneNumber => {
	return telegramApi.sendCode(phoneNumber);
};

export const logIn = (phoneNumber, phoneCodeHash, smsCode) => {
	return telegramApi.signIn(phoneNumber, phoneCodeHash, smsCode);
};

export const getUserID = () => {
	return getValue('user_auth').then(user => {
		if (user && user.id) {
			return user.id;
		}
		return null;
	});
};

export const getDialogs = (limit = 200, offset = 0) => {
	return telegramApi.getDialogs(offset, limit).then(response => {
		const result = response.result;
		let dialogs = [];
		AppstoreInstance.saveChats(result.chats || []);
		AppstoreInstance.saveMessages(result.messages || []);
        AppstoreInstance.saveUsers(result.users || []);

        console.log(AppstoreInstance);

		if (result.dialogs.length) {
			result.dialogs.forEach(function(object) {
				const dialog = wrapForDialog(object);
				dialogs.push(dialog);
            });

			// dialogs.forEach(function(dialog) {
			// 	const peerID = getPeerID(dialog.peer);
			// 	const message = dialog.message;
			// 	// MessageServices.saveMessages([message], peerID);
			// });
        }

        dialogs = dialogs.filter(dialog => {
            return ((dialog.message || {}).action || {})._ != 'messageActionChatMigrateTo'
        });

		AppstoreInstance.dialogs = dialogs;
		return dialogs;
	});
};

export const getHistory = (peerID, limit, offset) => {
	limit = limit || 15;
	offset = offset || 0;
	var channel = isChannel(peerID);
	var dialog = getDialog(peerID);
	return telegramApi
		.getHistory({
			id: peerID,
			take: limit
		})
		.then(function(result) {
			var messages = result.messages || [];
			return messages.sort(function(prev, next) {
				return prev.id - next.id;
			});
		});
};
