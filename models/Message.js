'use strict';

export default class Message {
    constructor(message) {
        Object.assign(this, message);
    }

    hasMention(user) {
        return this.text && this.text.includes(`@${user.nickname}`);
    }
}
