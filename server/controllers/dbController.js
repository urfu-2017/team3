'use strict';

const dbclient = require('../dbclient');
const Chat = require('../models/Chat');
const ChatToUser = require('../models/ChatToUser');
const Message = require('../models/Message');
const User = require('../models/User');

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
    const message = new Message(req.user.id, req.body.message);

    try {
        await message.save(dbclient, req.params.id);
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(404);
    }
}

async function getUser(req, res) {
    try {
        const user = await User.findById(dbclient, req.params.id);

        if (user === null) {
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
        const user = users.find(u => u.nickname === req.params.nick);
        const chat = new Chat();

        chat.save(dbclient);
        new ChatToUser(chat.id, user.id).save(dbclient);
        new ChatToUser(chat.id, req.user.id).save(dbclient);
        res.sendStatus(201);
    } catch (e) {
        res.sendStatus(404);
    }
}

async function createUser(req, res) {
    if (req.body === undefined) {
        res.status(400).send('empty body');

        return;
    }

    try {
        const newUser = new User(req.body);
        const response = await newUser.save(dbclient);

        res.sendStatus(response.status);
    } catch (err) {
        res.sendStatus(500);
    }
}

module.exports = { getChats, getMessages, createMessage, getUser, createChat, createUser };
