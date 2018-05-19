'use strict';

import Chat from '../models/Chat';
import Message from '../models/Message';

const NEWMSG_SOUND_URL = '/static/newmsg.wav';
const NEWMSG_VIBRATION_PATTERN = [100, 100, 100];

/* eslint-disable-next-line import/prefer-default-export */
export const notifyMessage = ({ message, chat, user, activeChat, onclick }) => {
    chat = new Chat(chat);
    message = new Message(message);

    if (!needNotifyAboutMessage({ message, chat, user, activeChat })) {
        return;
    }

    notifySound(NEWMSG_SOUND_URL);
    notifyVibration(NEWMSG_VIBRATION_PATTERN);
    if (document.hidden) {
        const options = prepareNotificationOptions({ message, chat, user });

        notifyScreen({ ...options, onclick });
    }
};

function notifySound(soundUrl) {
    if ('Audio' in window) {
        new Audio(soundUrl).play();
    }
}

function notifyVibration(vibration) {
    if ('navigator' in window && navigator.vibrate) {
        navigator.vibrate(vibration);
    }
}

function notifyScreen({ title, body, icon, onclick }) {
    if (!('Notification' in window)) {
        return;
    }

    Notification.requestPermission(permission => {
        if (permission === 'granted') {
            const notification = new Notification(title, {
                icon,
                body
            });

            notification.onclick = () => onclick();
        }
    });
}

function prepareNotificationOptions({ chat, message, user }) {
    const chatInfo = chat.type === 'group' ? ` in ${chat.title}` : '';
    const title = `@${message.author}${chatInfo}`;
    const body = message.forwardFrom
        ? message.forwardFrom.text
        : message.text;
    const icon = chat.getAvatarFor(user).replace('.svg', '.png');

    return { title, body, icon };
}

/* eslint-disable-next-line complexity */
function needNotifyAboutMessage({ chat, message, user, activeChat }) {
    if (message.hasMention(user)) {
        return true;
    }

    if (!chat.settings.notificationsEnabled()) {
        return false;
    }

    // Не реагируем на свои сообщения
    if (message.author === user.nickname) {
        return false;
    }

    // Если наша вкладка и сообщение пришло в текущий чат, то не нужно уведомлять
    if (!document.hidden && activeChat && activeChat.id === chat._id) {
        return false;
    }

    return true;
}
