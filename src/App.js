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
			directionMode: false,
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

		this.setState({
			arrivals: arrivals
		});
	};

	handleStation = nearestStations => {
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

	handleDirectionChange = async nextStations => {
		const nextStation = nextStations[0];
	/*	//somehow filter arrivlas here?!
		if (nextStation.id) {
			console.log(
				await vbb.departures(this.state.station.id, {
					nextStation: nextStation.id
				})
			);
*/
			const potentialJourney = await vbb.journeys(
				this.state.station.id,
				nextStation.id
			);

			const ourDirection = potentialJourney[0].legs[0].direction;

			const arrivals = this.state.arrivals;
			for (let i in arrivals) {
				if (arrivals[i].direction !== ourDirection) {
					delete arrivals[i];
				}
			}
			this.setState({
				filteredArrivals: arrivals,
				directionMode: 'debug' + nextStation.name
			});
		}
	};

	render() {
		return (
			<div className="container">
				<div>
					<h1 className="stationName">{this.state.station.name}</h1>
					<span>{this.state.directionMode.toString()}</span>

					<Arrivals
						arrivals={
							this.state.filteredArrivals
								? this.state.filteredArrivals
								: this.state.arrivals
						}
					/>
				</div>
				<Locate
					handleStation={this.handleStation}
					handleDirectionChange={this.handleDirectionChange}
				/>
			</div>
		);
	}
}

export default App;
