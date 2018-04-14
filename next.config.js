'use strict';

/* eslint-disable no-undef */

const withCSS = require('@zeit/next-css');

module.exports = withCSS({
    useFileSystemPublicRoutes: false,
    webpack(config, { dev }) {
        if (dev) {
            config.devtool = 'cheap-module-eval-source-map';
        }

        return config;
    }
});
