import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import storeStateMock from './store_mock';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';

const should = chai.should();

import SearchArea from '../js/components/search-area/search-area';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
const store = mockStore(storeStateMock);

describe('Search Area Component', function () { 
    it('should display the search area', function () { 
        const renderer = TestUtils.createRenderer();
        renderer.render(
            <Provider store={store}>
            <SearchArea />
            </Provider>);
        const result = renderer.getRenderOutput();
        expect(result).toBeTruthy();
     })
 })