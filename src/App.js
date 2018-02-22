import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import vbb from 'vbb-client';
import Locate from './Locate';

class App extends Component {
	handleStation = async nearestStation => {
		const arrivals = await vbb.departures(nearestStation[0].id);
		this.setState({
			arrivals: arrivals
		});
	};

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.js</code> and save to reload.
					<Locate handleStation={this.handleStation} />
				</p>
			</div>
		);
	}
}

export default App;
