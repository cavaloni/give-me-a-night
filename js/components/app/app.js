import React, { Component } from 'react';
import SearchArea from '../search-area/search-area';
import { connect } from 'react-redux';
import styles from './styles.css';

export class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div styleName="styles.city" />
        <div styleName="styles.logo">Give Me A Night</div>
        <div styleName="styles.banner" />

        <SearchArea /> {this.props.children}
      </div>
    );
  }
}

const mapStatetoProps = (state, props) => ({ eventsToDisplay: state.eventsToDisplay, search: state.search });

export default connect(mapStatetoProps)(App);