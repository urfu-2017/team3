import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    showCreateGroup,
    showAddUser,
    showProfile
} from '../../../actions/modals';

import './Controls.css';

/* туду переделать на поиск по сообщениям */
class Controls extends Component {
    state = { isSearchString: false }

    showSearch = () => {
        const { isSearchString } = this.state;

        this.setState({ isSearchString: !isSearchString });
    }

    showProfile = () => {
        const { user } = this.props;

        this.props.showProfile(user);
    }

    render() {
        const { isSearchString } = this.state;

        return isSearchString
            ?
            (
                <React.Fragment>
                    <input
                        type="text"
                        className="chats__search-input"
                        placeholder="Найти пользователя"
                        autoFocus
                    />
                    <img
                        src="/static/controls/search.svg"
                        className="control-img"
                        onClick={this.showSearch}
                        title="Поиск"
                        draggable="false"
                    />
                </React.Fragment>
            )
            :
            (
                <React.Fragment>
                    <img
                        src="/static/controls/profile.svg"
                        className="control-img"
                        onClick={this.showProfile}
                        title="Мой профиль"
                        draggable="false"
                    />
                    <img
                        src="/static/controls/chat.svg"
                        className={
                            this.props.chats.length
                                ?
                                'control-img'
                                :
                                'control-img controls_zindex_max'
                        }
                        onClick={this.props.showAddUser}
                        title="Добавить собеседника"
                        draggable="false"
                    />
                    <img
                        src="/static/controls/create_group_chat.svg"
                        className="control-img"
                        onClick={this.props.showCreateGroup}
                        title="Создать групповой чат"
                        draggable="false"
                    />
                    <img
                        src="/static/controls/search.svg"
                        className="control-img"
                        onClick={this.showSearch}
                        title="Поиск"
                        draggable="false"
                    />
                </React.Fragment>
            );
    }
}

Controls.propTypes = {
    user: PropTypes.object,
    chats: PropTypes.array,
    showProfile: PropTypes.func,
    showAddUser: PropTypes.func,
    showCreateGroup: PropTypes.func
};

export default connect(
    state => ({
        user: state.user,
        chats: state.chats
    }), {
        showProfile,
        showAddUser,
        showCreateGroup
    }
)(Controls);
