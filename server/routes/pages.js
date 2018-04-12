'use strict';

const connectEnsureLogin = require('connect-ensure-login');

const { parse } = require('url');

module.exports = (server, app) => {
    function handleRequest(req, res) {
        const parsedUrl = parse(req.url, true);

        return app.getRequestHandler()(req, res, parsedUrl);
    }

    server
        .get('', (req, res) => {
            app.render(req, res, '/index');
        })
        .get('/', (req, res) => {
            app.render(req, res, '/index');
        })
        .get('/profile',
            connectEnsureLogin.ensureLoggedIn('/'),
            (req, res) => app.render(req, res, '/profile')
        )
        .get('/im', (req, res) => {
            app.render(req, res, '/im');
        })
        .get('/_next/*', handleRequest)
        .get('/static/*', handleRequest);
};
