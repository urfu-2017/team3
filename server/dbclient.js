'use strict';

const headers = { 'Authorization': process.env.DATABASE_API_TOKEN };
const dbUrl = process.env.DATABASE_API_URL;

const url = require('url');
const fetch = require('node-fetch');

exports.put = (key, value) => {
    const putHeaders = Object.assign({ 'Content-Type': 'plain/text' }, headers);

    return fetch(`${dbUrl}/${key}`, {
        method: 'PUT',
        headers: putHeaders,
        body: value
    });
};

exports.post = (key, value) => {
    const postHeaders = Object.assign({ 'Content-Type': 'plain/text' }, headers);

    return fetch(`${dbUrl}/${key}`, {
        method: 'POST',
        headers: postHeaders,
        body: value
    });
};

exports.getLast = key => fetch(`${dbUrl}/${key}`, {
    method: 'GET',
    headers
});

exports.getAll = (key, options) => {
    const getAllUrl = url.parse(`${dbUrl}/${key}/all`);

    getAllUrl.query = options;
    url.format(getAllUrl);

    return fetch(dbUrl, {
        method: 'GET',
        headers
    });
};

exports.delete = key => fetch(`${dbUrl}/${key}`, {
    method: 'DELETE',
    headers
});
