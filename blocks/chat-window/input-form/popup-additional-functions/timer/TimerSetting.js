import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './TimerSetting.css';
import moment from 'moment';

import { setSelfDestructTimer,
    resetSelfDestructTimer } from '../../../../../actions/activeChat';

class TimerSetting extends Component {
    /* eslint-disable react/no-array-index-key */
    /* eslint-disable react/jsx-closing-bracket-location */
    /* eslint-disable prefer-template */
    /* eslint-disable react/jsx-no-bind */
    state = {
        secondsTimer: 0
    }

    prettyTime = seconds => moment.utc(seconds * 1000).format('mm:ss');

    setTimer = e => {
        if (e.target.value === 0) {
            this.setState({ secondsTimer: e.target.value });
            this.props.resetSelfDestructTimer();
        } else {
            this.setState({ secondsTimer: e.target.value });
            this.props.setSelfDestructTimer(e.target.value);
        }
    }

    render() {
        return (
            <div className="timer-setting" onClick={e => e.stopPropagation()}>
                <span className="timer-setting__description">
                    Секретное сообщение
                </span>
                <img
                    src="/static/send_message.svg"
                    className="timer-setting__button"
                    onClick={this.props.submitMessage}
                />
                <input
                    min="0"
                    max="300"
                    step="15"
                    type="range"
                    className="timer-setting__range"
                    onChange={this.setTimer}
                />
                <div className="timer-setting__current-value">
                    {this.prettyTime(this.state.secondsTimer)}
                </div>
            </div>
        );
    }
}

TimerSetting.propTypes = {
    setSelfDestructTimer: PropTypes.func,
    resetSelfDestructTimer: PropTypes.func,
    submitMessage: PropTypes.func
};

export default connect(
    () => ({}), {
        setSelfDestructTimer,
        resetSelfDestructTimer
    }
)(TimerSetting);
