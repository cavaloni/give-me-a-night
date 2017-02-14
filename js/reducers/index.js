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
    search: {},
    eventsToDisplay: [{}, {}, {}],
    clickedBox: {},
    cardSideIsFront: false,
    searching: false
}

export const dataPaths = {
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
        image: 'image.medium.url',
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
        let bigObj = {eventsToDisplay: [{}, {}, {}]};
        
            let res;
            let returnObj = {eventsToDisplay: [{}, {}, {}]};
            for (res in action.results) {
                let provider = res;
                let results = action.results[res];
                let newEventToAddIndex = undefined;
                let indecesOfDisplayed = [];
                let eventToAddIndex;
                let tempObj = {};
                
                let eventToAdd;

            for (i = 0; i <= 2; i++) {
                    eventToAddIndex = eventRandomizer(results);
                    indecesOfDisplayed.forEach((index) => {
                        if (eventToAddIndex === index) {
                            newEventToAddIndex = eventRandomizer(results, eventToAddIndex);
                            eventToAddIndex = newEventToAddIndex;
                            eventToAdd = results[eventToAddIndex];
                            indecesOfDisplayed.push(eventToAddIndex);
                            return
                        }
                    });

                    eventToAdd = results[eventToAddIndex];
                    tempObj[provider] = {};
                    let key;
                    for (key in dataPaths.ebResults) {
                        if (dataPaths[provider][key] === undefined) {
                            tempObj[provider][key] = undefined;
                            continue
                        }
                        tempObj[provider][key] = objectPath.get(eventToAdd, dataPaths[provider][key]);
                    }
                    indecesOfDisplayed.push(eventToAddIndex);
                    objectPath.set(bigObj, `eventsToDisplay.${i}.${provider}`, tempObj[provider])
                };
            }         
        let fetchObj = immutable.set(state, 'eventsToDisplay', bigObj.eventsToDisplay)
         return fetchObj

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

        case 'TOGGLE_CARD_SIDES' :
            return immutable.set(state, 'cardSideIsFront', !state.cardSideIsFront)

        case 'TOGGLE_SEARCHING' :
            return immutable.set(state, 'searching', !state.searching)
        default:

            return state

    }
}