import React, { Component } from 'react';
import './App.css';
import Timeline from './components/timeline.js';
import TimelineAxis from './components/timelineAxis.js';

class App extends Component {
    constructor() {
        super();

        const trials = [
          { start: 5, end: 50, title: 'Study of Bendamustine' },
          { start: 55, end: 85, title: 'ASCT With Nivolumab' },
          { start: 70, end: 100, title: 'Study of Stockolm' },
          { start: 80, end: 110, title: 'Study of Stockolm 2' },
          { start: 90, end: 115, title: 'Bortezomib' },
        ];
        const orderByDate = (trial1,trial2)=> trial1.start > trial2.start ? 1 : -1;
        const res = trials
            .sort(orderByDate)
            .map((trial, index) => {
                return Object.assign({}, trial, {
                    id : index,
                    x : [trial.start, trial.end],
                    y : [0,100],
                    simultaneousTrials : [],
                    rowIdx : 0,
                    rowTotal : 0,
                });
            }
        );

        // compute simulatneous trials
        for(let trialIdx = 0; trialIdx<res.length; trialIdx++) {
            const currentTrial = res[trialIdx];

            const simultaneousTrials = res.filter(trial => {
                return (trial.start > currentTrial.start && trial.start < currentTrial.end)
                    || (trial.end > currentTrial.start && trial.end < currentTrial.end);
            })

            for(let i = 0; i<simultaneousTrials.length; i++) {
                simultaneousTrials[i].simultaneousTrials.push(currentTrial);
                simultaneousTrials[i].rowIdx += 1;
            }
        }
        // compute rowIdx
        for(let trialIdx = 0; trialIdx<res.length; trialIdx++) {
            const currentTrial = res[trialIdx];
            currentTrial.simultaneousTrials.sort(orderByDate);

            if(currentTrial.rowIdx > 0) {
                if(currentTrial.rowTotal === 0) {
                    const getRowTotal = (trials, start, max)=>{
                        return trials.reduce((acc, trial)=>{
                            if(trials.length===0)
                                return max;
                            const m = Math.max(max, trial.simultaneousTrials.length);
                            const trialToParse = trial.simultaneousTrials.filter(c=>c.start<start);
                            return Math.max(getRowTotal(trialToParse,trial.start,m),m);
                        },0)
                    }
                    const setRowTotal = (trial, rowTotal)=>{
                        trial.rowTotal = rowTotal;
                        trial.simultaneousTrials.filter(c=>c.start<trial.start).map(c=>setRowTotal(c, rowTotal))
                    }

                    const rowTotal = getRowTotal(currentTrial.simultaneousTrials, currentTrial.start, currentTrial.rowIdx);
                    setRowTotal(currentTrial, rowTotal);
                }

                const rowHeight = (currentTrial.y[1] - currentTrial.y[0])/currentTrial.rowTotal;
                const startHeight = currentTrial.y[0]+rowHeight*(currentTrial.rowIdx-1);

                currentTrial.y = [startHeight, startHeight+rowHeight-5];
            }
        }

        const xBoundaries = [Math.min(...trials.map(trial=>trial.start)),Math.max(...trials.map(trial=>trial.end))];
        const initialDate = new Date(2000, 1,1);
        const startDate = (new Date(initialDate)).setDate(initialDate.getDate()+xBoundaries[0]*7);
        const endDate = (new Date(initialDate)).setDate(initialDate.getDate()+xBoundaries[1]*7);


        this.state = {
            trials : res,
            dates : [startDate, endDate],
            xBoundaries : xBoundaries
        }
    }
    render() {
        return (
            <div className="App">
                <Timeline
                    xBoundaries={this.state.xBoundaries}
                    trials={this.state.trials}
                    width={800}
                    height={300}/>
                <TimelineAxis
                    dates={this.state.dates}
                    width={800}/>
            </div>
            );
        }
    }

    export default App;
