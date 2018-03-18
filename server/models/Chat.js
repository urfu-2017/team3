'use strict';

const uuid = require('uuid/v4');

class Chat {
    constructor() {
        this.id = uuid();
        this.meta = {
            createTime: Date.now()
        };
        this.messageIds = [];
    }

    save(dbclient) {
        return dbclient.postJson('chats', this);
    }
}

module.exports = Chat;
