'use strict';

const connectEnsureLogin = require('connect-ensure-login');

const { parse } = require('url');

module.exports = (server, app) => {
    function handleRequest(req, res) {
        const parsedUrl = parse(req.url, true);

        return app.getRequestHandler()(req, res, parsedUrl);
    }

    server
        .get('', connectEnsureLogin.ensureLoggedIn('/auth'),
            (req, res) => {
                app.render(req, res, '/index');
            })
        .get('/', connectEnsureLogin.ensureLoggedIn('/auth'),
            (req, res) => {
                app.render(req, res, '/index');
            })
        .get('/invite/:id', connectEnsureLogin.ensureLoggedIn('/auth'),
            (req, res) => {
                app.render(req, res, '/index');
            })
        .get('/auth', connectEnsureLogin.ensureLoggedOut('/'),
            (req, res) => {
                app.render(req, res, '/auth');
            })
        .get('/_next/*', handleRequest)
        .get('/static/*', handleRequest);
};
