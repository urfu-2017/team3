'use strict';

const Message = require('./models/Message');
const Reaction = require('./models/Reaction');
const Chat = require('./models/Chat');
const User = require('./models/User');

module.exports = function setupSocket(ws) {
    ws.on('connection', socket => {
        socket.on('join', rooms => {
            rooms.forEach(room => socket.join(room));
        });

        socket.on('message', async (data, senderCallback) => {
            const { chatId, message } = data;

            const msg = await Message.initialize(message);

            await Chat.update(// Сохраняем сообщение в монгу
                { _id: chatId },
                { $push: { messages: msg } }
            );

            // Отправляем сообщение отправителю
            senderCallback({ chatId, message: msg });
            // Отправляем сообщение всем отстальным юзерам в конфе
            socket.to(chatId).emit('message', { chatId, message: msg });
        });

        socket.on('chat', async (data, senderCallback) => {
            // members - список пользователей без создателя чата

            const { title, type, members, inviteId, currentUser } = data;

            if (type === 'private') {
                const chat = await Chat.findOne({
                    members: { $all: members },
                    type: 'private'
                });

                if (chat) {
                    senderCallback(null, chat._id); // Возвращем id существующего чата, если он есть

                    return;
                }
            }

            if (inviteId) {
                await addMember({ inviteId, currentUser, senderCallback, socket });

                return;
            }

            await createChat(socket, senderCallback, { title, members, type });
        });

        socket.on('battery', async ({ userNickname, battery }) => {
            await User.findOneAndUpdate(
                { _id: userNickname },
                { $set: { battery } }
            );

            socket.broadcast.emit('battery', { userNickname, battery });
        });

        socket.on('reaction', async data => {
            const { chatId, messageId, reaction: emojiName, userName } = data;

            const message = await updateReaction(chatId, { messageId, emojiName, userName });

            ws.to(chatId).emit('update_message', { chatId, message });
        });

        const destructIds = {};

        socket.on('destruct_message', ({ chatId, messageId, selfDestructTimer }) => {
            if (messageId in destructIds) {
                return;
            }

            setTimeout(async () => {
                await Chat.update(
                    { _id: chatId },
                    { $pull: { messages: { _id: messageId } } });

                ws.to(chatId).emit('destruct_message', { chatId, messageId });
                delete destructIds[messageId];
            }, selfDestructTimer);
        });
    });

    async function addMember({ inviteId, currentUser, senderCallback, socket }) {
        let chat = await Chat.findOne({ inviteId });

        if (!chat.members.find(m => m === currentUser)) {
            chat = await Chat.findOneAndUpdate({ _id: chat.id },
                { $push: { members: currentUser } },
                {
                    new: true,
                    populate: ['members']
                });
        }

        senderCallback(chat);
        socket.to(chat._id).emit('update_chat',
            {
                _id: chat._id,
                members: chat.members
            });
    }

    async function createChat(socket, senderCallback, { title, members, type }) {
        const membersFromDb = await User.find({ _id: { $in: members } });

        if (membersFromDb.length !== members.length) {
            return;
        }

        const chat = await Chat.create({ title, members, type });
        const [, ...other] = members;

        senderCallback(chat);
        other.forEach(member => socket.to(member).emit('chat', chat));
    }

    /* eslint-disable max-statements */
    async function updateReaction(chatId, { messageId, emojiName, userName }) {
        const chat = await Chat.findOne({ _id: chatId });
        const message = chat.messages.find(m => m.id === messageId);
        const reaction = message.reactions.find(r => r.emojiName === emojiName);

        if (reaction) {
            if (reaction.users.find(u => u === userName)) {
                reaction.users.remove(userName);
            } else {
                reaction.users.push(userName);
            }

            if (reaction.users.length === 0) {
                message.reactions = message.reactions.remove(reaction);
            }
        } else {
            message.reactions.push(Reaction.initialize({ emojiName, user: userName }));
        }

        await chat.save();

        return message;
    }
};
