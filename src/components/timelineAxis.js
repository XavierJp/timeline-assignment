import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './timelineAxis.css';
import axisFactory from './d3TimelineAxis.js';

class TimelineAxis extends Component {
    componentDidMount () {
        const el = ReactDOM.findDOMNode(this);
        this.axis = axisFactory(el,this.props.dates,this.props.width, 30);
    }

    render() {
        return (
            <div id="timeline-axis">
            </div>
        )
    }
}

export default TimelineAxis;