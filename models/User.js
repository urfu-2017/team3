'use strict';

class User {
    constructor({ id, nickname, avatar }) {
        this.id = id;
        this.nickname = nickname;
        this.avatar = avatar;
    }
}

module.exports = User;