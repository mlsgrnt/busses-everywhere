import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import positions from 'vbb-positions-stream';

class App extends Component {
	componentDidMount() {
		positions([52.4983, 13.3917, 52.4984, 13.3918]).on('data', console.log);
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.js</code> and save to reload.
				</p>
			</div>
		);
	}
}

export default App;
