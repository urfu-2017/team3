'use strict';

const uuid = require('uuid/v4');

class Message {
    constructor(userId, content) {
        this.id = uuid();
        this.content = content;
        this.meta = {
            author: userId,
            date: Date.now()
        };
    }

    save(dbclient, chatId) {
        return dbclient.postJson(`chats_${chatId}_messages`, this);
    }
}

module.exports = Message;
