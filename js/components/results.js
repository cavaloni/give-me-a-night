import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions/index';
import Card from './card';
import InfoBox from './info_box/info_box';
import {browserHistory} from 'react-router';

export class ResultBox extends Component {
    constructor(props) {
        super(props)
        this.getRestImages = this
            .getRestImages
            .bind(this);
    }

    getRestImages(nextProps) {
        console.log('fucking again');
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

        let concert;
        concert = {
            image: bitResults.image === null
                ? 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQEr_CovLbfaLjHIo6JgUfkfVKm' +
                        '50Y6yHynVdAALkf4OI__HNDwFQ'
                : bitResults.image.medium.url,
            title: bitResults.title
        }

        // ebResults.image === null     ebResults.image =
        // 'http://www.e-xinergia.com/xframework/app/frontend/view/imgs//slides/slide_ven
        // ta_entradas.png'

        const event = {
            image: ebResults.image || 'http://www.e-xinergia.com/xframework/app/frontend/view/imgs//slides/slide_venta_' +
                    'entradas.png',
            title: ebResults.title
        }

        return (

            <div key={this.props.id} className="results-box">

                <Card evtType="zomatoResults" evtImg={zomatoResults.image} evtName={zomatoResults.title} cardNum={this.props.id}/>
                <Card evtType="movieResults" evtImg={movie.image} evtName={movie.title} cardNum={this.props.id}/>
                <Card evtType="bitResults" evtImg={concert.image} evtName={concert.title} cardNum={this.props.id}/>
                <Card evtType="ebResults" evtImg={event.image} evtName={event.title} cardNum={this.props.id}/>
            </div>
        )
    }
}

export default connect()(ResultBox);