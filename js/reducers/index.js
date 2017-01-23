import * as actions from '../actions/index';

const initialState = {
    zomatoResults : {},
    movieResults : {},
    bitResults : {},
    ebResults : {},
    search : {}
}

export const appReducer = (state = initialState, action) => {
    switch(action.type){
        case 'FETCH_SUCCESS' :
            console.log(action);
            let tempObj = {};
            tempObj[action.provider] = action.results;
            return Object.assign({}, state, tempObj)
        
        case 'FETCH_FAILURE' :
            console.log(action.err);
        
        case 'SEARCH_VALUES' :
            console.log(action);
            console.log(action.loc);
            return Object.assign({}, state, {
                search : {
                    loc: action.loc,
                    feel: action.feel
                }
            })
    }
}

