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
    state = {
        groupMembers: [],
        groupTitle: 'group',
        mutableContacts: this.props.contacts.slice()
    }

    createChat = () => {
        const { groupMembers, groupTitle } = this.state;
        const myUser = this.props.user;

        this.props.createGroupChat(myUser, groupMembers, groupTitle);
        this.setState({
            groupMembers: [],
            groupTitle: 'group',
            mutableContacts: this.props.contacts.slice()
        });
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

    /* eslint-disable max-statements */
    /* eslint-disable complexity */
    pushOrPopFromGroupMembers(member) {
        const { groupMembers, mutableContacts } = this.state;
        let indexInMembers = -1;
        let indexInContacts = -1;

        for (let i = 0; i < groupMembers.length; i += 1) {
            if (groupMembers[i].nickname === member.nickname) {
                indexInMembers = i;
            }
        }

        for (let i = 0; i < mutableContacts.length; i += 1) {
            if (mutableContacts[i].nickname === member.nickname) {
                indexInContacts = i;
            }
        }

        if (indexInMembers === -1) {
            groupMembers.push(member);
            mutableContacts.splice(indexInContacts, 1);
        } else {
            mutableContacts.push(member);
            groupMembers.splice(indexInMembers, 1);
        }

        this.setState({ groupMembers });
    }
    /* eslint-enable max-statements */

    render() {
        const { showCG } = this.props;
        const { groupMembers } = this.state;

        if (!showCG) {
            return <div />;
        }

        return (
            <div className="darkness" onClick={this.hideCreateGroup}>
                <div className="create-group" onClick={e => e.stopPropagation()}>
                    <div className="create-group__title">
                        <span className="create-group__hint">
                            Название группы
                        </span>
                        <input
                            type="text"
                            className="create-group__name"
                            placeholder="Название группы"
                            value={this.state.groupTitle}
                            onChange={e => this.setState({ groupTitle: e.target.value })}
                            autoFocus
                        />
                    </div>
                    <div className="create-group__list">
                        <div className="create-group__list_wrapper">
                            {this.state.mutableContacts.map(contact => {
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
                    </div>
                    <span className="create-group__number-members">
                        Количество участников: {groupMembers.length}
                    </span>
                    <div className="create-group__participants">
                        <div className="create-group__participants_wrapper">
                            {this.state.groupMembers.map(contact => {
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
                    </div>
                    <hr className="create-group_separator" />
                    <button
                        className="create-group__button"
                        onClick={this.createChat}
                        >
                        Создать
                    </button>
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
