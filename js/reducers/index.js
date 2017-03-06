import objectPath from 'object-path';
import immutable from 'object-path-immutable';
import dataPaths from '../helper/data_paths';

// function to randomize the top five events returned
// from each of the api calls, so as not to be repetitive on results
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
  while ((eventNumber = random()) === not);

  return eventNumber;
}

// initial state
const initialState = {
  search: {},
  eventsToDisplay: [],
  clickedBox: {},
  cardSideIsFront: false,
  searching: false,
};


export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      {
        const eventsToDisplay = [{}, {}, {}];

        Object.keys(action.results).forEach((provider) => {
          const results = action.results[provider]; // for readability
          let eventToAddIndex; // for the randomizer; to know which index to use
          let newEventToAddIndex; // for the randomizer; if new index needed to prevent duplicates
          const indecesOfDisplayed = []; // for randomizer to know which have already been picked
          let tempResultObj = {}; // individual API provider result
          let eventToAdd; // single individual event, needed for randomizer

          for (let i = 0; i <= 2; i++) {
              // randomizer sequence
            eventToAddIndex = eventRandomizer(results);
            indecesOfDisplayed.forEach((index) => { // this is to prevent duplicates
              if (eventToAddIndex === index) {
                newEventToAddIndex = eventRandomizer(results, eventToAddIndex);
                eventToAddIndex = newEventToAddIndex;
                eventToAdd = results[eventToAddIndex];
                indecesOfDisplayed.push(eventToAddIndex);
              }
            });
            eventToAdd = results[eventToAddIndex];
            indecesOfDisplayed.push(eventToAddIndex);

              // create API provider result object
            tempResultObj = dataPaths.dataCategories.reduce((acc, key) => {
              if (dataPaths[provider][key] === undefined) {
                objectPath.set(acc, `${provider}.${key}`, undefined);
                return acc;
              }
              objectPath.set(acc, `${provider}.${key}`, objectPath.get(eventToAdd, dataPaths[provider][key]));
              return acc;
            }, {});

            objectPath.set(eventsToDisplay, `${i}.${provider}`, tempResultObj[provider]);
          }
        });

        return {
          ...state,
          eventsToDisplay,
        };
      }

    case 'SEARCH_VALUES':
      {
        return {
          ...state,
          search: {
            loc: action.loc,
            feel: action.feel,
          },
        };
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
