'use strict';

const dbclient = require('../dbclient');
const Chat = require('../models/Chat');
const ChatToUser = require('../models/ChatToUser');
const Message = require('../models/Message');

async function getChats(req, res) {
    try {
        const chatToUserMap = await dbclient.getAll('chatToUserMap');
        const userChatIds = chatToUserMap
            .filter(chatToUser => chatToUser.userId === req.user.id)
            .map(chatToUser => chatToUser.chatId);

        const chats = (await dbclient.getAll('chats'))
            .filter(chat => userChatIds.includes(chat.id));

        const chatsWithLastMessage = await Promise.all(chats.map(chat => {
            return {
                chat,
                lastMessage: dbclient.getLast(`chats_${chat.id}_messages`)
            };
        }));

        res.status(200).json(chatsWithLastMessage);
    } catch (e) {
        res.sendStatus(404);
    }
}

async function getMessages(req, res) {
    try {
        const chatMessages = await dbclient.getAll(`chats_${req.params.id}_messages`);

        res.status(200).json(chatMessages);
    } catch (e) {
        res.sendStatus(404);
    }
}

async function createMessage(req, res) {
    const message = new Message(req.body.message, req.user.id);

    try {
        await message.save(dbclient, req.params.chatId);
    } catch (e) {
        res.sendStatus(404);
    }
}

async function getUser(req, res) {
    try {
        const users = await dbclient.getAll('users');
        const user = users.find(u => u.id === req.params.id);

        if (!user) {
            res.sendStatus(404);

            return;
        }

        res.status(200).json(user);
    } catch (e) {
        res.sendStatus(404);
    }
}

async function createChat(req, res) {
    try {
        const users = await dbclient.getAll('users');
        const user = users.find(u => u.nick === req.params.nick);
        const chat = new Chat();

        chat.save();
        new ChatToUser(chat.id, user.id).save(dbclient);
        new ChatToUser(chat.id, req.user.id).save(dbclient);
        res.sendStatus(201);
    } catch (e) {
        res.sendStatus(404);
    }
}

// eslint-disable-next-line no-warning-comments
// TODO после авторизиции
// Exports.createUser = async (req, res) => {
// Dbclient.post();
// };

module.exports = { getChats, getMessages, createMessage, getUser, createChat };
