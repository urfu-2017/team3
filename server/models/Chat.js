'use strict';

const mongoose = require('mongoose');

const Message = require('./Message');
const createIdenticon = require('../utils/identicon');

const mongoSchema = new mongoose.Schema({
    title: String,
    type: String,
    members: [{ type: String, ref: 'User' }],
    messages: [Message.schema],
    avatar: String
});

class ChatClass {
    static async findOrCreate({ title, members, type }) {
        if (type === 'private') {
            const chat = await this.findOne({ members });

            if (chat) {
                return chat;
            }
        }

        return await this.create({ title, members, type });
    }

    static setChatInfo(userNickname, chat) {
        if (chat.type === 'group') {
            return chat;
        }

        const interlocutor = chat.members.find(
            member => member.nickname !== userNickname
        );

        chat.avatar = interlocutor.avatar;
        chat.title = interlocutor.nickname;

        return chat;
    }

    static isValid({ members, type }) {
        if (!members) {
            return false;
        }

        /* eslint-disable no-mixed-operators */
        return (type === 'private') && (members.length === 2) ||
               (type === 'group') && (members.length !== 0);
    }
}

/* eslint-disable no-invalid-this */
mongoSchema.pre('save', function () {
    if (this.type === 'group') {
        this.avatar = createIdenticon();
    }

    return this;
});

mongoSchema.loadClass(ChatClass);
const Chat = mongoose.model('Chat', mongoSchema);

module.exports = Chat;
