'use strict';

export class ChatSettings {
    constructor(chatId) {
        this.chatId = chatId;
    }

    switchNotifications(enable) {
        set(this.chatId, 'notifications', enable ? '1' : '0');
    }

    notificationsEnabled() {
        const value = get(this.chatId, 'notifications');

        return !value || value === '1'; // default is on
    }
}

function set(key, subkey, value) {
    localStorage.setItem(`${key}_${subkey}`, value);
}

function get(key, subkey) {
    return localStorage.getItem(`${key}_${subkey}`);
}
