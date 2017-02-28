import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions/index';
import {browserHistory} from 'react-router';
import styles from './styles.css';
import GoogleMapLoader from 'react-google-maps-loader';
import GooglePlacesSuggest from 'react-google-places-suggest';
import classNames from 'classnames';

const MY_API_KEY = 'AIzaSyBMpe5BQ6Sxg_8rqlOYMz4FzkJuAC7soio';

export class SearchArea extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectSuggest = this.handleSelectSuggest.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.state = {
      error: false, //handles city search error message
      selected: false, //selected city
      search: '', //for autocomplete
      selectedCoordinate: null, //for autocomplete
    };
  }

  handleSelectSuggest(suggest, coordinate) {
    this.setState({search: suggest.description, selectedCoordinate: coordinate});
    this.setState({selected: true});
  }

  handleSearchChange(e) {
    this.setState({error: false});
    this.setState({selected: false});
    this.setState({search: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.selected) {
      this.setState({error: true});
      return;
    }
    this.props.dispatch(actions.toggleSearching());
    const loc = this.state.search;
    const feel = this.feeling.value;
    const coordinates = this.state.selectedCoordinate;
    this.props.dispatch(actions.search(loc, feel));
    this.props.dispatch(actions.fetchResults(loc, feel, coordinates));
    browserHistory.push('/results');
  }

  doNothing(e) { //only want form submit on button press, not on enter-key press, to be able to validate city
    e.preventDefault();
  }

  render() {
    const className = classNames({ //determines to display loading spinner
      hide: !this.props.searching,
      loader: true
    });

    const errorClassName = classNames({
      hide: !this.state.error,
      error: true
    });

    const {search} = this.state;
    const {googleMaps} = this.props;

    return (
      <div styleName="styles.search-area">
        <div styleName={`styles.${className}`}>Loading...</div>
        <form onSubmit={this.doNothing}> 
          <label>
            Where are you?

            <GooglePlacesSuggest
              googleMaps={googleMaps}
              onSelectSuggest={this.handleSelectSuggest}
              search={search}
              suggestComponentRestrictions={{
              country: 'United States'
            }}>
              <input
                type="text"
                value={search}
                placeholder="Search a location"
                onChange={this.handleSearchChange}/>

            </GooglePlacesSuggest>

          </label>
          <label>
            How are you feeling?
            <select ref={ref => this.feeling = ref}>
              <option value="crazy">Crazy</option>
              <option value="fun">Fun</option>
              <option value="laid-back">Laid Back</option>
              <option value="unique">Unique</option>
            </select>
          </label>
          <input
            styleName="styles.submit-button"
            type="button"
            value="Submit"
            onClick={this.handleSubmit}/>
        </form>
        <div styleName={`styles.${errorClassName}`}>Enter a valid city</div>
      </div >
    );
  }

}

export const goog = GoogleMapLoader(SearchArea, {
  libraries: ['places'],
  key: MY_API_KEY
});

const mapStateToProps = (state, props) => ({searching: state.searching});

export default connect(mapStateToProps)(goog);
