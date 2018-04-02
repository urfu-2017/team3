'use strict';

module.exports = (server, app) => {
    server
        .get('/', (req, res) => {
            app.render(req, res, '/index');
        })
        .get('/profile', (req, res) => {
            if (req.user) {
                app.render(req, res, '/profile');
            } else {
                res.redirect('/');
            }
        });
};
