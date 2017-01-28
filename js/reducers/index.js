import * as actions from '../actions/index';
import update from 'immutability-helper';

function eventRandomizer (events, not) {  

    let eventsLength;
    if (events.length > 5) {
        eventsLength = 5
    } else if (events.length === 0) {
        return
    }
    
    else {
        eventsLength = events.length;
    }
    function random() {
        return Math.floor((Math.random() * eventsLength));
    }

    var eventNumber;
    while((eventNumber = random()) == not);
    return eventNumber;
}

const initialState = {
    zomatoResults : {},
    movieResults : {},
    bitResults : {},
    ebResults : {},
    search : {},
    eventsToDisplay : [{}, {}, {}]
}

//yes

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS':

            console.log(action.results)

            let indecesOfDisplayed = [];
            let tempObj = {};
            let returnObj = {};
            let eventToAdd;
            let eventToAddIndex;
            let newEventToAddIndex;

            returnObj.eventsToDisplay = state.eventsToDisplay.map((resultsList) => {
                eventToAddIndex = eventRandomizer(action.results);
                indecesOfDisplayed.forEach((index) => {
                    if (eventToAddIndex === index) {
                        newEventToAddIndex = eventRandomizer(action.results, eventToAddIndex);
                        eventToAddIndex = newEventToAddIndex;
                        eventToAdd = action.results[eventToAddIndex];
                        tempObj[action.provider] = eventToAdd;
                        indecesOfDisplayed.push(eventToAddIndex);
                        return Object.assign({}, resultsList, tempObj);
                    }
                });
    
                eventToAdd = action.results[eventToAddIndex];
                tempObj[action.provider] = eventToAdd;
                indecesOfDisplayed.push(eventToAddIndex);
                return Object.assign({}, resultsList, tempObj);
            });

            // if (action.results.length >= 3) {
            //     returnObj.eventsToDisplay = returnObj.eventsToDisplay.map(resultsList => {
            //         if (isEqual(action.results[resultsList[action.provider].idCheck], resultsList[action.provider])) {
            //             console.log('this happened');
            //             let newEventToAddIndex = eventRandomizer(action.results, eventToAddIndex);
            //             eventToAdd = action.results[newEventToAddIndex];
            //             tempObj[action.provider] = eventToAdd;
            //             return Object.assign({}, resultsList, tempObj)
            //         } else {
            //             return resultsList
            //         }
            //     })
            // }

            returnObj[action.provider] = action.results;
            return Object.assign({}, state, returnObj);

        case 'FETCH_FAILURE':
            console.log(action.err);

        case 'SEARCH_VALUES':
            return Object.assign({}, state, {
                search: {
                    loc: action.loc,
                    feel: action.feel
                }
            })

        case 'RETURN_NEW_PHOTO':
            let index = action.id;
            let currentUpdate = state.eventsToDisplay[index];
            const photoUpdateObj = update(currentUpdate.zomatoResults.restaurant, {
                $merge: {featured_image: action.photo}
            });
            const updatedEventToDisplay = update(currentUpdate, {
                $merge: {
                zomatoResults: { 
                    restaurant: photoUpdateObj
                }}
            })
            const updateParams = {}
            updateParams[index] = {$merge: updatedEventToDisplay}
            const updatedEventsToDisplay = update(state.eventsToDisplay, updateParams);
            const updatedState = update(state, {$merge: {eventsToDisplay: updatedEventsToDisplay}})
            return updatedState
        default:

            return state

    }
}
