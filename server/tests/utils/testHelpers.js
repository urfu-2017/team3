const setupApiRoutes = require('../../routes/api');
const server = require('../../server');

function setupServer(currentUser = 'user') {
    server.use((req, res, next) => {
        req.user = { nickname: currentUser };
        next();
    });

    setupApiRoutes(server);
    server.listen(8080);

    return server;
}

module.exports = { setupServer };
