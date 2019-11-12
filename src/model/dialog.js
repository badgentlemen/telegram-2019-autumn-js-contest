import {PeerTypeCollection, isPeerNotificationMuted, getPeerID, onlineStatus, dateOrTimeFilter} from "../tl_utils";
import {tsNow} from "../utils";


export default class Dialog {
    constructor(object) {
        this.peer = object.peer;
        const key = this.peer._;
        this.idPreffix = 'user_id';
        this.id = 0;
        this.target = 'chats';
        this.type = 'user';
        this.peerType = PeerTypeCollection.find(function(peerType) {
            return peerType.key === key;
        });

        if (this.peerType) {
            this.idPreffix = this.peerType.value;
            this.id = this.peer[this.idPreffix];
            this.target = this.peerType.target;
            this.type = this.peerType.type;
        }

        this.pFlags = object.pFlags || {};

        this.isPinned = this.pFlags.pinned || false;
        this.flags = object.flags || 0;

        this.readInboxMaxId = object['read_inbox_max_id'] || 0;
        this.readOutboxMaxId = object['read_outbox_max_id'] || 0;

        this.unreadCount = object['unread_count'] || 0;
        this.unreadMentionsCount = object['unread_mentions_count'] || 0;

        this.notifySettings = object['notify_settings'] || {};

        this.isMuted = isPeerNotificationMuted(this.notifySettings);



        //
        // var message =
        //     AppstoreInstance.messages.find(function(message) {
        //         var toId = message.to_id;
        //         return toId[id_preffix] === id;
        //     }) || {};
        // dialog.message = message;

        // dialog.peerData = collectionTarget.find(function(target) {
        //     return target.id === id;
        // });

        // dialog.onlineStatus = onlineStatus(dialog.peerData);
        // dialog.isOnline = dialog.onlineStatus.statusType === 'userStatusOnline';
        // dialog.title = getTitleForPeerData(dialog.peerData);
        // dialog.hasAvatar = dialog.peerData.photo !== undefined;

        // if (message['from_id'] > 0) {
        //     dialog.peerID = message['from_id'];
        //     dialog.foundHistory = true;
        // }
    }

    hasUnread() {
        return this.unreadCount > 0 && !this.pFlags.out && !this.isPinned
    }

    setMessage(message) {
        this.message = message || {};
        this.message.dateText = dateOrTimeFilter(this.message.date);
    }

    setPeerData(peerData) {
        this.peerData = peerData;
        this.hasAvatar = this.peerData.photo !== undefined;
        this.updateOnlineStatus();
    }

    setTitle(title) {
        this.title = title;
    }

    updateOnlineStatus() {
        this.onlineStatus = onlineStatus(this.peerData);
        this.isOnline = this.onlineStatus.statusType === 'userStatusOnline';
    }

    peerID() {
        return getPeerID(this.peer);
    }
 }


