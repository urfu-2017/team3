'use strict';

/* eslint-disable guard-for-in */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../common-components/Button';

const getHeaderMarkup = fraction => {
    if (fraction.tag === 'Button') {
        return <Button btnParams={fraction.params} />;
    }
    // Const attributeKeys = Object.keys(fractions[`${fraction}`].attributes);
    // Console.log(attributeKeys);
    let attributesString = [];

    for (const prop in fraction.attributes) {
        const attrValue = fraction.attributes[`${prop}`];

        attributesString.push(`${prop}="${attrValue}"`);
    }
    // Console.log(attributesString);
    attributesString = attributesString.join(' ');

    return `<${fraction.tag} ${attributesString} />`;

    // return <img src="../public/labels/kg64.svg" width="64px" height="64px" />;
};

export default class Profile extends Component {
    render() {
        const { fractions } = this.props;
        // Const classNames = Object.keys(fractions);
        const header = [];

        for (const fraction in fractions) {
            const item = fractions[`${fraction}`];

            header.push(getHeaderMarkup(item, header));
        }

        return (
            <React.Fragment>
                {header}
            </React.Fragment>
        );
    }
}

Profile.propTypes = { fractions: PropTypes.object };
