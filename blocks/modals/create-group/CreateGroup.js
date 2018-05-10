'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { hideCreateGroup } from '../../../actions/modals';
import { createGroupChat } from '../../../actions/chats';

/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-closing-bracket-location */

import './CreateGroup.css';
import Chat from '../../../models/Chat';

class CreateGroup extends Component {
    state = { groupMembers: [], groupTitle: 'group' }

    createChat = () => {
        const { groupMembers, groupTitle } = this.state;
        const myUser = this.props.user;

        this.props.createGroupChat(myUser, groupMembers, groupTitle);
    }

    hideCreateGroup = () => {
        this.props.hideCreateGroup();
    }

    componentDidMount() {
        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                this.props.hideCreateGroup();
            }
        });
    }

    pushOrPopFromGroupMembers(member) {
        const { groupMembers } = this.state;
        let index = -1;

        for (let i = 0; i < groupMembers.length; i += 1) {
            if (groupMembers[i].nickname === member.nickname) {
                index = i;
            }
        }

        if (index === -1) {
            groupMembers.push(member);
        } else {
            groupMembers.splice(index, 1);
        }

        this.setState({ groupMembers });
    }

    render() {
        const { contacts, showCG } = this.props;
        const { groupMembers } = this.state;

        if (!showCG) {
            return <div />;
        }

        return (
            <div className="darkness" onClick={this.hideCreateGroup}>
                <div className="create-group" onClick={e => e.stopPropagation()}>
                    <input
                        type="text"
                        className="create-group__input"
                        placeholder="Название группы"
                        value={this.state.groupTitle}
                        onChange={e => this.setState({ groupTitle: e.target.value })}
                    />
                    <div className="create-group__list">
                        {contacts.map(contact => {

                            return (
                                <li
                                    className="create-group__user-box"
                                    key={Math.random()}
                                    onClick={() => this.pushOrPopFromGroupMembers(contact)}
                                    >
                                    <div className="create-group__nickname">
                                        {contact.nickname}
                                    </div>
                                </li>
                            );
                        })}
                    </div>
                    <div className="create-group__info_wrapper">
                        <span className="create-group__number-members">
                            {groupMembers.length} участников
                        </span>
                        <button
                            className="create-group__button"
                            onClick={this.createChat}
                            >
                            Создать
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

CreateGroup.propTypes = {
    user: PropTypes.object,
    showCG: PropTypes.bool,
    contacts: PropTypes.array,
    hideCreateGroup: PropTypes.func,
    createGroupChat: PropTypes.func
};

export default connect(
    state => ({
        user: state.user,
        contacts: state.chats
            .map(chat => new Chat(chat).getContactFor(state.user))
            .filter(contact => contact),
        showCG: state.modal.showCG
    }), {
        hideCreateGroup,
        createGroupChat
    }
)(CreateGroup);
