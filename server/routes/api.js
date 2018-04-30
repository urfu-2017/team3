'use strict';

const dbController = require('../controllers/dbController');

module.exports = server => {
    server.route('/api/chats')
        .get(dbController.getChats)
        .post(dbController.createChat);

    server.patch('/api/chats/:id/avatar', dbController.updateChatAvatar);
    server.patch('/api/chats/:id/title', dbController.updateChatTitle);

    server.route('/api/chats/:id/messages')
        .get(dbController.getMessages)
        .post(dbController.createMessage);

    server.route('/api/chats/:id/members/:nickname')
        .delete(dbController.deleteUserFromChat)
        .post(dbController.addUserToChat);

    server.route('/api/users/:nickname')
        .get(dbController.getUser)
        .post(dbController.createUser);
    server.patch('/api/users/:nickname/avatar', dbController.updateUserAvatar);
};
