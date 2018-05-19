export default function searchMessages(state = { messages: null, show: false }, action) {
    if (action.type === 'UPDATE_SEARCHMESSAGES') {
        return {
            ...state,
            messages: action.messages.sort(compareMessages)
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

function compareMessages(a, b) {
    return new Date(b.date) - new Date(a.date);
}
