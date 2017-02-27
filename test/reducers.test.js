import expect from 'expect';
import {appReducer} from '../js/reducers/index';
import * as actions from '../js/actions/index';
import objectPath from 'object-path';
import {dataPaths} from '../js/reducers/index';

const iniState = {
    search: {},
    eventsToDisplay: [
        {}, {}, {}
    ],
    clickedBox: {},
    cardSideIsFront: false,
    searching: false
};

describe('app reducer', () => {
    it('should return the initial state', () => {
        expect(appReducer(undefined, {})).toEqual(iniState);
    });

    it('should updated with search results', () => {

        let testerObj = {};

        Object
            .keys(dataPaths)
            .forEach((provider) => {
                objectPath.set(testerObj, `${provider}.0.${dataPaths[provider].image}`, 'http://topradio.com.ua/static/images/sad-no-results.png');
                objectPath.set(testerObj, `${provider}.0.${dataPaths[provider].title}`, 'Small Town?');
            });

        let resultTestObj = JSON.parse(JSON.stringify(iniState));

        let resultsStateObj = [];
        iniState
            .eventsToDisplay
            .forEach(() => {
                let resultSet = {};
                Object
                    .keys(dataPaths)
                    .forEach((provider) => {
                        let result = {};
                        Object.assign(result, {
                            image: 'http://topradio.com.ua/static/images/sad-no-results.png',
                            title: 'Small Town?',
                            location: undefined,
                            description: undefined,
                            link: undefined,
                            startTime: undefined,
                            score: undefined
                        });
                        objectPath.set(resultSet, `${provider}`, result);
                    });
                resultsStateObj.push(resultSet);
            });
        objectPath.set(resultTestObj, 'eventsToDisplay', resultsStateObj);

        expect(appReducer(undefined, {
            type: 'FETCH_SUCCESS',
            results: testerObj
        })).toEqual(resultTestObj);
    });

    it('should update the search values', () => {

        expect(appReducer(undefined, {
            type: 'SEARCH_VALUES',
            loc: 'home',
            feel: 'funky'
        })).toEqual({
            search: {
                loc: 'home',
                feel: 'funky'
            },
            eventsToDisplay: [
                {}, {}, {}
            ],
            clickedBox: {},
            cardSideIsFront: false,
            searching: false
        });

    });

    it('should update the clickedBox state', () => {
        expect(appReducer(undefined, {
            type: 'CURRENT_CLICKED_BOX',
            num: 0,
            eventType: 'my event'
        })).toEqual({
            search: {},
            eventsToDisplay: [
                {}, {}, {}
            ],
            clickedBox: {
                resultsBoxNum: 0,
                eventType: 'my event'
            },
            cardSideIsFront: false,
            searching: false
        });
    });
});