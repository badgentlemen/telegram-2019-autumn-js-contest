import { getValue, removeValue, setValue } from './storage';
import AppstoreInstance from '../app.store';
import {
	wrapForDialog,
	getPeerID,
	isChannel,
	getDialog,
	wrapForMessage
} from '../tl_utils';
import f2a from '../../helpers/2fa-code-response2';
import {bufferConcat} from '../utils';

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
	// return Promise.resolve(getSMSJSON);
};

export const logIn = (phoneNumber, phoneCodeHash, smsCode) => {
	return telegramApi.signIn(phoneNumber, phoneCodeHash, smsCode);
};

export const checkPasswordRequest = (password_hash) => {
    return telegramApi.invokeApi('auth.checkPassword', {
        password_hash
    })
}

export const checkPasswordTL = (password) => {
    return makePasswordHash(password).then(password_hash => {
        return setUserAuth({
            id: f2a.user.id
        });
    });
}

export const downloadPhoto = location => {
	return telegramApi.downloadPhoto(location).then(response => {
		const blob = new Blob(response.bytes, {
			type: response.type
		});
		return URL.createObjectURL(blob);
	});
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
		let messages = [];
		AppstoreInstance.saveChats(result.chats || []);
		AppstoreInstance.saveUsers(result.users || []);

		if (result.messages.length) {
			result.messages.forEach(object => {
				const message = wrapForMessage(object);
				messages.push(message);
			});
		}

		AppstoreInstance.saveMessages(messages);

		if (result.dialogs.length) {
			result.dialogs.forEach(function(object) {
				const dialog = wrapForDialog(object);
				dialogs.push(dialog);
			});
		}

		dialogs = dialogs.filter(dialog => {
			return (
				((dialog.message || {}).action || {})._ !=
				'messageActionChatMigrateTo'
			);
		});

		AppstoreInstance.saveDialogs(dialogs);

		return dialogs;
	});
};

export const getHistory = (peerID, peerType, maxID, limit = 15, offset = 0) => {
	peerType = peerType === 'user' ? 'user' : 'chat';
	return telegramApi.getHistory({
		id: peerID,
		take: limit,
		type: peerType
	});
};

export const makePasswordHash = password => {
    return getValue('dc2_server_salt').then(salt => {
        let passwordUTF8 = unescape(encodeURIComponent(password));
        var buffer = new ArrayBuffer(passwordUTF8.length);
        var byteView = new Uint8Array(buffer);
        for (var i = 0, len = passwordUTF8.length; i < len; i++) {
            byteView[i] = passwordUTF8.charCodeAt(i);
        }

        buffer = bufferConcat(bufferConcat(salt, byteView), salt);

        return window.CryptoWorker.sha256Hash(buffer);
    })
};

export const setUserAuth = (userAuth) => {
    const dcID = 2;
    const fullUserAuth = Object.assign({dcID}, userAuth);
    return setValue({
        dcID,
        user_auth: fullUserAuth
    }).then(() => {
        document.location.reload();
    });
}