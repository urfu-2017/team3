import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './TimerSetting.css';

import { setSelfDestructTimer,
    resetSelfDestructTimer,
    hideTimerSetting } from '../../../actions/activeChat';

class TimerSetting extends Component {
    /* eslint-disable react/no-array-index-key */
    /* eslint-disable react/jsx-closing-bracket-location */
    /* eslint-disable prefer-template */
    /* eslint-disable react/jsx-no-bind */
    state = {
        secondsTimer: 0
    }

    prettyTime = seconds => {
        let pureSeconds = seconds % 60;
        const minutes = (seconds - pureSeconds) / 60;

        pureSeconds = String(pureSeconds).length === 1 ? '0' + String(pureSeconds) : pureSeconds;

        return `0${minutes}:${pureSeconds}`;
    }

    setTimer = e => {
        // console.log(e.target.value);
        if (e.target.value === 0) {
            this.setState({ secondsTimer: e.target.value });
            this.props.resetSelfDestructTimer();
        } else {
            this.setState({ secondsTimer: e.target.value });
            this.props.setSelfDestructTimer(e.target.value);
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                this.props.hideTimerSetting();
            }
        });
    }

    render() {
        if (!this.props.isShowTimerSetting) {
            return null;
        }

        return (
            <div className="darkness" onClick={this.props.hideTimerSetting}>
                <div className="timer-setting" onClick={e => e.stopPropagation()}>
                    <div className="timer-setting_description">
                        Установите время для самоуничтожения сообщения:
                    </div>
                    <div className="timer-setting__range_wrapper">
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
                </div>
            </div>
        );
    }
}

TimerSetting.propTypes = {
    setSelfDestructTimer: PropTypes.func,
    resetSelfDestructTimer: PropTypes.func,
    isShowTimerSetting: PropTypes.bool,
    hideTimerSetting: PropTypes.func
};

export default connect(
    state => ({
        isShowTimerSetting: state.activeChat && state.activeChat.isShowTimerSetting
    }), {
        setSelfDestructTimer,
        resetSelfDestructTimer,
        hideTimerSetting
    }
)(TimerSetting);
