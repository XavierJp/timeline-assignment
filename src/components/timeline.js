import './timeline.css';
import React, { Component } from 'react';
import * as d3Scale from 'd3-scale';

class Timeline extends Component {
    constructor(props) {
        super(props);

        this.scaleX = d3Scale.scaleLinear()
            .domain(this.props.xBoundaries)
            .range([5, this.props.width-5]);

        this.scaleY = d3Scale.scaleLinear()
            .domain([0,100])
            .range([5, this.props.height-5]);
    }

    render() {
        const { width, height, trials } = this.props;
        return (
            <svg id="timeline-container" width={width} height={height} id="svg">
                {
                    trials.map((trial, index)=> {
                        return(
                            <rect
                                key={index}
                                width={this.scaleX(trial.x[1]-trial.x[0])}
                                height={this.scaleY(trial.y[1]-trial.y[0])}
                                x={this.scaleX(trial.x[0])}
                                y={this.scaleY(trial.y[0])}
                                className='timeline-box'
                            />
                        )
                    })
                }
            </svg>
        )
    }
}

export default Timeline;