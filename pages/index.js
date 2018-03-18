// Страница конкретной заметки
// Например /notes/Books

// Компонент-ссылка для переходов между страницами без перезагрузки страницы
const fetch = require('node-fetch')
import Link from 'next/link';
import React, { Component, Fragment } from 'react';

export default class NotePage extends Component {
    // Метод Next.js, который выполнится для того чтобы получить данные необходимые для страницы
    // и передаст их в props
    // Выполнится как и на сервере, так и в браузере
    // Может быть объявлен ТОЛЬКО в страницах
    // Подробнее: https://github.com/zeit/next.js/#fetching-data-and-component-lifecycle

    render() {
        return (
            <h1>Hello world</h1>
        );
    }
}