import React, {Component} from 'react';
import {Link} from 'react-router';
import * as actions from '../../actions/index';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import styles from './styles.css';
import classNames from 'classnames';

// let cx = classNames.bind(styles);

export class Card extends Component {
    constructor(props) {
        super(props)
        this.openInfoBox = this.openInfoBox.bind(this);
    }

    openInfoBox() {
        this
            .props
            .dispatch(actions.currentClickedBox(this.props.cardNum, this.props.evtType));
        browserHistory.push('/results/details');
    }


    componentWillMount() {
        this.frontImage = this.props.evtImg;
        this.frontTitle = this.props.evtName;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.flippy) {
            this.backImage = nextProps.evtImg;
            this.backTitle = nextProps.evtName;
        } else {
            this.frontImage = nextProps.evtImg;
            this.frontTitle = nextProps.evtName;
        }
    }

    render() {

        const cardStyleFront = `styles.card${this.props.cardNum} styles.card styles.front`;
        const cardStyleBack = `styles.card${this.props.cardNum} styles.card styles.back`;
        
        let className = classNames({
            flip: !this.props.flippy,
            [`flip-container`]: true
        })

        console.log(className);

        return (
            
            <div className={className}>
                <div className="flipper">
                    <div styleName={cardStyleFront}>
                        <h3>{this.props.title}</h3>
                        <img src={this.frontImage} placeholder="Image" onClick={this.openInfoBox}/>
                        <span>{this.frontTitle}</span>
                    </div>
                    <div styleName={cardStyleBack}>
                        <h3>{this.props.title}</h3>
                        <img src={this.backImage} placeholder="Image" onClick={this.openInfoBox}/>
                        <span>{this.backTitle}</span>
                    </div>
                </div>
            </div>
        )
    }
}



export default connect()(Card);