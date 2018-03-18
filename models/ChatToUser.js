'use strict';

class ChatToUser {
    constructor({ chatId, userId }) {
        this.chatId = chatId;
        this.userId = userId;
    }
}

module.exports = ChatToUser;