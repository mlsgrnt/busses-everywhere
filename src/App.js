import React, { Component } from 'react';
import './App.css';

import vbb from 'vbb-client';
import Locate from './Locate';
import Arrivals from './Arrivals';

let updateTimeout;

class App extends Component {
	constructor() {
		super();

		this.state = {
			station: { name: '' },
			arrivals: undefined
		};
	}

	getArrivals = async station => {
		//preapre for next time
		//but if we're called eariler reset that timer
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(() => {
			this.getArrivals(this.state.station);
		}, 30000);

		const arrivals = await vbb.departures(station.id);
		this.setState({
			arrivals: arrivals
		});
	};

	handleStation = nearestStations => {
		this.setState({
			station: nearestStations[0]
		});

		this.getArrivals(this.state.station);
	};

	render() {
		return (
			<div className="container">
				<div>
					<span className="stationName">{this.state.station.name}</span>
					<Arrivals arrivals={this.state.arrivals} />
				</div>
				<Locate handleStation={this.handleStation} />
			</div>
		);
	}
}

export default App;
