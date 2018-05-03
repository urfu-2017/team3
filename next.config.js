'use strict';

/* eslint-disable no-undef */

const withCSS = require('@zeit/next-css');
const MergeFilesPlugin = require('merge-files-webpack-plugin');

module.exports = withCSS({
    useFileSystemPublicRoutes: false,
    webpack(config, options) {
        const { isServer, dev } = options;

        if (!isServer) {
            // Merge all CSS in one file
            options.extractCSSPlugin.filename = 'static/[name].css';
            config.plugins.push(
                new MergeFilesPlugin({
                    filename: 'static/style.css',
                    test: /\.css/,
                    deleteSourceFiles: true
                })
            );
        }

        if (dev) {
            config.devtool = 'cheap-module-eval-source-map';
        }

        return config;
    }
});
