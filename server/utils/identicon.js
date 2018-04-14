'use strict';

const Identicon = require('identicon.js');
const uuid = require('uuid/v4');

module.exports = function createIdenticon() {
    const options = {
        margin: 0.1,
        size: 100,
        format: 'svg'
    };
    const hash = uuid();
    const identicon = new Identicon(hash, options);
    const rawSvg = identicon.toString(true);
    const base64 = Buffer.from(rawSvg, 'binary').toString('base64');

    return base64;
};
