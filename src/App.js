import React, { Component } from 'react';
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
			<div className="container">
				{this.state.arrivals ? (
					<div>
						<span className="stationName">{this.state.station.name}</span>
						<Arrivals arrivals={this.state.arrivals} />
					</div>
				) : (
					<Locate handleStation={this.handleStation} />
				)}
			</div>
		);
	}
}

export default App;
