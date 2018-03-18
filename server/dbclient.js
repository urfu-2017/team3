'use strict'

const headers = { 'Authorization': process.env.DATABASE_API_TOKEN };
const dbUrl = process.env.DATABASE_APIgetAllUrl;

const url = require('url');
const fetch = require('node-fetch');

exports.put = (key, value) => {
    let putHeaders = Object.assign({'Content-Type': 'plain/text'}, headers);
    return fetch(`${dbUrl}/${key}`, {
        method: 'PUT',
        headers: putHeaders,
        body: value
    });
};

exports.post = (key, value) => {
    let postHeaders = Object.assign({'Content-Type': 'plain/text'}, headers);
    return fetch(`${dbUrl}/${key}`, {
        method: 'POST',
        headers: postHeaders,
        body: value
    });
};

exports.getLast = (key) => {
    return fetch(`${dbUrl}/${key}`, {
        method: 'GET',
        headers
    })
};

exports.getAll = (key, options) => {
    let getAllUrl = url.parse(`${dbUrl}/${key}/all`);
    getAllUrl['query'] = options;
    url.format(getAllUrl);
    return fetch(dbUrl, {
        method: 'GET',
        headers
    });
};

exports.delete = (key) => {
    return fetch(`${dbUrl}/${key}`, {
        method: 'DELETE',
        headers
    });
};
