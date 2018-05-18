'use strict';

import React, { Component } from 'react';

import PropTypes from 'prop-types';

export default class MapComponent extends Component {
    render() {
        const { location } = this.props;
        const fullMapUrl = createFullMapUrl(location);
        const imageUrl = createImageUrl(location);

        return (
            <div>
                <a href={fullMapUrl} target="_blank">
                    <img src={imageUrl} onClick={this.openFullMap} />
                </a>
            </div>
        );
    }
}

MapComponent.propTypes = {
    location: PropTypes.object
};

function createImageUrl(location) {
    const ll = `${location.longitude},${location.latitude}`;

    return `https://static-maps.yandex.ru/1.x/?ll=${ll}&size=300,300&z=16&l=map&pt=${ll},comma`;
}

function createFullMapUrl(location) {
    const ll = `${location.longitude},${location.latitude}`;

    return `http://maps.yandex.ru/?ll=${ll}&z=16&l=map&pt=${ll}`;
}
