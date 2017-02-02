import * as actions from '../actions/index';
import update from 'immutability-helper';
import objectPath from 'object-path';
import immutable from 'object-path-immutable';

function eventRandomizer(events, not) {
    if (events.length == 1) {
        return 0
    }
    let eventsLength;
    if (events.length > 5) {
        eventsLength = 5
    } else if (events.length === 0) {
        return
    } else {
        eventsLength = events.length;
    }

    function random() {
        return Math.floor((Math.random() * eventsLength));
    }

    var eventNumber;
    while ((eventNumber = random()) == not)
    ;
    return eventNumber;
}

const initialState = {
    zomatoResults: {},
    movieResults: {},
    bitResults: {},
    ebResults: {},
    search: {},
    eventsToDisplay: [{}, {}, {}],
    clickedBox: {}
}

const dataPaths = {
    ebResults: {
        image: 'logo.url',
        title: 'name.text',
        location: 'placeholder',
        description: 'description.text',
        link: 'url',
        startTime: 'start.local',
        score: undefined
    },
    zomatoResults: {
        image: 'restaurant.featured_image',
        title: 'restaurant.name',
        location: 'restaurant.location.address',
        description: 'restaurant.cuisines',
        link: 'restaurant.url',
        startTime: undefined,
        score: 'restaurant.user_rating'
    },
    movieResults: {
        image: 'poster_path',
        title: 'original_title',
        location: undefined,
        description: 'overview',
        link: undefined,
        startTime: undefined,
        score: 'popularity'
    },
    bitResults: {
        image: 'image',
        title: 'title',
        location: 'venue_name',
        description: 'description',
        link: 'url',
        startTime: 'start_time',
        score: undefined
    }
}

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS':

            let indecesOfDisplayed = [];
            let tempObj = {};
            let returnObj = {};
            let eventToAdd;
            let eventToAddIndex;
            let newEventToAddIndex;

            returnObj.eventsToDisplay = state
                .eventsToDisplay
                .map((resultsList) => {
                    eventToAddIndex = eventRandomizer(action.results);
                    indecesOfDisplayed.forEach((index) => {
                        if (eventToAddIndex === index) {
                            newEventToAddIndex = eventRandomizer(action.results, eventToAddIndex);
                            eventToAddIndex = newEventToAddIndex;
                            eventToAdd = action.results[eventToAddIndex];
                            indecesOfDisplayed.push(eventToAddIndex);
                            return
                        }
                    });

                    eventToAdd = action.results[eventToAddIndex];
                    tempObj[action.provider] = {};
                    let key;
                    for (key in dataPaths.ebResults) {
                        if (dataPaths[action.provider][key] === undefined) {
                            tempObj[action.provider][key] = undefined;
                            continue
                        }
                        tempObj[action.provider][key] = objectPath.get(eventToAdd, dataPaths[action.provider][key]);
                    }
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
            let card = action.id;
            const updatedState = immutable.set(state, `eventsToDisplay.${card}.zomatoResults.image`, action.photo);            
            return updatedState

        case 'NO_RESULTS':
            let stateCopy = JSON.parse(JSON.stringify(state));
            stateCopy.eventsToDisplay.forEach((list) => {
                list[action.provider].image = 'http://topradio.com.ua/static/images/sad-no-results.png';
                list[action.provider].title = 'Small Town?';
            })
            return stateCopy

        case 'CURRENT_CLICKED_BOX':
            let resultsBoxNum = action.num;
            let eventType = action.eventType;
            const clickedState = {
                resultsBoxNum: resultsBoxNum,
                eventType: eventType
            }
            const updatedClickedState = immutable.set(state, 'clickedBox', clickedState)
            return updatedClickedState

        default:

            return state

    }
}