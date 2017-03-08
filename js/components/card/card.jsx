import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as actions from '../../actions/index';
import styles from './styles.css';

export class Card extends Component {
  constructor(props) {
    super(props);
    this.openInfoBox = this
      .openInfoBox
      .bind(this);
  }

  componentWillMount() {
    if (this.props.evtName.length > 35) { // function to shorten length of description in card
      this.evtName = this
        .props
        .evtName
        .slice(0, 35);
      this.evtName = `${this.evtName}...`;
    }
    this.frontImage = this.props.evtImg;
    this.frontTitle = this.evtName;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.evtName.length > 35) { // function to shorten length of description in card
      this.evtName = nextProps
        .evtName
        .slice(0, 35);
      this.evtName = `${this.evtName}...`;
    }

    if (this.props.flippy) { // render the new results on the appropriate side of flip-card
      this.backImage = nextProps.evtImg;
      this.backTitle = nextProps.evtName;
    } else {
      this.frontImage = nextProps.evtImg;
      this.frontTitle = nextProps.evtName;
    }
  }

  openInfoBox() {
    const row = this.props.resultsBoxNum - 1;
    this
      .props
      .dispatch(actions.currentClickedBox(row, this.props.evtType));
    browserHistory.push('/results/details');
  }

  render() {
    const cardStyleFront = `styles.card${this.props.cardNum} styles.card styles.front`;
    const cardStyleBack = `styles.card${this.props.cardNum} styles.card styles.back`;

    const className = classNames({
      flip: !this.props.flippy,
      'flip-container': true,
    });

    return (

      <div styleName={`styles.${className}`}>
        <div styleName="styles.flipper">
          <div styleName={cardStyleFront}>
            <h3>{this.props.title}</h3>
            <div styleName="styles.darkener">
              <img src={this.frontImage} alt="" placeholder="Image" onClick={this.openInfoBox} />
            </div>
            <span styleName="styles.title">{this.frontTitle}</span>
          </div>
          <div styleName={cardStyleBack}>
            <h3>{this.props.title}</h3>
            <div styleName="styles.darkener">
              <img src={this.backImage} alt="" placeholder="Image" onClick={this.openInfoBox} />
            </div>
            <span styleName="styles.title">{this.backTitle}</span>
          </div>
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  title: React.PropTypes.string.isRequired,
  flippy: React.PropTypes.bool.isRequired,
  cardNum: React.PropTypes.number.isRequired,
  evtName: React.PropTypes.string.isRequired,
  evtImg: React.PropTypes.string.isRequired,
  evtType: React.PropTypes.string.isRequired,
  resultsBoxNum: React.PropTypes.number.isRequired,
};

export default connect()(Card);
