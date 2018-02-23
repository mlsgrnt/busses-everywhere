import React, { Component } from 'react';
import './App.css';

import vbb from 'vbb-client';
import stations from 'vbb-stations';

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

		//very muchWIP --> TODO TODO TODO
		if (this.state.positionData) {
			for (let i in arrivals) {
				let stationLocation = stations(arrivals[i].direction)[0];
				if (stationLocation) {
					stationLocation = stationLocation.location;
				} else {
					break;
				}

				if (this.state.positionData.facing === 'north') {
					//we're facing north but the station is south? DELETE DAT --> TODO MAKE THIS A LOT SMARTER (line shape)
					if (
						stationLocation.longitude <
						this.state.positionData.position.coords.longitude
					) {
						delete arrivals[i];
					}
				}
				if (this.state.positionData.facing === 'south') {
					//we're facing south but the station is north? DELETE DAT --> TODO MAKE THIS A LOT SMARTER (line shape)
					if (
						stationLocation.longitude >
						this.state.positionData.position.coords.longitude
					) {
						delete arrivals[i];
					}
				}
			}
		}

		this.setState({
			arrivals: arrivals
		});
	};

	handleStation = (nearestStations, positionData) => {
		if (positionData) {
			this.setState({
				positionData
			});
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
					<span className="stationName">{this.state.station.name}</span>
					<Arrivals arrivals={this.state.arrivals} />
				</div>
				<Locate handleStation={this.handleStation} />
			</div>
		);
	}
}

export default App;
