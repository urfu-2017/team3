'use strict';

const fetch = require('node-fetch');

const API_URL = `${process.env.HOST}:${process.env.PORT}/api`;

class User {
    constructor({ id, nickname, avatar }) {
        this.id = id;
        this.nickname = nickname;
        this.avatar = avatar;
    }

    static async findOrCreate({ id, username }) {
        const response = await fetch(`${API_URL}/users/${id}`);

        if (response.status === 404) {
            const newUser = User.create(id, username);

            fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            return newUser;
        }

        return await response.json();
    }

    static async findById(dbclient, id) {
        const response = await dbclient.getLast(`user_${id}`);

        if (response.status === 404) {
            return null;
        }

        return response.json();
    }

    static create(id, githubNickname) {
        const avatarInBase64 = 'TODO';

        return new User({ id, nickname: githubNickname, avatar: avatarInBase64 });
    }

    save(dbclient) {
        return dbclient.postJson(`user_${this.id}`, this);
    }
}

module.exports = User;
