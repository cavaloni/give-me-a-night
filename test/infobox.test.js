import configureMockStore from 'redux-mock-store';
import React from 'react';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import storeStateMock from './store_mock';

import InfoBox from '../js/components/info_box/info_box';
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

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
        );
        expect(result.find('InfoBox')).toBeTruthy();
    });
});