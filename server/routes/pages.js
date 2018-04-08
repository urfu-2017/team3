'use strict';

const connectEnsureLogin = require('connect-ensure-login');

module.exports = (server, app) => {
    server
        .get('/', (req, res) => {
            app.render(req, res, '/index');
        })
        .get('/static', (req, res) => {
            app.render(req, res, '../static/');
        })
        .get('/profile',
            connectEnsureLogin.ensureLoggedIn('/'),
            (req, res) => app.render(req, res, '/profile')
        )
        .get('/im', (req, res) => {
            app.render(req, res, '/im');
        });
};
