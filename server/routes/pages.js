'use strict';

module.exports = (server, app) => {
    server
        .get('/', (req, res) => {
            app.render(req, res, '/index');
        });
};
