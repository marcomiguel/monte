import React, { Component } from 'react';
import Timer from './Timer';
import TodoApp from './TodoApp';
import MarkDownEditor from './MarkDownEditor';
import Clock from './Clock';
//import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        Hello {this.props.name}<br/>
        <hr/>
        <Timer/><br/>
        <hr/>
        <TodoApp/><br/>
        <hr/>
        <MarkDownEditor/>
        <hr/>
        <Clock time={ new Date() }/>
      </div>
    );
  }
}

export default App;
