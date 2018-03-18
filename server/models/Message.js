'use strict';

const uuid = require('uuid/v4');

class Message {
    constructor({ id, content, meta }) {
        this.id = id;
        this.content = content;
        this.meta = meta;
    }

    static create(userId, content) {
        return new Message({ 
            id: uuid(),
            content: content,
            meta: {
                author: userId,
                date: Date.now()
            }
        })
    }
}

module.exports = Message;