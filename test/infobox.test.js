// jest.autoMockOff()
import { render } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import { Modal } from 'react-overlays';

const should = chai.should();

import InfoBox from '../js/components/info_box/info_box';
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

const storeStateMock = {
    clickedBox: {
        resultsBoxNum: 0,
        eventType: 'bitResults'
    },
    eventsToDisplay: [{
        bitResults: {
            image: 'http://topradio.com.ua/static/images/sad-no-results.png',
            title: 'Small Town?',
            location: undefined,
            description: undefined,
            link: undefined,
            startTime: undefined,
            score: undefined
        }
    }]
};

const style = {

        opacity1: 1,
        opacity: 1,
        scaleZ: 1

}

const store = mockStore(storeStateMock);

describe('InfoBox component', function () {  
    it('should display the info box', function () { 
        
        const renderer = mount(
        <Provider store={store} >
            <InfoBox style={style} />
        </Provider>
        )

        console.log(renderer.find('InfoBox').debug());
        const result = renderer.getRenderOutput();
        console.log(result);
    });
});