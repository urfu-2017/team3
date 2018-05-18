'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { hideCreateGroup, includeInNewGroup, excludeFromNewGroup } from '../../../actions/modals';
import { createGroupChat } from '../../../actions/chats';

/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/no-array-index-key */

import './CreateGroup.css';

class CreateGroup extends Component {
    state = {
        groupTitle: 'group'
    }

    createChat = () => {
        const { groupTitle } = this.state;
        const { user, groupMembers } = this.props;

        this.props.createGroupChat(user, groupMembers, groupTitle);
        this.setState({ groupTitle: 'group' });
    }

    hideCreateGroup = () => {
        this.props.hideCreateGroup();
        this.setState({ groupTitle: 'group' });
    }

    componentDidMount() {
        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                this.props.hideCreateGroup();
            }
        });
    }

    render() {
        const { availableUsers, groupMembers, user, showCG } = this.props;

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
                            {availableUsers.map(contact => {
                                return (
                                    <li
                                        className="create-group__user-box"
                                        key={contact.nickname}
                                        onClick={() => this.props.includeInNewGroup(contact)}
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
                        Количество участников: {groupMembers.length + 1}
                    </span>
                    <div className="create-group__participants">
                        <div className="create-group__participants_wrapper">
                            <li className="create-group__user-box create-group__user-box_creator">
                                <div className="create-group__nickname">
                                    {user.nickname}
                                </div>
                                <div className="create-group__creator-hint">
                                    — cоздатель
                                </div>
                            </li>
                            {groupMembers.map(contact => {
                                return (
                                    <li
                                        className="create-group__user-box"
                                        key={contact.nickname}
                                        onClick={() => this.props.excludeFromNewGroup(contact)}
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
    availableUsers: PropTypes.array,
    groupMembers: PropTypes.array,
    showCG: PropTypes.bool,
    hideCreateGroup: PropTypes.func,
    createGroupChat: PropTypes.func,
    includeInNewGroup: PropTypes.func,
    excludeFromNewGroup: PropTypes.func
};

export default connect(
    state => ({
        user: state.user,
        groupMembers: state.modal.groupMembers,
        availableUsers: state.modal.availableUsers,
        showCG: state.modal.showCG
    }), {
        hideCreateGroup,
        createGroupChat,
        includeInNewGroup,
        excludeFromNewGroup
    }
)(CreateGroup);
