import React, {Component} from 'react';

import {connect} from 'react-redux';

import * as actions from '../actions/index';

import {browserHistory} from 'react-router';

export class SearchArea extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const loc = this.location.value;
        const feel = this.feeling.value;
        
        this.props.dispatch(actions.search(loc, feel));
        this.props.dispatch(actions.fetchZomato(loc, feel));
        this.props.dispatch(actions.fetchMovies(loc, feel));
        this.props.dispatch(actions.fetchBandsInTown(loc, feel));
        this.props.dispatch(actions.fetchEventBrite(loc, feel));

        browserHistory.push('/results');
    }

    render() {
        
        return (
            <div className="search-area">
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Where you at?
                        <input type="text" ref={ref => this.location = ref}/>
                    </label>
                    <label>
                        How you feeling?
                        <select ref={ref => this.feeling = ref}>
                            <option value="crazy">Crazy</option>
                            <option value="fun">Fun</option>
                            <option value="laid-back">Laid Back</option>
                            <option value="unique">Unique</option>
                        </select>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
            </div >
        )
    }

}

export default connect()(SearchArea);