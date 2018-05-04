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
        socket.emit('news', { hello: 'world' });

        socket.on('join', chats => {
            chats.forEach(c => socket.join(c));
        });

        socket.on('message', async data => {
            const { chatId, message } = data;

            // Сохраняем сообщение в монгу
            const msg = await Message.initialize(message);

            await Chat.update(
                { _id: chatId },
                { $push: { messages: msg } }
            );

            // Отправляем сообщение всем юзерам, включая отправителя (для единообразия)
            ws.to(chatId).emit('message', { chatId, message: msg });
        });
    });
}
