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
    const meta = Message.extractMeta(req.body.message);
    const message = new Message(req.user.id, req.body.message, meta);

    try {
        await message.save(dbclient, req.params.id);
        res.json(message);
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

/* eslint-disable-next-line max-statements */
async function createChat(req, res) {
    try {
        const userChats = await Chat.getAll(dbclient, req.user.id.toString());
        const interlocutorId = req.body.interlocutorId.toString();
        const existsChat = userChats.find(c => c.members.includes(interlocutorId));

        if (existsChat) {
            return res.status(200).json(existsChat);
        }
        const interlocutor = await User.findById(dbclient, req.body.interlocutorId);

        if (!interlocutor) {
            return res.sendStatus(404);
        }

        const currentUserChat = await createBothChats(req.user, interlocutor, req.body.title);

        res.status(200).json(currentUserChat);
    } catch (e) {
        res.sendStatus(400);
    }
}

async function createBothChats(user, interlocator, title) {
    const chatId = uuid();
    const firstUserChat = new Chat({
        id: chatId,
        title: title || interlocator.nickname,
        members: [user.id, interlocator.id]
    });
    const interlocutorChat = new Chat({
        id: chatId,
        title: user.nickname,
        members: [user.id, interlocator.id]
    });

    await Promise.all([
        firstUserChat.save(dbclient, user.id),
        interlocutorChat.save(dbclient, interlocator.id)]);

    return firstUserChat;
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
