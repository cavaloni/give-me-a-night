import React from 'react';
import Card from './card';

export default function ResultBox(props) {
    return (
        <div>
            <Card image={props}/>
            <Card/>
            <Card/>
            <Card/>
        </div>
    )
}