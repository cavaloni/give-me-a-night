import React from 'react';
import ResultBox from './results';
import InfoBox from './info_box/info_box';
import {connect} from 'react-redux';

export function ResultsContainer(props) {
    console.log(props);
    return (
        <div>
            <ResultBox results={props.eventsToDisplay[0]} id="0"/>
            <ResultBox results={props.eventsToDisplay[1]} id="1"/>
            <ResultBox results={props.eventsToDisplay[2]} id="2"/>
            {props.children}
        </div>
    )
}

const mapStatetoProps = (state, props) => ({eventsToDisplay: state.eventsToDisplay, search: state.search});

export default connect(mapStatetoProps)(ResultsContainer)