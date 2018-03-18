'use strict';

const uuid = require('uuid/v4');

class Chat {
    constructor({ id, meta, messageIds }) {
        this.id = id;
        this.meta = meta;
        this.messageIds = messageIds;
    }

    static create() {
        return new Chat({
            id: uuid(),
            meta: {
                createTime: Date.now()
            },
            messageIds = []
        })
    }
}

module.exports = Chat;