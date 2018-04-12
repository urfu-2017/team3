'use strict';

/* eslint-disable capitalized-comments */

require('dotenv').config();

const next = require('next');
const expressSession = require('express-session');

const setupPagesRoutes = require('./routes/pages');
const setupApiRoutes = require('./routes/api');
const setupAuthRoutes = require('./routes/auth');
const passport = require('./github-authorization');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const server = require('./server');

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

    server.listen(parseInt(process.env.PORT, 10), () =>
        console.log(`Listening on ${process.env.HOST}:${process.env.PORT}`));
});
