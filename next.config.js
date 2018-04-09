'use strict';

const withCSS = require('@zeit/next-css')

// Дополнительная настройка Next.js
// Позволяет использовать css
// Подробнее: https://github.com/zeit/next-plugins/tree/master/packages/next-css
module.exports = withCSS({ useFileSystemPublicRoutes: false });