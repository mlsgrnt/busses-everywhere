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

	handleStation = async nearestStations => {
		const arrivals = await vbb.departures(nearestStations[0].id);
		this.setState({
			arrivals: arrivals,
			station: nearestStations[0]
		});
	};

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<div className="App-intro">
					{this.state.arrivals ? (
						<div>
							{this.state.station.name}
							<Arrivals arrivals={this.state.arrivals} />
						</div>
					) : (
						<Locate handleStation={this.handleStation} />
					)}
				</div>
			</div>
		);
	}
}

export default App;
