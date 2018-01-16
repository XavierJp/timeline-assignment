import './timeline.css';
import React, { Component } from 'react';
import * as d3Scale from 'd3-scale';

class Timeline extends Component {
    constructor(props) {
        super(props);

        this.scaleX = d3Scale.scaleLinear()
            .domain(this.props.boundaries)
            .range([0, this.props.width]);

        this.scaleY = d3Scale.scaleLinear()
            .domain([0,100])
            .range([0, this.props.height]);

        this.formatDate = (dateAsNumber) => {
            const date = new Date(props.getDate(dateAsNumber));
            var options = { year: 'numeric', month: 'long'};
            return new Intl.DateTimeFormat('en-US', options).format(date);
        }
    }

    render() {
        const { width, height, trials, getDate } = this.props;
        return (
            <svg id="timeline" width={width} height={height}>
                {
                    trials.map((trial, index)=> {
                        return(
                            <TimelineBox
                                key={index}
                                width={this.scaleX(trial.x[1])-this.scaleX(trial.x[0])}
                                height={this.scaleY(trial.y[1])-this.scaleY(trial.y[0])-5}
                                x={this.scaleX(trial.x[0])}
                                y={this.scaleY(trial.y[0])}
                                title={trial.title}
                                startDate={this.formatDate(trial.start)}
                                endDate={this.formatDate(trial.end)}/>
                        )
                    })
                }
            </svg>
        )
    }
}

const TimelineBox = (props) => (
    <g className='timeline-box-container'>
        <rect
            width={props.width}
            height={props.height}
            x={props.x}
            y={props.y}
            className='timeline-box'
        />
        <rect
            width={props.width}
            height={Math.min(props.height, 20)}
            x={props.x}
            y={props.y}
            className='timeline-title-container'
        />
        <text x={props.x+10}
            y={props.y+15}
            className='timeline-title-text'>{props.title}</text>
        <text x={props.x+10}
            y={props.y+35}
            className='timeline-date'>{props.startDate+' - '+props.endDate}</text>
    </g>
)


export default Timeline;