import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import expect from 'expect'; // You can use any testing library
import {dataPaths} from '../js/reducers/index';
import objectPath from 'object-path';

import * as actions from '../js/actions/index';
import chai from 'chai';
const should = chai.should();

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('creates FETCH_SUCCESS when fetching all APIs has been done', () => {
    nock('https://developers.zomato.com/api/v2.1/')
      .get('/search')
      .reply(200, { body: { restaurants:[] }});

      nock('http://api.eventful.com/json/events/')
      .get('/search')
      .reply(200, { body: { events: {
          event: []
      } }});

      nock('https://www.eventbriteapi.com/v3/events/')
      .get('/search')
      .reply(200, { body: { events: [] }});

      nock('https://api.themoviedb.org/3/discover/')
      .get('/movie')
      .reply(200, { body: { results: [] }});

      nock('https://maps.googleapis.com/maps/api/place/js/')
      .get('/AutocompletionService.GetPredictionsJson')
      .reply(200, { body: { photos: [] }});

      nock('https://lh4.googleusercontent.com/')
      .get('/')
      .reply(200, 'http://topradio.com.ua/static/images/sad-no-results.png');

    let testerObj = {};

    Object.keys(dataPaths).forEach((provider) => {
        objectPath.set(testerObj, `${provider}.0.${dataPaths[provider].image}`, 'http://topradio.com.ua/static/images/sad-no-results.png');
        objectPath.set(testerObj, `${provider}.0.${dataPaths[provider].title}`, 'Small Town?');
    });

    const expectedActions = [{ 
        type: 'FETCH_SUCCESS', 
        results: testerObj 
    },
    { type: 'TOGGLE_CARD_SIDES' }, 
    { type: 'TOGGLE_SEARCHING' }
    ];

    const store = mockStore({
        search: {},
        eventsToDisplay: [{}, {}, {}],
        clickedBox: {},
        cardSideIsFront: false,
        searching: false,
    });

    return store.dispatch(actions.fetchResults('portland, or', 'crazy'))
      .then(() => { 
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});