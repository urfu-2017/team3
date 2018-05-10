'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-closing-bracket-location */

import './Contacts.css';

// туду Выпиливаем эту хуйню
class Contacts extends Component {
    hideContacts = () => {
        this.props.onHideContacts();
    }

    componentDidMount() {
        // this.nameInput.focus();
    }

    whoIsMyInterlocutor(members) {
        if (members[0].nickname === this.props.user.nickname) {
            return members[1];
        }

        return members[0];
    }

    render() {
        const { chats, showContacts } = this.props;

        if (!showContacts) {
            return <div />;
        }

        return (
            <div className="darkness" onClick={this.hideContacts}>
                <div className="contacts" onClick={event => event.stopPropagation()}>
                    <div className="contacts__title">
                        Нажмите, чтобы посмотреть профиль
                    </div>
                    <div className="contacts__box">
                        {chats.map(chat => {
                            if (chat.type === 'private'
                            && (chat.members[0].nickname !== chat.members[1].nickname)) {
                                return (
                                    <li
                                        className="contacts__user-box"
                                        key={Math.random()}
                                        onClick={() => {
                                            this.props.onHideContacts();
                                            this.props.onShowProfile(chat);
                                        }}
                                        >
                                        <div className="contacts__nickname">
                                            {this.whoIsMyInterlocutor(chat.members).nickname}
                                        </div>
                                    </li>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

Contacts.propTypes = {
    user: PropTypes.object,
    chats: PropTypes.array,
    showContacts: PropTypes.bool,
    onHideContacts: PropTypes.func,
    onShowProfile: PropTypes.func
};

export default connect(
    state => ({ user: state.user, chats: state.chats, showContacts: state.modal.showContacts }),
    dispatch => ({
        onHideContacts: () => {
            dispatch({ type: 'HIDE_CONTACTS' });
        },
        onShowProfile: profile => {
            dispatch({ type: 'SHOW_PROFILE', profile });
        }
    })
)(Contacts);
