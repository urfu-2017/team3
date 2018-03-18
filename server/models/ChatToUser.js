'use strict';

class ChatToUser {
    constructor(chatId, userId) {
        this.chatId = chatId;
        this.userId = userId;
    }

    save(dbclient) {
        return dbclient.postJson(`chatToUserMap`, this);
    }

}

module.exports = ChatToUser;
