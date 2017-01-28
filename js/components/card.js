import React from 'react';



export default function Card (props) {
    return (
        <div className="card">
        <img src={props.evtImg} placeholder="Image"/>
        <span>{props.evtName}</span>
        </div>
    )
}