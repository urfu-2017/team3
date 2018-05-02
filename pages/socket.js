import io from 'socket.io-client';

let socket = null;

export default function getSocket() {
    if (!socket) {
        socket = io();
    }

    return socket;
}
