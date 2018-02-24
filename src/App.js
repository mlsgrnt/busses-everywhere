import React, { Component } from 'react';
import './App.css';

import vbb from 'vbb-client';
import stations from 'vbb-stations';
import autocomplete from 'vbb-stations-autocomplete';

import Locate from './Locate';
import Arrivals from './Arrivals';

let updateTimeout;

class App extends Component {
	constructor() {
		super();

		this.state = {
			station: { name: '' },
			directionMode: false,
			arrivals: undefined,
			filteredArrivals: undefined
		};
	}

	getArrivals = async station => {
		//preapre for next time
		//but if we're called eariler reset that timer
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(() => {
			this.getArrivals(this.state.station);
		}, 30000);

		//populate quicly if first loading
		if (!this.state.arrivals) {
			this.setState({
				arrivals: await vbb.departures(station.id)
			});
		}

		//let the rest trickle in
		const arrivals = await vbb.departures(station.id, {
			duration: 120,
			results: 10
		});

		this.setState({
			arrivals: arrivals,
			filteredArrivals: arrivals
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

	handleDirectionChange = async (heading, position) => {
		console.log('got the dataaa', this.state.arrivals.length);

		let filteredArrivals = [];
		const arrivals = this.state.arrivals;

		for (let i in arrivals) {
			let direction = arrivals[i].direction;
			if (direction.split(', ')[1] !== undefined) {
				//if the destiantion has weird commas in it!
				direction = direction.split(', ')[1];
			}

			const destination = await stations(
				autocomplete(direction, 1, false, false)[0].id
			);

			const locationDifference = {
				updown: destination[0].location.longitude - position.longitude,
				leftright: destination[0].location.latitude - position.latitude
			};

			const oa = locationDifference.updown / locationDifference.leftright;
			const tan = Math.cos(heading * Math.PI / 180);

			const score = (tan - oa) / tan * 100;

			/*console.log(
				direction,
				'with scores',
				oa,
				tan,
				score,
				'at direction',
				heading
			);*/

			if (Math.abs(score) < 100) {
				//100% error seems to be sweet spot
				filteredArrivals.push(arrivals[i]);
			}
		}

		if (filteredArrivals && filteredArrivals.length === 0) {
			//whoopsie hehe
			filteredArrivals = this.state.arrivals;
		}
		this.setState({
			filteredArrivals,
			directionMode: 'debug'
		});
	};

	render() {
		return (
			<div className="container">
				<div>
					<h1 className="stationName">{this.state.station.name}</h1>
					<span>{this.state.directionMode.toString()}</span>

					<Arrivals arrivals={this.state.filteredArrivals} />
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
