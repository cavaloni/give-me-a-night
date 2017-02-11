import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions/index';
import {browserHistory} from 'react-router';
import styles from './styles.css';
import GoogleMapLoader from "react-google-maps-loader";
import GooglePlacesSuggest from "react-google-places-suggest";
import classNames from 'classnames';
import immutable from 'object-path-immutable';



const MY_API_KEY = 'AIzaSyBMpe5BQ6Sxg_8rqlOYMz4FzkJuAC7soio'

export class SearchArea extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
        this.state = {
            search: "",
            selectedCoordinate: null,
            suggestRender: ''
        }
    }

    handleSelectSuggest = (suggest, coordinate) => {
        console.log(coordinate);
    this.setState({search: suggest.description, selectedCoordinate: coordinate})
  }

    handleSearchChange = (e) => {
    this.setState({search: e.target.value})
  } 

    handleSubmit(e) {
        e.preventDefault();
        this.props.dispatch(actions.toggleSearching())
        const loc = this.state.search;
        const feel = this.feeling.value;
        // this.props.dispatch(actions.resetFlippers())
        this
            .props
            .dispatch(actions.search(loc, feel));
        this
            .props
            .dispatch(actions.fetchResults(loc, feel));
        browserHistory.push('/results');
    }

    render() {

        let className = classNames({
            hide: !this.props.searching,
            [`loader`]: true
        })
        
        const {search} = this.state
        const {googleMaps} = this.props
    // <div styleName="styles.suggest-container">
    //                     <div styleName="styles.suggest-render">
    // styleName="styles.suggest"

        return (
            <div styleName="styles.search-area">
            <div styleName={`styles.${className}`}>Loading...</div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Where you at?
                        
                        <GooglePlacesSuggest
                            googleMaps={googleMaps}
                            onSelectSuggest={this.handleSelectSuggest}
                            search={search}
                            >
                            <input
                                type="text"
                                value={search}
                                placeholder="Search a location"
                                onChange={this.handleSearchChange}/>
                                
                        </GooglePlacesSuggest>
                    
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
                    <input styleName="styles.submit-button" type="submit" value="Submit"/>
                </form>
            </div >
        )
    }

}

export const goog = GoogleMapLoader(SearchArea, {
  libraries: ["places"],
  key: MY_API_KEY,
})

const mapStateToProps = (state, props) => ({searching: state.searching})

export default connect(mapStateToProps)(goog);