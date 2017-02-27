import objectPath from 'object-path';
import immutable from 'object-path-immutable';

//function to randomize the top five events returned
//from each of the api calls, so as not to be repetitive on results
function eventRandomizer(events, not) {
  if (events.length === 1) {
    return 0;
  } else if (events.length === 0) {
    return;
  }

  let eventsLength;
  if (events.length > 5) {
    eventsLength = 5;
  } else {
    eventsLength = events.length;
  }

  function random() {
    return Math.floor((Math.random() * eventsLength));
  }

  let eventNumber;
  while ((eventNumber = random()) == not);
  
  return eventNumber;
}

//initial state
const initialState = {
  search: {},
  eventsToDisplay: [{}, {}, {}],
  clickedBox: {},
  cardSideIsFront: false,
  searching: false,
};

//The dataPaths object stores the strings of the paths to the specific data from each 
//API provider, which is needed for objectPath. This way the algorithm in the appReducer
//of type FETCH_SUCCESS can very simply extract the data. Most importantly, this also makes it very easy
//to add or subtract different types of data for each of the API calls in a straight-forward way.

export const dataPaths = {
  ebResults: {
    image: 'logo.url',
    title: 'name.text',
    location: 'placeholder',
    description: 'description.text',
    link: 'url',
    startTime: 'start.local',
    score: undefined,
  },
  zomatoResults: {
    image: 'restaurant.featured_image',
    title: 'restaurant.name',
    location: 'restaurant.location.address',
    description: 'restaurant.cuisines',
    link: 'restaurant.url',
    startTime: undefined,
    score: 'restaurant.user_rating',
  },
  movieResults: {
    image: 'poster_path',
    title: 'original_title',
    location: undefined,
    description: 'overview',
    link: undefined,
    startTime: undefined,
    score: 'vote_average',
  },
  bitResults: {
    image: 'image.medium.url',
    title: 'title',
    location: 'venue_name',
    description: 'description',
    link: 'url',
    startTime: 'start_time',
    score: undefined,
  },
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      {
        const bigObj = { 
          eventsToDisplay: [{}, {}, {}], //this is predefined to be able to iterate over
        };

        let provider;
        for (provider in action.results) {
          const results = action.results[provider]; //for readability
          let eventToAddIndex; //for the randomizer; to know which index to use
          let newEventToAddIndex; //for the randomizer; to know which index to use
          const indecesOfDisplayed = []; //for randomizer to know which have already been picked
          const tempObj = {}; //individual API provider result

          let eventToAdd; //single individual event, needed for randomizer

          
          for (let i = 0; i <= 2; i++) {
            //randomizer sequence
            eventToAddIndex = eventRandomizer(results);
            indecesOfDisplayed.forEach((index) => {
              if (eventToAddIndex === index) {
                newEventToAddIndex = eventRandomizer(results, eventToAddIndex);
                eventToAddIndex = newEventToAddIndex;
                eventToAdd = results[eventToAddIndex];
                indecesOfDisplayed.push(eventToAddIndex);
              }
            }); 
            eventToAdd = results[eventToAddIndex];

            //create API provider result object and add
            tempObj[provider] = {};
            let key;
            for (key in dataPaths.ebResults) {  //ebResults is used here arbitrarily to iterate over data categories
              if (dataPaths[provider][key] === undefined) {
                tempObj[provider][key] = undefined;
                continue;
              }
              tempObj[provider][key] = objectPath.get(eventToAdd, dataPaths[provider][key]);
            }
            indecesOfDisplayed.push(eventToAddIndex);
            objectPath.set(bigObj, `eventsToDisplay.${i}.${provider}`, tempObj[provider]);
          }
        }
        const fetchObj = immutable.set(state, 'eventsToDisplay', bigObj.eventsToDisplay);
        return fetchObj;
      }

    case 'SEARCH_VALUES':
      {
        return Object.assign({}, state, {
          search: {
            loc: action.loc,
            feel: action.feel,
          },
        });
      }

    case 'CURRENT_CLICKED_BOX':
      {
        const resultsBoxNum = action.num;
        const eventType = action.eventType;
        const clickedState = {
          resultsBoxNum,
          eventType,
        };
        const updatedClickedState = immutable.set(state, 'clickedBox', clickedState);
        return updatedClickedState;
      }

    case 'TOGGLE_CARD_SIDES':
      return immutable.set(state, 'cardSideIsFront', !state.cardSideIsFront);

    case 'TOGGLE_SEARCHING':
      return immutable.set(state, 'searching', !state.searching);
    default:

      return state;

  }
};