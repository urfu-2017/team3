'use strict';

const dbclient = require('../dbclient');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const uuid = require('uuid/v4');

async function getChats(req, res) {
    try {
        const chats = await Chat.getAll(dbclient, req.user.id);

        res.status(200).json(chats);
    } catch (e) {
        res.sendStatus(400);
    }
}

async function getMessages(req, res) {
    try {
        const chatMessages = await dbclient.getAll(`chat_${req.params.id}_messages`);

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
        if (!await User.exists(req.body.interlocutorId)) {
            res.sendStatus(404);

            return;
        }

        const chatId = uuid();
        const currentUserChat = new Chat(chatId, req.body.title);
        const interlocutorChat = new Chat(chatId, req.user.nickname);

        await Promise.all([
            currentUserChat.save(dbclient, req.user.id),
            interlocutorChat.save(dbclient, req.body.interlocutorId)]);

        res.sendStatus(201);
    } catch (e) {
        res.sendStatus(400);
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
