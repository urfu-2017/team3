'use strict';

export default function invite(state = null, action) {
    if (action.type === 'ACCEPT_INVITE') {
        return action.invite;
    }

    return state;
}
