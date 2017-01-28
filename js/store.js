import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers/index';
import { routerMiddleware } from 'react-router-redux'




const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(reducers.appReducer,  
    composeEnhancers(applyMiddleware(thunk)
));
