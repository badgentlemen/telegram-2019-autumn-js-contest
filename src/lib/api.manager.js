import { getValue, removeValue } from './storage';
import AppstoreInstance from '../app.store';
import {wrapForDialog, getPeerID, isChannel, getDialog} from '../tl_utils';

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

export const downloadPhoto = (location) => {
    return telegramApi
        .downloadPhoto(location)
        .then(response => {
            const blob = new Blob(response.bytes, {
                type: response.type
            });
            return URL.createObjectURL(blob);
        });
}

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
        }

        dialogs = dialogs.filter(dialog => {
            return ((dialog.message || {}).action || {})._ != 'messageActionChatMigrateTo'
        });

		AppstoreInstance.saveDialogs(dialogs);
		return dialogs;
	});
};

export const getHistory = (peerID, peerType, maxID, limit = 15, offset = 0) => {
	return telegramApi
		.getHistory({
			id: peerID,
            take: limit,
            type: peerType
		});
};
