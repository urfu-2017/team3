'use strict';

const { markdown } = require('markdown');
const sanitizeHtml = require('sanitize-html');
const extractMeta = require('../utils/metaExtractor');
const mongoose = require('mongoose');

const mongoSchema = new mongoose.Schema({
    author: {
        type: String,
        ref: 'User',
        index: true
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    },
    text: String,
    meta: {
        type: Object,
        default: null
    },
    attachmentsIds: [mongoose.Schema.Types.ObjectId]
});

class MessageClass {
    static async initialize({ author, text }) {
        const meta = await extractMeta(text);

        return {
            author,
            meta,
            data: Date.now(),
            text: processMarkdownAndSanitize(text)
        };
    }
}

function processMarkdownAndSanitize(text) {
    const html = markdown.toHTML(text);
    const santizedHtml = sanitizeHtml(html, {
        allowedTags: ['p', 'strong', 'em', 'a', 'code'],
        allowedAttributes: {
            'a': ['href']
        } });

    return santizedHtml;
}

mongoSchema.loadClass(MessageClass);
const Message = mongoose.model('Message', mongoSchema);

module.exports = Message;
