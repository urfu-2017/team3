'use strict';

const sanitizeHtml = require('sanitize-html');
const extractMeta = require('../utils/metaExtractor');
const Reaction = require('./Reaction');
const mongoose = require('mongoose');

const mongoSchema = new mongoose.Schema({
    author: {
        type: String,
        ref: 'User',
        index: true
    },
    text: String,
    meta: {},
    reactions: [Reaction.schema],
    attachments: [String],
    date: {
        type: Date,
        index: true
    }
}, { minimize: false });

class MessageClass {
    static async initialize({ author, text, attachments }) {
        const meta = await extractMeta(text);

        return {
            _id: mongoose.Types.ObjectId(),
            author,
            date: new Date(),
            meta,
            text: processMarkdownAndSanitize(text),
            reactions: [],
            attachments: attachments || []
        };
    }
}

function processMarkdownAndSanitize(text) {
    return sanitizeHtml(text, {
        allowedTags: ['p', 'strong', 'em', 'a', 'code'],
        allowedAttributes: {
            'a': ['href']
        }
    });
}

mongoSchema.loadClass(MessageClass);
const Message = mongoose.model('Message', mongoSchema);

module.exports = Message;
