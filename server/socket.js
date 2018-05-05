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
            const { title, type, members } = data;

            if (type === 'private') {
                const chat = await Chat.findOne({
                    members,
                    type: 'private'
                });

                if (chat) {
                    senderCallback(null, chat._id); // Возвращем id существующего чата, если он есть

                    return;
                }
            }

            const chat = await Chat.create({ title, members, type });

            const [, ...other] = members;

            senderCallback(chat);
            other.forEach(member => socket.to(member).emit('chat', chat));
        });
    });
};
