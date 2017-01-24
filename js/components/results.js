import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions/index';
import Card from './card';

export default function ResultBox(props) {
    console.log(props.results);
    if (!props.results.zomatoResults) {
        return <div></div>
        console.log('this was returned')    
    }

    return (
        <div key={props.id}>cl
          <Card evt={props.results.zomatoResults.restaurant.id}/>
             
        </div>
    )
}


// <Card evt={props.results.movieResults}/>
//              <Card evt={props.results.bitResults}/>
//              <Card evt={props.results.ebResults}/>