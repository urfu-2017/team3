'use strict';

class Chat {
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.date = Date.now();
    }

    save(dbclient, userId) {
        return dbclient.postJson(`user_${userId}_chats`, this);
    }

    static getAll(dbclient, userId) {
        return dbclient.getAll(`user_${userId}_chats`);
    }
}

module.exports = Chat;
