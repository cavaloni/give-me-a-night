import React, {Component} from 'react';
import ResultBox from './results/results';
import InfoBox from './info_box/info_box';
import {connect} from 'react-redux';
import {Observable} from 'rxjs/Rx';
import immutable from 'object-path-immutable';

export class ResultsContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            renderList: {
                list0: false,
                list1: false,
                list2: false
            }
        }
    }
    
    cascadeRender() {
        var interval = Observable
            .interval(140)
            .take(3);
        interval.subscribe(x => {
            this.setState(immutable.set(this.state, `renderList.list${x}`, this.props.cardSideIsFront))
        })
    };

    componentWillReceiveProps() {
        this.cascadeRender();
    }

    componentWillMount() {
        this.cascadeRender();
    }

    render() {
        
        return (
        <div>
            <ResultBox results={this.props.eventsToDisplay[0]} id="1" cardSideState={this.state.renderList.list0}/>
            <ResultBox results={this.props.eventsToDisplay[1]} id="2" cardSideState={this.state.renderList.list1}/>
            <ResultBox results={this.props.eventsToDisplay[2]} id="3" cardSideState={this.state.renderList.list2}/>
            {this.props.children}
        </div>
    )
}
}

const mapStatetoProps = (state, props) => (
    {eventsToDisplay: state.eventsToDisplay, 
    search: state.search,
    cardSideIsFront: state.cardSideIsFront
});

export default connect(mapStatetoProps)(ResultsContainer)