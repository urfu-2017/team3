'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ChatIcon from './ChatIcon';
import SearchMessageIcon from './SearchMessageIcon';

class Chats extends React.Component {
    render() {
        const { chats, searchMessages, showSearchMessages } = this.props;

        if (chats.length === 0) {
            return (
                <React.Fragment>
                    <div className="darkness" />
                    <div className="chats__no-chats" />
                </React.Fragment>
            );
        }

        if (showSearchMessages) {
            if (!searchMessages) {
                return (
                    <div className="chats__empty-search">
                        Введите текст для поиска
                    </div>
                );
            }

            if (!searchMessages.length) {
                return (
                    <div className="chats__empty-search">
                        Ничего не найдено
                    </div>
                );
            }

            return searchMessages.map(message => {
                return <SearchMessageIcon key={message._id} message={message} />;
            });
        }

        return chats.map(chat => (
            <ChatIcon key={chat._id} chatProps={chat} />
        ));
    }
}

Chats.propTypes = {
    chats: PropTypes.array,
    showSearchMessages: PropTypes.bool,
    searchMessages: PropTypes.array
};

export default connect(
    state => ({
        chats: state.chats,
        searchMessages: state.searchMessages.messages,
        showSearchMessages: state.searchMessages.show
    })
)(Chats);
