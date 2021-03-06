

/* CORE algo : main computation logic belongs here **/

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
        for(let i = 0; i<trialsWithMetaData.length; i++) {
            const trial = trialsWithMetaData[i];
            if(trial.id!==currentTrial.id) {
                if(isSimultaneous(trial, currentTrial)) {
                    trial.simultaneousTrials.push(currentTrial);
                }
            }
        }
    };

    // compute row orders
    for(let trialIdx = 0; trialIdx<trialsWithMetaData.length; trialIdx++) {
        const currentTrial = trialsWithMetaData[trialIdx];

        if(currentTrial.simultaneousTrials.length === 0)
            continue;

        currentTrial.simultaneousTrials.sort(orderByDate);

        const occupiedRowIdx = currentTrial.simultaneousTrials.filter(c=>c.rowIdx!==0).map(c=>c.rowIdx).sort();

        if(occupiedRowIdx.length ===0) {
            currentTrial.rowIdx = 1;
        } else {
            occupiedRowIdx.reduce((prevRow, nextRow)=> {
                if (prevRow + 1 < nextRow)
                    currentTrial.rowIdx = prevRow +1;
                return nextRow
            }, 0);

            if (currentTrial.rowIdx===0)
                currentTrial.rowIdx = occupiedRowIdx[occupiedRowIdx.length-1]+1;
        }
    }


    // compute rowTotal & coordinates
    for(let trialId=0; trialId<trialsWithMetaData.length; trialId++) {
        const currentTrial = trialsWithMetaData[trialId];

        currentTrial.simultaneousTrials.sort(orderByDate);

        if(currentTrial.rowIdx === 0) // no simultaneous trials
            continue;

        // if more than one row => compute number of row
        if(currentTrial.rowTotal === 0) {
            const rowTotal = getRowTotalReccursive(currentTrial, currentTrial.rowIdx);
            setRowTotalReccursive(currentTrial, rowTotal);
        }

        const rowHeight = (currentTrial.y[1] - currentTrial.y[0])/currentTrial.rowTotal;
        const startHeight = currentTrial.y[0]+rowHeight*(currentTrial.rowIdx-1);

        currentTrial.y = [startHeight, startHeight+rowHeight];
    };

    // uncomment this line to display the repartitions results
    //trialsWithMetaData.map(c=>console.log(c.title +' | position '+ c.rowIdx +' | total '+ c.rowTotal+' | simultan '+ c.simultaneousTrials.length))

    timeline.trials = trialsWithMetaData;

    return timeline;
}

/** UTILS FUNCTION **/

// parse all the simultaneous trial to get the max number of simultaneous trial
const getRowTotalReccursive = (trial, max)=>{
    trial.markUp = 1;
    const m = Math.max(max, trial.rowIdx);
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

const isSimultaneous = (trialA,trialB) => {
    if (trialA.end < trialB.start)
        return false;

    if (trialA.start > trialB.end)
        return false;

    return true;
}

// orderBy date
const orderByDate = (trial1,trial2)=> trial1.start > trial2.start ? 1 : -1;

export default timelineFactory;