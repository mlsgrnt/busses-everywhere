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
			nextStation: { name: '' },
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

		const arrivals = await vbb.departures(station.id, {
			duration: 120,
			results: 10
		});

		//somehow filter arrivlas here?!
		if (this.state.nextStation.id) {
			const potentialJourney = await vbb.journeys(
				station.id,
				this.state.nextStation.id
			);
			const ourDirection = potentialJourney[0].legs[0].direction;
			for (let i in arrivals) {
				if (arrivals[i].direction !== ourDirection) {
					delete arrivals[i];
				}
			}
		}
		this.setState({
			arrivals: arrivals
		});
	};

	handleStation = (nearestStations, nextStations) => {
		if (nextStations && nextStations[0]) {
			this.setState({
				nextStation: nextStations[0]
			});
		}

		if (!nearestStations[0]) {
			this.setState({
				station: { name: "it's all gone to shit" }
			});
			return;
		}
		this.setState({
			station: nearestStations[0]
		});

		this.getArrivals(this.state.station);
	};

	render() {
		return (
			<div className="container">
				<div>
					<h1 className="stationName">{this.state.station.name}</h1>
					<span>{this.state.nextStation.name}</span>

					<Arrivals arrivals={this.state.arrivals} />
				</div>
				<Locate handleStation={this.handleStation} />
			</div>
		);
	}
}

export default App;
