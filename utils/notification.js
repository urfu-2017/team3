'use strict';

import Chat from '../models/Chat';

const NEWMSG_SOUND_URL = '/static/newmsg.wav';
const NEWMSG_VIBRATION_PATTERN = [100, 100];

/* eslint-disable-next-line */
export const notifyMessage = ({ message, chat, user, onclick }) => {
    chat = new Chat(chat);

    if (!chat.settings.notificationEnabled()) {
        return;
    }

    const chatInfo = chat.type === 'group' ? ` in ${chat.title}` : '';
    const title = `@${message.author}${chatInfo}`;
    const body = message.forwardFrom
        ? message.forwardFrom.text
        : message.text;
    const icon = chat.getAvatarFor(user).replace('.svg', '.png');

    notifySound(NEWMSG_SOUND_URL);
    notifyVibration(NEWMSG_VIBRATION_PATTERN);
    if (document.hidden) {
        notifyScreen({ title, body, icon, onclick });
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
