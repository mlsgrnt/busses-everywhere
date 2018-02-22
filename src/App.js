import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import vbb from 'vbb-client';
import Locate from './Locate';
import Arrivals from './Arrivals';

class App extends Component {
	constructor() {
		super();

		this.state = {
			station: undefined,
			arrivals: undefined
		};
	}

	handleStation = async nearestStation => {
		const arrivals = await vbb.departures(nearestStation[0].id);
		this.setState({
			arrivals: arrivals,
			station: nearestStation[0]
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
					{this.state.arrivals ? (
						<div>
							{this.state.station.name}
							<Arrivals arrivals={this.state.arrivals} />
						</div>
					) : (
						<Locate handleStation={this.handleStation} />
					)}
				</p>
			</div>
		);
	}
}

export default App;
