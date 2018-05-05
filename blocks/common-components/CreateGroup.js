'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import getSocket from '../../pages/socket';

/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-closing-bracket-location */

import './CreateGroup.css';

class CreateGroup extends Component {
    state = { groupMembers: [], groupTitle: 'group' }

    createChat = () => {
        const { groupMembers, groupTitle } = this.state;

        groupMembers.unshift(this.props.user);

        const socket = getSocket();

        this.props.onStartChatCreation();
        socket.emit('chat', {
            title: groupTitle,
            members: groupMembers.map(m => m.nickname),
            type: 'group'
        }, chat => {
            this.props.onChatCreated(chat);
        });
    }

    hideCreateGroup = () => {
        this.props.onHideCreateGroup();
    }

    whoIsMyInterlocutor(members) {
        if (members[0].nickname === this.props.user.nickname) {
            return members[1];
        }

        return members[0];
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
        const { chats, showCG } = this.props;
        const { groupMembers } = this.state;

        if (!showCG) {
            return <div />;
        }

        return (
            <div className="darkness" onClick={this.hideCreateGroup}>
                <div className="createg" onClick={event => event.stopPropagation()}>
                    <input
                        type="text"
                        className="createg__input"
                        placeholder="Название группы"
                        value={this.state.groupTitle}
                        onChange={e => this.setState({ groupTitle: e.target.value })}
                    />
                    <span>{groupMembers.length}</span>
                    <div>
                        {chats.map(chat => {
                            if (chat.type === 'private'
                            && (chat.members[0].nickname !== chat.members[1].nickname)) {
                                return (
                                    <li
                                        key={Math.random()}
                                        onClick={() => {
                                            this.pushOrPopFromGroupMembers(
                                                this.whoIsMyInterlocutor(chat.members)
                                            );
                                        }}
                                        >
                                        {this.whoIsMyInterlocutor(chat.members).nickname}
                                    </li>
                                );
                            }
                        })}
                    </div>
                    <button onClick={this.createChat}>Создать</button>
                    {/* <div className="adduser__list">
                        {foundUsers
                            ?
                                <div className="chats__found-users">
                                    { foundUsers.map(foundUser => {
                                        return (
                                            <PureProfile
                                                key={user.nickname}
                                                user={foundUser}
                                            />
                                        );
                                    })}
                                </div>
                            :
                            null
                        }
                    </div> */}
                </div>
            </div>
        );
    }
}

CreateGroup.propTypes = {
    user: PropTypes.object,
    chats: PropTypes.array,
    showCG: PropTypes.boolean,
    onChatCreated: PropTypes.func,
    onStartChatCreation: PropTypes.func,
    onHideCreateGroup: PropTypes.func
};

export default connect(
    state => ({ user: state.user, chats: state.chats, showCG: state.modal.showCG }),
    dispatch => ({
        onStartChatCreation: () => {
            dispatch({ type: 'HIDE_CREATEGROUP' });
            dispatch({ type: 'SHOW_LOADER' });
        },
        onChatCreated: chat => {
            dispatch({ type: 'CREATE_CHAT', chat });
            dispatch({ type: 'OPEN_CHAT', id: chat._id });
            dispatch({ type: 'HIDE_LOADER' });
        },
        onHideCreateGroup: () => {
            dispatch({ type: 'HIDE_CREATEGROUP' });
        }
    })
)(CreateGroup);
