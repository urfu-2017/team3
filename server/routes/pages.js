'use strict';

<<<<<<< HEAD
const { parse } = require('url');

module.exports = (server, app) => {
    server
        .get('/', (req, res) => {
            app.render(req, res, '/index')
        })
};
=======
module.exports = (server, app) => {
    server
        .get('/', (req, res) => {
            app.render(req, res, '/index');
        });
};
>>>>>>> add eslint
