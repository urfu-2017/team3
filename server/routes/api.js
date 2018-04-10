'use strict';

const dbController = require('../controllers/dbController');

module.exports = server => {
    server.get('/api/chats', dbController.getChats);
    server.post('/api/chats/:nick', dbController.createChat);

    server.route('/api/chats/:id/messages')
        .get(dbController.getMessages)
        .post(dbController.createMessage);

    server.get('/api/users/:id', dbController.getUser);
    server.post('/api/users', dbController.createUser);
};
