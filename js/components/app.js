import React, {Component} from 'react';
import SearchArea from './search-area';

import {connect} from 'react-redux';


export class App extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        console.log(this.props);
        return (
            <div className="app">
                <div className="banner"/>                
                <SearchArea />
                {this.props.children}
            </div>
        )
    }
}

const mapStatetoProps = (state, props) => ({eventsToDisplay: state.eventsToDisplay, search: state.search});

export default connect(mapStatetoProps)(App)