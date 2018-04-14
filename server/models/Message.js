'use strict';

const uuid = require('uuid/v4');
const getUrls = require('get-urls');
const got = require('got');
const metascraper = require('metascraper');

class Message {
    constructor(userId, content, meta) {
        this.id = uuid();
        this.content = content;
        this.author = userId;
        this.date = Date.now();
        this.meta = meta;
    }

    static async extractMeta(message) {
        const urlsSet = getUrls(message);

        if (urlsSet.size === 0) {
            return {};
        }

        for (const targetUrl of urlsSet) {
            const { body: html, url } = await got(targetUrl);
            const metadata = await metascraper({ html, url });

            return metadata;
        }
    }

    save(dbclient, chatId) {
        return dbclient.postJson(`chat_${chatId}_messages`, this);
    }
}

module.exports = Message;
