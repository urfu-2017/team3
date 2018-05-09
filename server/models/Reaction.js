'use strict';

const mongoose = require('mongoose');

const mongoSchema = new mongoose.Schema({
    emojiName: String,
    users: [String]
}, { minimize: false });

class ReactionClass {
    static initialize({ emojiName, user }) {
        return {
            _id: mongoose.Types.ObjectId(),
            emojiName,
            users: [user]
        };
    }
}

mongoSchema.loadClass(ReactionClass);

module.exports = mongoose.model('Reaction', mongoSchema);
