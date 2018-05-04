'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-closing-bracket-location */

import './CreateGroup.css';

class CreateGroup extends Component {
    state = { groupMembers: [], groupTitle: 'group' }

    createChat = async () => {
        const { groupMembers, groupTitle } = this.state;

        groupMembers.push(this.props.user); // Себя добавляю
        const response = await fetch('api/chats/', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: groupTitle,
                members: groupMembers,
                type: 'group'
            })
        });

        if (response.status === 200) {
            const createdChat = await response.json();

            this.props.onCreateChat(createdChat);
        }
    }

    hideCreateGroup = () => {
        this.props.onHideCreateGroup();
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
    onHideCreateGroup: PropTypes.func,
    onCreateChat: PropTypes.func
};

export default connect(
    state => ({ user: state.user, chats: state.chats, showCG: state.modal.showCG }),
    dispatch => ({
        onHideCreateGroup: () => {
            dispatch({ type: 'HIDE_CREATEGROUP' });
        },
        onCreateChat: chat => {
            dispatch({ type: 'CREATE_CHAT', chat }); // ТУДУ update sore
        }
    })
)(CreateGroup);
