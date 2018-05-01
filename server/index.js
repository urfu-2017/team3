'use strict';

require('dotenv').config();

const next = require('next');
const expressSession = require('express-session');
const mongoose = require('mongoose');

const setupPagesRoutes = require('./routes/pages');
const setupApiRoutes = require('./routes/api');
const setupAuthRoutes = require('./routes/auth');
const passport = require('./github-authorization');

mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const server = require('./server');
const httpServer = require('http').Server(server);
const io = require('socket.io')(httpServer);

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
    });
}
