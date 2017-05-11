import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Modal } from 'react-overlays';
import styles from './styles.css';
import moment from 'moment';

const modalStyle = {
  position: 'fixed',
  zIndex: 1040,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  outline: 'none',
};

export class InfoBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.eventsToDisplay[0].bitResults === undefined) {
      return (<div />);
    }
    const thisInfo = this.props.eventsToDisplay[this.props.clickedBox.resultsBoxNum][this.props.clickedBox.eventType];

    let location;
    let startTime;
    let score;
    let link;
    let image;
    let time;

    if (thisInfo.startTime === undefined) {
      time = '';
    } else { time = moment(thisInfo.startTime).format('h:mm a'); }

    const evtType = this.props.clickedBox.eventType;

    if (evtType === 'bitResults' || evtType === 'ebResults' || evtType === 'zomatoResults') {
      location = <div>Location: {thisInfo.location}</div>;
      link = thisInfo.link;
      image = thisInfo.image;
    } else {
      location = <div />;
    }
    if (evtType === 'ebResults' || evtType === 'bitResults') {
      startTime = (<div>Start Time: {time}
      </div>);
      link = thisInfo.link;
      image = thisInfo.image;
    } else {
      startTime = <div />;
    }
    if (evtType === 'zomatoResults' || evtType === 'movieResults') {
      score = (<div>Score: {thisInfo.score.aggregate_rating}/5
            </div>);
      link = thisInfo.link;
      image = thisInfo.image;
    } else {
      score = <div />;
    }
    if (evtType === 'movieResults') {
      const newScore = thisInfo
                .score
                .toString()
                .slice(0, 4);
      score = (<div>Score: {newScore}/10
            </div>);
      const movieName = thisInfo
                .title
                .replace(/[ ]/g, '+');
      link = `https://www.rottentomatoes.com/search/?search=${movieName}`;
      image = `https://image.tmdb.org/t/p/w500${thisInfo.image}`;
    }
    return (

      <Modal
        aria-labelledby="modal-label"
        style={modalStyle}
        backdropStyle={{
          ...modalStyle,
          zIndex: 'auto',
          backgroundColor: '#000',
          opacity: this.props.style.opacity1,
        }}
        onHide={() => {}}
        onBackdropClick={() => {}}
        show={true}
        autoFocus={false}
      >
        <div
          style={{
            transform: `perspective(500px) scaleZ(${this.props.style.scaleZ}) translateZ(200px)`,
            opacity: this.props.style.opacity,
          }}
        >
          <div styleName="styles.pop-up-box">
            <div styleName="styles.close" onClick={browserHistory.goBack}>X</div>
            <h2>{thisInfo.title}</h2>
            <img styleName="styles.box-img" src={image} />
            <div styleName="styles.overflowBox">
              <div styleName="styles.desc">Description: {thisInfo.description}</div>
            </div>
            {location}
            {startTime}
            {score}
            <span>
              <a href={link} target="_blank">More Information</a>
            </span>
          </div>
        </div>
      </Modal>

    );
  }
}

InfoBox.propTypes = {
  style: React.PropTypes.object.isRequired,
  eventsToDisplay: React.PropTypes.array.isRequired,
  clickedBox: React.PropTypes.object.isRequired
}

const mapStateToProps = (state, props) => ({ 
  eventsToDisplay: state.eventsToDisplay, 
  clickedBox: state.clickedBox 
});

export default connect(mapStateToProps)(InfoBox);
