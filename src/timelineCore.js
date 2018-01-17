

/* CORE algo : main logic is here **/

const timelineFactory = (trials) => {

    /** DATES **/
    const timeline = {
        boundaries : [Math.min(...trials.map(trial=>trial.start)),Math.max(...trials.map(trial=>trial.end))],
    };
    timeline.boundariesAsDates = getDateBoundaries(timeline.boundaries);

    /** TRIALS : COMPUTE SIMULTANEOUS TRIALS **/
    // compute list of simultaneous trial
    const trialsWithMetaData = trials.sort(orderByDate).map((trial,index)=> {
        //basic check
        if (trial.start > trial.end)
            throw Error(`Start value cannot be superior to End value : ${JSON.stringify(trial)}`);

        return  Object.assign({}, trial, {
                id : index, // unique trial identifier, ordered by date
                x : [trial.start, trial.end],
                y : [0,100],
                simultaneousTrials : [], // list of simultaneous trials
                rowIdx : 0, // row position
                rowTotal : 0, // how many rows
        });
    });

    // compute simultaneous trials
    for(let trialId=0; trialId<trialsWithMetaData.length; trialId++) {
       const currentTrial = trialsWithMetaData[trialId];

       const simultaneousTrials = trialsWithMetaData.filter(trial => {
            if(trial.start >= currentTrial.start && trial.start <= currentTrial.end)
                return true;

            if(trial.end >= currentTrial.start && trial.end <= currentTrial.end)
                return true;
            return false;
        }).filter(trial=>trial.id!==currentTrial.id)

        for (let i=0; i< simultaneousTrials.length; i++)
            simultaneousTrials[i].simultaneousTrials.push(currentTrial);
    };

    trialsWithMetaData.map(c=>console.log(c.title +' | '+ c.simultaneousTrials.length))
    // compute rowTotal
    for(let trialId=0; trialId<trialsWithMetaData.length; trialId++) {
        const currentTrial = trialsWithMetaData[trialId];

        currentTrial.simultaneousTrials.sort(orderByDate);

        // if more than one row => compute number of row
        if(currentTrial.rowTotal === 0) {
            const rowTotal = getRowTotalReccursive(currentTrial, currentTrial.rowIdx);
            setRowTotalReccursive(currentTrial, rowTotal);
        }
    };

    // compute rowIdx and coordinates
    for(let trialIdx = 0; trialIdx<trialsWithMetaData.length; trialIdx++) {
        const currentTrial = trialsWithMetaData[trialIdx];

        if(currentTrial.rowIdx>0 || currentTrial.rowTotal === 0)
            continue;

        const simultaneousTrialsPosition = currentTrial.simultaneousTrials.map(c=>c.rowIdx);

        for (let i =1; i<=currentTrial.rowTotal; i++) {
            if(currentTrial.rowIdx === 0 && simultaneousTrialsPosition.indexOf(i) === -1) {
                currentTrial.rowIdx = i;
            }
        }

        const rowHeight = (currentTrial.y[1] - currentTrial.y[0])/currentTrial.rowTotal;
        const startHeight = currentTrial.y[0]+rowHeight*(currentTrial.rowIdx-1);

        currentTrial.y = [startHeight, startHeight+rowHeight];
    }

    timeline.trials = trialsWithMetaData;

    return timeline;
}

/** UTILS FUNCTION **/

// parse all the simultaneous trial to get the max number of simultaneous trial
const getRowTotalReccursive = (trial, max)=>{
    trial.markUp = 1;
    const m = Math.max(max, trial.simultaneousTrials.length);
    const trialsToParse = trial.simultaneousTrials.filter(c=>c.start>=trial.start).filter(c=>c.markUp!==1);
    if(trialsToParse.length===0)
        return m;
    return Math.max(...trialsToParse.map(trialToParse=> getRowTotalReccursive(trialToParse,m)));
}

// reccursively set the row total number
const setRowTotalReccursive = (trial, rowTotal)=>{
    if (trial.rowTotal === 0) {
        trial.rowTotal = rowTotal;
        trial.simultaneousTrials.map(c=>setRowTotalReccursive(c, rowTotal))
    }
}

// turn the boundaries as number into boundaries as date
const getDateBoundaries = (bounds) => {
    return [getDate(bounds[0]), getDate(bounds[1])];
}

export const getDate = (dateAsNumber) => {
    const initialDate = new Date(2000, 1,1);
    return (new Date(initialDate)).setMonth(initialDate.getMonth()+dateAsNumber);
}

// orderBy date
const orderByDate = (trial1,trial2)=> trial1.start > trial2.start ? 1 : -1;

export default timelineFactory;