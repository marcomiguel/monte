import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import { One } from './components/One'
// import { Store } from './redux/store'

class App extends Component {
  render() {
    return (
      <div className="App">
        <One/>
      </div>
    );
  }
}

export default App;

/*<div className="App-header">
  <img src={logo} className="App-logo" alt="logo" />
  <h2>Welcome to React</h2>
</div>
<p className="App-intro">
  To get started, edit <code>src/App.js</code> and save to reload.
</p>

<One/>*/