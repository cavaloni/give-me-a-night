import * as actions from '../actions/index';

function eventRandomizer (events) {  
    let eventsLength;
    if (events.length > 5) {
        eventsLength = 5
    } else {
        eventsLength = events.length;
    }
    let eventNumber = Math.floor((Math.random() * eventsLength));
    return events[eventNumber];
}

const initialState = {
    zomatoResults : {},
    movieResults : {},
    bitResults : {},
    ebResults : {},
    search : {},
    eventsToDisplay : [{}, {}, {}]
}

//Just trying to get the data into eventsToDisplay. Tough stuff!
//Line 33 is where the action is happening. Think I might have got it.

export const appReducer = (state=initialState, action) => {
    switch(action.type){
        case 'FETCH_SUCCESS' :
            let tempObj = {};
            let returnObj = {};
            returnObj.eventsToDisplay = state.eventsToDisplay.map((resultsList) => {
                let eventToAdd = eventRandomizer(action.results)
                tempObj[action.provider] = eventToAdd;
                return Object.assign({}, resultsList, tempObj);
            });
            returnObj[action.provider] = action.results;
            return Object.assign({}, state, returnObj);
        
        case 'FETCH_FAILURE' :
            console.log(action.err);
        
        case 'SEARCH_VALUES' :
            console.log(action);
            console.log(action.loc);
            return Object.assign({}, state, {
                search : {
                    loc: action.loc,
                    feel: action.feel
                }
            })

        // case 'EVENTS_TO_DISPLAY' :
        default:
        return state
            
    }
}

