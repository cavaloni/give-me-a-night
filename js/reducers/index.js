import * as actions from '../actions/index';
import update from 'immutability-helper';
import objectPath from 'object-path';

function eventRandomizer (events, not) {  
    if (events.length == 1) {
        return 0
    }
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
            if (action.photo === 'default') {
                action.photo = "http://freedesignfile.com/upload/2012/10/Restaurant_menu__11-1.jpg"
            }

            let index = action.id;
            let currentUpdate = state.eventsToDisplay[index];
            const photoUpdateObj = update(currentUpdate.zomatoResults.restaurant, {
                $merge: {
                    featured_image: action.photo
                }
            });
            const updatedEventToDisplay = update(currentUpdate, {
                $merge: {
                    zomatoResults: {
                        restaurant: photoUpdateObj
                    }
                }
            })
            const updateParams = {}
            updateParams[index] = {
                $merge: updatedEventToDisplay
            }
            const updatedEventsToDisplay = update(state.eventsToDisplay, updateParams);
            const updatedState = update(state, {
                $merge: {
                    eventsToDisplay: updatedEventsToDisplay
                }
            })
            return updatedState
        
        case 'NO_RESULTS':
            let stateCopy = state;
            let imageTitleRoutes = {
                    ebResults: {
                        image: 'logo',
                        title: 'name.text'
                    },
                    zomatoResults: {
                        image: 'restaurant.featured_image',
                        title:  'restaurant.name'
                    },
                    movieResults: {
                        image: 'poster_path',
                        title: 'original.title'
                    },
                    bitResults: {
                        image: 'image.medium.url',
                        title: 'title'
                    }
                } 
            stateCopy.eventsToDisplay.forEach((list) => {
                objectPath.set(list[action.provider], imageTitleRoutes[action.provider].image, 'http://topradio.com.ua/static/images/sad-no-results.png') ;
                objectPath.set(list[action.provider], imageTitleRoutes[action.provider].title, 'Small Town?');
            })
            return stateCopy
        default:

            return state

    }
}
