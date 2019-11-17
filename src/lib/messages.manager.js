import { getPeerData, getDialog, getUser, getMessage, wrapForMessage, getChat } from '../tl_utils';
import { getHistory as fetchHistory } from './api.manager';
import AppstoreInstance from '../app.store';

export class MessagesManager {
	constructor() {
		this.historiesStorage = [];
		this.messagesStarage = [];
		this.messagesForDialogs = [];
		this.messagesForHistory = {};
		this.dialogsStorage = { count: null, dialogs: [] };
	}

	getHistory(peerID, maxID, limit, backLimit, prerendered) {
		const peerData = getPeerData(Math.abs(peerID));
		if (!peerData) {
			return Promise.reject();
		}

		let historyStorage = this.historiesStorage[peerID];
		let offset = 0;
		let offsetNotFound = false;
		let unreadOffset = false;
		let unreadSkip = false;

		prerendered = prerendered ? Math.min(50, prerendered) : 0;

		if (historyStorage === undefined) {
			historyStorage = this.historiesStorage[peerID] = {
				count: null,
				history: [],
				pending: []
			};
		}

		if (maxID < 0) {
			maxID = 0;
		}

		let isMigrated = false;
		let reqPeerID = peerID;

		if (!limit && !maxID) {
			let foundDialog = this.getDialogByPeerID(peerID)[0];
			if (foundDialog && foundDialog.unreadCount > 1) {
				const unreadCount = foundDialog.unreadCount;

				if ((unreadSkip = unreadCount > 50)) {
					if (foundDialog.readInboxMaxId) {
						maxID = foundDialog.readInboxMaxId;
						backLimit = 16;
						unreadCount = 16;
						limit = 4;
					} else {
						limit = 20;
						unreadOffset = 16;
						offset = unreadCount - unreadOffset;
					}
				} else {
					limit = Math.max(10, prerendered, unreadCount + 2);
					unreadOffset = unreadCount;
				}
			} else {
				limit = 20;
			}
		}

		if (maxID > 0) {
			offsetNotFound = true;
			if (historyStorage.history.some(hst => maxID > hst)) {
				offsetNotFound = false;
			}
		}

		if (
			!offsetNotFound &&
			((historyStorage.count !== null &&
				historyStorage.history.length == historyStorage.count) ||
				historyStorage.history.length >= offset + (limit || 1))
		) {
			if (backLimit) {
				backLimit = Math.min(offset, backLimit);
				offset = Math.max(0, offset - backLimit);
				limit += backLimit;
			} else {
				limit = limit || (offset ? 20 : prerendered || 5);
			}

			let history = historyStorage.history.slice(offset, offset + limit);

			if (!maxID && historyStorage.pending.length) {
				history = historyStorage.pending.slice().concat(history);
			}

			return this.wrapHistoryResult(peerID, {
				count: historyStorage.count,
				history,
				unreadOffset,
				unreadSkip
			});
		}

		if (!backLimit && !limit) {
			limit = prerendered || 20;
		}

		if (offsetNotFound) {
			offset = 0;
		}

		if (
			backLimit ||
			unreadSkip ||
			(maxID && historyStorage.history.indexOf(maxID) == -1)
		) {
			if (backLimit) {
				offset = -backLimit;
				limit += backLimit;
			}
			return this.requestHistory(
				reqPeerID,
				peerData.type,
				maxID,
				limit,
				offset
			).then(historyResult => {
				historyStorage.count =
					historyResult.count || historyResult.messages.length;

				if (isMigrated) {
					historyStorage.count++;
				}

				let history = [];

				if (!maxID && historyStorage.pending.length) {
					history = historyStorage.pending.slice().concat(history);
				}

				return this.wrapHistoryResult(peerID, {
					count: historyStorage.count,
					history,
					unreadOffset,
					unreadSkip
				});
			});
		}

		return this.fillHistoryStorage(
			peerID,
			peerData.type,
			maxID,
			limit,
			historyStorage
		).then(() => {
			offset = 0;

			var history = historyStorage.history.slice(offset, offset + limit);

			if (!maxID && historyStorage.pending.length) {
				history = historyStorage.pending.slice().concat(history);
			}

			return this.wrapHistoryResult(peerID, {
				count: historyStorage.count,
				history,
				unreadOffset,
				unreadSkip
			});
		});
	}

	wrapForHistory(msgID) {
		if (this.messagesForHistory[msgID] !== undefined) {
			return this.messagesForHistory[msgID];
		}

		var message = Object.assign(getMessage(msgID) || {}) || { id: msgID };

		if (message.media && message.media.progress !== undefined) {
			message.media.progress = this.messagesStorage[msgID].media.progress;
		}


		var fromUser =
			message.messageFrom = !message.to_id.chat_id ? getUser(message.from_id) : getChat(message.from_id);
		var fromBot =
			(fromUser && fromUser.pFlags.bot && fromUser.username) || false;
		var withBot =
			fromBot ||
			(message.to_id &&
				(message.to_id.chat_id ||
					(message.to_id.user_id)));

		return (this.messagesForHistory[msgID] = message);
	}

	getDialogByPeerID(peerID) {
		const dialog = this.dialogsStorage.dialogs.find(
			(dialog, index) => dialog.peerID() === peerID
		);

		if (dialog) {
			const index = this.dialogsStorage.dialogs.indexOf(dialog);
			return [dialog, index];
		}

		return null;
	}

	requestHistory(peerID, type, maxID, limit, offset) {
		return fetchHistory(peerID, type, maxID, limit, offset).then(
			response => {
				AppstoreInstance.saveUsers(response.users || []);
				AppstoreInstance.saveChats(response.chats || []);
				AppstoreInstance.saveMessages((response.messages || []).map(msg => wrapForMessage(msg)));
				return response;
			}
		);
	}

	fillHistoryStorage(peerID, type, maxID, fullLimit, historyStorage) {
		var offset = 0;
		return this.requestHistory(peerID, type, maxID, fullLimit, offset).then(
			historyResult => {
				var isMigrated = false;

				historyResult.count =
					historyResult.count || historyResult.messages.length;

				var offset = 0;

				if (!maxID && historyResult.messages.length) {
					maxID = historyResult.messages[0].id + 1;
				}

				let wasTotalCount = historyStorage.history.length;

				if (wasTotalCount) {
					historyStorage.history.splice(
						offset,
						historyStorage.history.length - offset
					);
				}

				(historyResult.messages || []).forEach(message => {
					historyStorage.history.push(message.id);
				});

				var totalCount = historyStorage.history.length;
				fullLimit -= totalCount - wasTotalCount;

				if (fullLimit > 0) {
					maxID = historyStorage.history[totalCount - 1];

					if (isMigrated) {
						if (!historyResult.messages.length) {
							historyStorage.count = totalCount;
							return true;
						}
						return this.fillHistoryStorage(
							peerID,
							type,
							maxID,
							fullLimit,
							historyStorage
						);
					} else if (totalCount < historyStorage.count) {
						return this.fillHistoryStorage(
							peerID,
							type,
							maxID,
							fullLimit,
							historyStorage
						);
					}
				}

				return true;
			}
		);
	}

	wrapHistoryResult(peerID, result) {
		var unreadOffset = result.unreadOffset;
		if (unreadOffset) {
			var i;
			var message;
			for (i = result.history.length - 1; i >= 0; i--) {
				message = this.messagesStarage[result.history[i]];
				if (message && !message.pFlags.out && message.pFlags.unread) {
					result.unreadOffset = i + 1;
					break;
				}
			}
		}
		return Promise.resolve(result);
	}
}

const MessagesManagerInstance = new MessagesManager();

export default MessagesManagerInstance;
