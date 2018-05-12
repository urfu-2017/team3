'use strict';

const githubAuth = require('../github-authorization');

module.exports = server => {
    server.get(
        '/login',
        githubAuth.authenticate('github')
    );

    server.get(
        '/login/return',
        githubAuth.authenticate('github', { failureRedirect: '/' }),
        (req, res) => {
            res.redirect(req.session.returnTo);
        }
    );

    server.get(
        '/logout',
        (req, res) => {
            req.logout();
            res.redirect('/');
        }
    );
};
