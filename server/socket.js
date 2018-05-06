'use strict';

const Message = require('./models/Message');
const Chat = require('./models/Chat');

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
                await addMember(inviteId, currentUser, senderCallback);

                return;
            }

            await createChat(socket, senderCallback, { title, members, type });
        });

        socket.on('reaction', async data => {
            const { chatId, messageId, reaction } = data;

            await Chat.update(
                {
                    _id: chatId,
                    'messages._id': messageId
                },
                {
                    $inc: { [`messages.$.reactions.${reaction}`]: 1 }
                },
                {
                    $upsert: true,
                    $new: true
                }
            );

            const updatedChat = await Chat.findOne(
                {
                    _id: chatId,
                    'messages._id': messageId
                }
            );
            // туду: не умеем получать отдельное сообщение из массива
            const message = updatedChat.messages.find(m => m._id.toString() === messageId);

            ws.to(chatId).emit('update_message', { chatId, message });
        });
    });

    async function addMember(inviteId, currentUser, senderCallback) {
        let chat = await Chat.findOne({ inviteId });

        if (!chat.members.find(m => m === currentUser)) {
            chat = await Chat.findOneAndUpdate({ _id: chat.id },
                { $push: { members: currentUser } },
                { new: true });
        }

        senderCallback(chat);
    }

    async function createChat(socket, senderCallback, { title, members, type }) {
        const chat = await Chat.create({ title, members, type });
        const [, ...other] = members;

        senderCallback(chat);
        other.forEach(member => socket.to(member).emit('chat', chat));
    }
};
