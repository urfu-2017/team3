const getUrls = require('get-urls');
const got = require('got');
const metascraper = require('metascraper');

module.exports = async function extractMeta(message) {
    const urlsSet = getUrls(message);

    if (urlsSet.size === 0) {
        return {};
    }

    for (const targetUrl of urlsSet) {
        const { body: html, url } = await got(targetUrl);
        const metadata = await metascraper({ html, url });

        return metadata;
    }
};
