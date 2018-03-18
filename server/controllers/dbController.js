'use strict';

const dbclient = require('../dbclient');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

exports.getChats = async (req, res) => {
    const chats = await dbclient.getAll('chats')
        .then(response => response.json().map(chat => new Chat(chat)))
        // .then(chats => res.status(200).json(chats))
        .catch(error => res.sendStatus(404));
    const chatsWithLastMessage = chats.map(chat => {
        const lastMessage = await dbclient.getLast(`chats_${chat.id}_messages`)
            .then(response => response.json().map(chat => new Message(chat)))        
            .catch(error => res.sendStatus(404));

        return { chat, lastMessage };
    });

    res.status(200).json(chatsWithLastMessage);
}

exports.getMessage = async (req, res) => {
    await dbclient.getAll(`chats_${req.params.id}_messages`)
        .then(response => res.status(200).json(response.json()))
        .catch(error => res.sendStatus(404));
}

exports.createMessage = async (req, res) => {
    const value = Message.create(req.body.message, req.user.id);
    await dbclient.post(`chats_${req.params.id}_messages`, value)
        .then(response => res.sendStatus(204))
        .catch(error => res.sendStatus(404));
}

exports.getUser = async (req, res) => {
    dbclient.getAll()
}

exports.createChat = async (req, res) => {
    dbclient.post()
}

exports.createUser = async (req, res) => {
    dbclient.post()
}