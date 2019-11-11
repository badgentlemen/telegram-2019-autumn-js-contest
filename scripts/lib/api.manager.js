import { getValue, removeValue } from './storage';

export const annihilation = () => {
	removeValue(['user_auth']);
};

export const getContacts = () => {
	return telegramApi.invokeApi('contacts.getContacts', {
		hash: 0
	});
};

export const sendCode = phoneNumber => {
	return Promise.resolve({
		_: 'auth.sentCode',
		pFlags: {
			phone_registered: true
		},
		flags: 3,
		type: {
			_: 'auth.sentCodeTypeApp',
			length: 5
		},
		phone_code_hash: 'f6115c74c4ed106703',
		next_type: {
			_: 'auth.codeTypeSms'
		}
	});

	// return telegramApi.sendCode(phoneNumber);
};

export const logIn = (phoneNumber, phoneCodeHash, smsCode) => {
    return Promise.resolve(true);
	// return telegramApi.signIn(phoneNumber, phoneNumber, smsCode);
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
	return telegramApi.getDialogs(offset, limit).then(function(response) {
		var result = response.result;
		var dialogs = [];
		appStore.saveChats(result.chats || []);
		appStore.saveMessages(result.messages || []);
		appStore.saveUsers(result.users || []);

		if (result.dialogs.length) {
			result.dialogs.forEach(function(dlg) {
				var dialog = wrapForDialog(dlg);
				dialogs.push(dialog);
			});

			dialogs.forEach(function(dialog) {
				var peerID = getPeerID(dialog.peer);
				var message = dialog.message;
				MessageServices.saveMessages([message], peerID);
			});
		}

		appStore.dialogs = dialogs;
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
