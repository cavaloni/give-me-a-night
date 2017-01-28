require('babel-polyfill');

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';
import SearchArea from './components/search-area';
import ResultBox from './components/results';

import store from './store';

import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {Provider} from 'react-redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

// const history = syncHistoryWithStore(hashHistory, store)

document.addEventListener('DOMContentLoaded', () => ReactDOM.render(
    <Provider store={store}>
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={SearchArea}/>
            <Route path="/results" component={ResultBox}/>
        </Route>
    </Router>
</Provider>, document.getElementById('app')));