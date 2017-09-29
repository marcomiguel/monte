import React, {Component} from 'react';

// class Clock extends Component{

//     constructor(props){
//         super(props);
//         this.state = { time: this.props.time };
//         this._update = this._updateTime.bind(this);
//     }

//     componentDidMount(){
//         this._interval = setInterval(this._update, 1000);
//     }

//     componentWillUnmount(){
//         clearInterval(this._interval);
//     }

//     render(){
//         var time = this._formatTime(this.state.time);
//         return(
//             <h1>{time.hours} : {time.minutes} : {time.seconds}</h1>
//         );
//     }

//     _formatTime(time){
//         var [hours, minutes, seconds] = [
//             time.getHours(),
//             time.getMinutes(),
//             time.getSeconds()
//         ].map(num => num < 10 ? '0' + num : num);
//         return { hours, minutes, seconds };
//     }

//     _updateTime(){
//         this.setState({ time: new Date(this.state.time.getTime() + 1000) });
//     }

// }

// export default Clock;

import Clock from './Clock.jsx';

export default class ClockContainer extends Component{
    constructor(props){
        super(props);
        this.state = { time: this.props.time };
        this._update = this._updateTime.bind(this);
    }

    componentDidMount(){
        this._interval = setInterval(this._update, 1000);
    }

    componentWillUnmount(){
        clearInterval(this._interval);
    }

    render(){
        return <Clock {...this._extract(this.state.time)}/>
    }

    _extract(time){
        return{
            hours: time.getHours(),
            minutes: time.getMinutes(),
            seconds: time.getSeconds()
        }
    }

    _updateTime(){
        this.setState({ time: new Date(this.state.time.getTime() + 1000) });
    }
}