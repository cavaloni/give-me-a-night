import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Observable } from 'rxjs/Rx';
import immutable from 'object-path-immutable';
import { RouteTransition } from 'react-router-transition';
import { spring } from 'react-motion';
import ResultBox from './results/results';

export class ResultsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderList: {
        list0: true,
        list1: true,
        list2: true,
      },
    };
  }

  cascadeRender() { //function to render the flip cards as a 'cascade' effect
    const interval = Observable
            .interval(50)
            .take(3);
    interval.subscribe((x) => {
      this.setState(immutable.set(this.state, `renderList.list${x}`, this.props.cardSideIsFront));
    });
  }

  componentWillReceiveProps() {
    this.cascadeRender();
  }

  componentWillMount() {
    this.cascadeRender();
  }

  render() {
    if (this.props.eventsToDisplay === []) {
      return <div />
    }
    return (
      <div>
        <ResultBox
          results={this.props.eventsToDisplay[0]}
          id="1"
          cardSideState={this.state.renderList.list0}
        />
        <ResultBox
          results={this.props.eventsToDisplay[1]}
          id="2"
          cardSideState={this.state.renderList.list1}
        />
        <ResultBox
          results={this.props.eventsToDisplay[2]}
          id="3"
          cardSideState={this.state.renderList.list2}
        />
        <RouteTransition
          style={{ position: 'absolute', outline: 'none' }}
          component={false}
          pathname={this.props.location.pathname}
          atEnter={{
            scaleZ: -100,
            opacity: 0,
            opacity1: 0,
          }}
          atLeave={{
            scaleZ: -100,
            opacity: 0,
            opacity1: 0,
          }}
          atActive={{
            scaleZ: spring(0.001, { stiffness: 202, damping: 21.8 }),
            opacity: 1,
            opacity1: 0.5,
          }}
        >
          {this.props.children}
        </RouteTransition>
      </div>
    );
  }
}


ResultsContainer.propTypes = {
  eventsToDisplay: React.PropTypes.array.isRequired,
  cardSideIsFront: React.PropTypes.bool.isRequired,
  children: React.PropTypes.node.isRequired,
}

const mapStatetoProps = (state, props) => ({ eventsToDisplay: state.eventsToDisplay, search: state.search, cardSideIsFront: state.cardSideIsFront });

export default connect(mapStatetoProps)(ResultsContainer);