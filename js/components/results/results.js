import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions/index';
import Card from '../card/card';
import InfoBox from '../info_box/info_box';
import {browserHistory} from 'react-router';
import styles from './styles.css'

export class ResultBox extends Component {
    constructor(props) {
        super(props)
        this.getRestImages = this
            .getRestImages
            .bind(this);
    }

    getRestImages(nextProps) {
        this
            .props
            .dispatch(actions.fetchImages(nextProps.results.zomatoResults.location, nextProps.results.zomatoResults.title, nextProps.id))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.results.hasOwnProperty('zomatoResults') && nextProps.results.zomatoResults.image === '') {
                
                this.getRestImages(nextProps);
        }
    }

    render() {
        const {zomatoResults, ebResults, bitResults, movieResults} = this.props.results;

        if (!bitResults) {
            return <div></div>
        }

        const noResultsImage = 'http://topradio.com.ua/static/images/sad-no-results.png'

        const movie = {
            image: `https://image.tmdb.org/t/p/w500${movieResults.image}` || noResultsImage,
            title: movieResults.title
        }

        const concert = {
            image: bitResults.image === null
                ? 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQEr_CovLbfaLjHIo6JgUfkfVKm' +
                        '50Y6yHynVdAALkf4OI__HNDwFQ'
                : bitResults.image.medium.url,
            title: bitResults.title
        }

        const event = {
            image: ebResults.image || 'http://www.e-xinergia.com/xframework/app/frontend/view/imgs//slides/slide_venta_' +
                    'entradas.png',
            title: ebResults.title
        }

        let cardNumInt = Number(this.props.id)
        cardNumInt = cardNumInt + 1

        return (

            <div key={this.props.id} styleName="styles.results-box">
                <h2 styleName="styles.option"> Night {cardNumInt} </h2>
                <Card title="Restaurant" evtType="zomatoResults" evtImg={zomatoResults.image} evtName={zomatoResults.title} cardNum="0"/>
                <Card title="Movie" evtType="movieResults" evtImg={movie.image} evtName={movie.title} cardNum="1"/>
                <Card title="Music Show" evtType="bitResults" evtImg={concert.image} evtName={concert.title} cardNum="2"/>
                <Card title="Local Event" evtType="ebResults" evtImg={event.image} evtName={event.title} cardNum="3"/>
            </div>
        )
    }
}

//butt

export default connect()(ResultBox);