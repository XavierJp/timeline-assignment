import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import axisFactory from './d3TimelineAxis.js';

class TimelineAxis extends Component {
    componentDidMount () {
        const el = ReactDOM.findDOMNode(this);
        this.axis = axisFactory(el,this.props.dates,this.props.width, 30);
    }

    componentWillReceiveProps(nextProps) {
        this.axis.update(nextProps.dates);
    }

    render() {
        return (
            <span id="timeline-axis">
            </span>
        )
    }
}

export default TimelineAxis;