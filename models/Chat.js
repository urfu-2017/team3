'use strict';

export default class Chat {
    constructor(chat) {
        Object.assign(this, chat);
    }

    getLastMessage() {
        if (this.members.length) {
            return this.messages[this.messages.length - 1];
        }
    }

    getAvatarFor(user) {
        return this.avatar || this.getInterlocutorFor(user).avatar;
    }

    getTitleFor(user) {
        return this.title || this.getInterlocutorFor(user).nickname;
    }

    getInterlocutorFor(user) {
        let [interlocutor] = this.members.filter(m => m.nickname !== user.nickname);

        return interlocutor || user;
    }

    getContactFor(user) {
        if (this.type !== 'private') {
            return null;
        }

        const contact = this.getInterlocutorFor(user);

        return contact === user ? null : contact;
    }
}
