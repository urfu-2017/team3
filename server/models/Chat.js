'use strict';

const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const Message = require('./Message');
const createIdenticon = require('../utils/identicon');

const mongoSchema = new mongoose.Schema({
    title: String,
    type: String,
    members: [{ type: String, ref: 'User' }],
    messages: [Message.schema],
    avatar: String,
    inviteId: String
}, { minimize: false, timestamps: true });

function getRandomString() {
    return Math.random().toString(36)
        .substring(2, 15) + Math.random().toString(36)
        .substring(2, 15);
}

class ChatClass {
    static async findOrCreate({ title, members, type }) {
        if (type === 'private') {
            const chat = await this.findOne({
                members,
                type: 'private'
            }).populate('members');

            if (chat) {
                return chat;
            }
        }

        return await this.create({ title, members, type });
    }

    /* eslint-disable camelcase */
    static async create(chat) {
        if (chat.type === 'group') {
            const avatarInBase64 = createIdenticon();

            const { secure_url } = await cloudinary.v2
                .uploader.upload(`data:image/png;base64,${avatarInBase64}`);

            chat.avatar = secure_url;
            chat.inviteId = getRandomString().substring(0, 5);
        }

        return await this.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId() },
            chat,
            {
                new: true,
                upsert: true,
                populate: ['members']
            });

    }
    /* eslint-enable camelcase */

    static isValid({ members, type }) {
        if (!members) {
            return false;
        }

        /* eslint-disable no-mixed-operators */
        return (type === 'private') && (members.length === 2) ||
            (type === 'group') && (members.length !== 0);
    }
}

mongoSchema.loadClass(ChatClass);
const Chat = mongoose.model('Chat', mongoSchema);

module.exports = Chat;
