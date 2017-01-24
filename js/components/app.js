import React, { Component } from 'react';
import SearchArea from './search-area';
import ResultBox from './results';
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
            <SearchArea/>
            <ResultBox results={this.props.eventsToDisplay[0]} id="1"/>
            <ResultBox results={this.props.eventsToDisplay[1]} id="2"/>
            <ResultBox results={this.props.eventsToDisplay[2]} id="3"/>
        </div>
    )
    }
}

const mapStatetoProps = (state, props) => ({
    eventsToDisplay: state.eventsToDisplay,
    search: state.search
});

export default connect(mapStatetoProps)(App)