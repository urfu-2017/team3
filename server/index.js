'use strict';

const next = require('next');
const express = require('express');
const bodyParser = require('body-parser');

const setupApiRoutes = require('./routers/api');
const setupPagesRoutes = require('./routers/pages');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const server = express();

app.prepare().then(() => {
    server.use(bodyParser.json());

    setupApiRoutes(server, app);
    setupPagesRoutes(server, app);

    server.listen(3000, () => console.log('Listening on http://localhost:3000'));
});