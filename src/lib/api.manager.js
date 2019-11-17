import { getValue, removeValue, setValue } from './storage';
import AppstoreInstance from '../app.store';
import {
	wrapForDialog,
	wrapForMessage,
    makePasswordHash
} from '../tl_utils';

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

export const checkPasswordRequest = (password_hash) => {
    return telegramApi.invokeApi('auth.checkPassword', {
        password_hash
    })
}

export const checkPasswordTL = (password) => {
    return makePasswordHash(password).then(password_hash => {
        return checkPasswordRequest(password_hash).then(result => {
            return setUserAuth({
                id: result.user.id
            });
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
	}).catch(error => {
        document.location.reload();
    })
};

export const signUpTL = (phoneNumber, phoneCodeHash, phoneCode, firstName, lastName = '') => {
    return telegramApi.signUp(phoneNumber, phoneCodeHash, phoneCode, firstName, lastName);
}

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