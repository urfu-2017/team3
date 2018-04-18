// Модификация компонента Document из Next.js
// Используется для того, чтобы подключить css файл
//
// Подробнее: https://github.com/zeit/next-plugins/tree/master/packages/next-css

import Document, { Head, Main, NextScript } from 'next/document';

/* eslint-disable react/react-in-jsx-scope */

export default class MyDocument extends Document {
    render() {
        return (
            <html>
                <Head>
                    <link rel="stylesheet" href="/_next/static/style.css" />
                    <link rel="shortcut icon" href="/static/favicon.png" type="image/png" />
                    <link
                        href="https://fonts.googleapis.com/css?family=Noto+Sans:400,700&amp;subset=cyrillic"
                        rel="stylesheet"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
