'use strict';

const connectEnsureLogin = require('connect-ensure-login');

module.exports = (server, app) => {
    server
        .get('/', (req, res) => {
            app.render(req, res, '/index');
        })
        .get('/profile',
            connectEnsureLogin.ensureLoggedIn('/'),
            (req, res) => app.render(req, res, '/profile')
        );
};
