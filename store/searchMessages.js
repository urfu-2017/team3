export default function searchMessages(state = { messages: null, show: false }, action) {
    if (action.type === 'UPDATE_SEARCHMESSAGES') {
        return {
            ...state,
            messages: action.messages.sort(compareByLastMessage)
        };
    }

    if (action.type === 'SHOW_SEARCHMESSAGES') {
        return {
            ...state,
            show: true
        };
    }

    if (action.type === 'HIDE_SEARCHMESSAGES') {
        return {
            messages: null,
            show: false
        };
    }

    return state;
}

function compareByLastMessage(a, b) {
    const aMessage = a;
    const bMessage = b;

    if (bMessage && aMessage) {
        return new Date(bMessage.date) - new Date(aMessage.date);
    }

    // чатик в котором есть сообщение всегда раньше
    return aMessage ? -1 : 1;
}
