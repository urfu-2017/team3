'use strict';

const uuid = require('uuid/v4');

class Message {
    constructor(userId, content) {
        this.id = uuid();
        this.content = content;
        this.author = userId;
        this.date = Date.now();
        this.meta = { };
    }

    save(dbclient, chatId) {
        return dbclient.postJson(`chat_${chatId}_messages`, this);
    }
}

module.exports = Message;
