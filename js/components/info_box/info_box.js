import React, {Component} from 'react';
import {connect} from 'react-redux';
import styles from './styles.css';
import {browserHistory} from 'react-router';

//butt
export class InfoBox extends Component {
    constructor(props) {
        super(props)
    }

    

    render() {
        
        if (this.props.eventsToDisplay[0].bitResults === undefined) {
            return (<div/>)
        }
        const thisInfo = this.props.eventsToDisplay[this.props.clickedBox.resultsBoxNum][this.props.clickedBox.eventType];

        let location;
        let startTime;
        let score;
        let link;
        let image;
    
        
        const evtType = this.props.clickedBox.eventType;
        console.log(evtType);

        if (evtType === 'bitResults' || evtType === 'ebResults' || evtType === 'zomatoResults') {
            location  = <div>Location: {thisInfo.location}</div>
            link = thisInfo.link;
            image = thisInfo.image;
        } else {location = <div/>}
        if (evtType === 'ebResults' || evtType === 'bitResults') {
            startTime = <div>Start Time: {thisInfo.startTime} </div>
            link = thisInfo.link;
            image = thisInfo.image;
        } else {startTime = <div/>}
        if (evtType === 'zomatoResults' || evtType === 'movieResults') {
            score = <div>Score: {thisInfo.score} </div>
            link = thisInfo.link;
            image = thisInfo.image;
        } else {score = <div/>}
        if (evtType === 'movieResults') {
            const movieName = thisInfo.title.replace(/[ ]/g, '+');
            link = `https://www.rottentomatoes.com/search/?search=${movieName}`;
            image = `https://image.tmdb.org/t/p/w500${thisInfo.image}`;
        }

        return (

            <div styleName={"styles.box"} onClick={browserHistory.goBack}>
                <div styleName="styles.pop-up-box">
                    <h2>{thisInfo.title}</h2>
                    <img styleName="styles.box-img" src={image}/>
                    <div styleName="styles.desc">Description: {thisInfo.description}</div>
                    {location}
                    {startTime}
                    {score}
                    <span>
                        <a href={link}>More Information</a>
                    </span>
                </div>
            </div>
        )
    }
}

const mapStatetoProps = (state, props) => ({eventsToDisplay: state.eventsToDisplay, clickedBox: state.clickedBox});

export default connect(mapStatetoProps)(InfoBox)