import React, {Component} from 'react';

class Timer extends Component {

    constructor(props){
        super(props);
        this.state = {secondsElapsed: 0};
    }

    tick(){
        this.setState((prevState)=>({
            secondsElapsed: prevState.secondsElapsed + 1
        }));
    }

    componentDidMount(){
        console.log('componentDidMount', this);
        this.interval = setInterval(() => this.tick(),1000);
    }

    componentWillUnmount(){
        console.log('componentWillUnmount');
        clearInterval(this.interval);
    }

    render(){
        return <div>Segundos que han pasado: {this.state.secondsElapsed}</div>;
    }
}

export default Timer;