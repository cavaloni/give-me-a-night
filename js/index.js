require('babel-polyfill');

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';

import store from './store';

import {Provider} from 'react-redux';

document.addEventListener('DOMContentLoaded', () => ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('app')
    )
);