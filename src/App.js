import React, { Component } from 'react';
import './App.css';
import Timeline from './components/timeline.js';
import TimelineAxis from './components/timelineAxis.js';
import timelineFactory, { getDate } from './timelineCore.js';

class App extends Component {
    constructor() {
        super();

        window.updateTimeLine = (trials) => {
            this.setState({...timelineFactory(trials)});
        };

        this.state = {
            ...timelineFactory([]),
            width:1000,
            height:300
        }
    }
    render() {
        return (
            <div id="app-container">
                { this.state.trials.length === 0 &&
                    <div id="no-trials">To render trials, please type them in the input box.</div>
                }
                { this.state.trials.length > 0 &&
                    <div id="timeline-container">
                        <Timeline
                            boundaries={this.state.boundaries}
                            trials={this.state.trials}
                            width={this.state.width}
                            height={this.state.height}
                            getDate={getDate} />
                        <TimelineAxis
                            dates={this.state.boundariesAsDates}
                            width={this.state.width}/>
                    </div>
                }
            </div>
        );
    }
}

export default App;
