import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions/index';
import Card from './card';

export class ResultBox extends Component {
    constructor(props) {
        super(props)
        this.getRestImages = this.getRestImages.bind(this);
    }
    
    getRestImages () {
        console.log('this worked 2', this.props.results);
        this.props.dispatch(actions.fetchImages(this.props.results.zomatoResults.restaurant.location.address, 
        this.props.results.zomatoResults.restaurant.name, this.props.id))
    }

    render() {
        if (!this.props.results.bitResults) {
            return <div></div>
        }

        const noResultsImage = 'http://topradio.com.ua/static/images/sad-no-results.png'


        if (this.props.results.zomatoResults.restaurant.featured_image === '') {
                this.getRestImages();
        }
        
        const restaurant = this.props.results.zomatoResults.restaurant;

        const movie = {
            image: `https://image.tmdb.org/t/p/w500${this.props.results.movieResults.poster_path}` || noResultsImage,
            title: this.props.results.movieResults.original_title
        }
        'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQEr_CovLbfaLjHIo6JgUfkfVKm' +
            '50Y6yHynVdAALkf4OI__HNDwFQ'
        let concert;
        concert = {
            image: this.props.results.bitResults.image === null
                ? 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQEr_CovLbfaLjHIo6JgUfkfVKm' +
                        '50Y6yHynVdAALkf4OI__HNDwFQ'
                : this.props.results.bitResults.image.medium.url,
            title: this.props.results.bitResults.title
        }

        if (this.props.results.ebResults.logo === null) {
            this.props.results.ebResults.logo = {url: ''};
            this.props.results.ebResults.logo.url = 'http://www.e-xinergia.com/xframework/app/frontend/view/imgs//slides/slide_venta_entradas.png'
        }

        const event = {
            image: this.props.results.ebResults.logo.url || noResultsImage,
            title: this.props.results.ebResults.name.text
        }
        
        

        return (

            <div key={this.props.id} className="results-box">
                <Card evtImg={restaurant.featured_image} evtName={restaurant.name}/>
                <Card evtImg={movie.image} evtName={movie.title}/>
                <Card evtImg={concert.image} evtName={concert.title}/>
                <Card evtImg={event.image} evtName={event.title}/>
            </div>
        )
    }
}


export default connect()(ResultBox);