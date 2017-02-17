require('babel-polyfill');

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app/app';

import InfoBox from './components/info_box/info_box';
import ResultContainer from './components/results-container';

import store from './store';

import {Router, Route, hashHistory, IndexRoute, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import '../css/index.css'


// const history = syncHistoryWithStore(hashHistory, store)

document.addEventListener('DOMContentLoaded', () => ReactDOM.render(
<Provider store={store}>
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path="/results" component={ResultContainer}>
                <Route path="/results/details" component={InfoBox}/>
            </Route>
        </Route>
    </Router>
</Provider>, document.getElementById('app')));