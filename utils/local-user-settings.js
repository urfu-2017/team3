'use strict';

export default class ChatSettings {
    constructor(chatId) {
        this.chatId = chatId;
    }

    switchNotifications(enable) {
        set(this.chatId, 'notifications', enable ? '1' : '0');
    }

    notificationsEnabled() {
        return get(this.chatId, 'notifications') === '1';
    }
}

function set(key, subkey, value) {
    localStorage.setItem(`${key}_${subkey}`, value);
}

function get(key, subkey) {
    return localStorage.getItem(`${key}_${subkey}`);
}
