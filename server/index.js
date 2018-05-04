'use strict';

require('dotenv').config();

const next = require('next');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');

const setupPagesRoutes = require('./routes/pages');
const setupApiRoutes = require('./routes/api');
const setupAuthRoutes = require('./routes/auth');
const passport = require('./github-authorization');

mongoose.connect(process.env.DATABASE_CONNECTION_STRING);

cloudinary.config({
    'cloud_name': 'team3',
    'api_key': process.env.CLOUDINARY_API_KEY,
    'api_secret': process.env.CLOUDINARY_API_SECRET
});

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const server = require('./server');
const httpServer = require('http').Server(server);
const io = require('socket.io')(httpServer);

const Message = require('./models/Message');
const Chat = require('./models/Chat');

app.prepare().then(() => {
    server.use(expressSession({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));

    server.use(passport.initialize());
    server.use(passport.session());

    setupAuthRoutes(server);
    setupPagesRoutes(server, app);
    setupApiRoutes(server);
    setupSocket(io);

    httpServer.listen(parseInt(process.env.PORT, 10), () =>
        console.log(`Listening on ${process.env.HOST}:${process.env.PORT}`));

});

function setupSocket(ws) {
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
                    senderCallback(); // Ничего не возращаем, если чат уже сущесвтует

                    return;
                }
            }

            // Создаём чат и делаем populate members
            const chat = await Chat.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId() },
                { title, members, type },
                {
                    new: true,
                    upsert: true,
                    populate: ['members']
                });

            const [, ...other] = members;

            senderCallback(chat);
            other.forEach(member => socket.to(member).emit('chat', chat));
        });
    });
}
