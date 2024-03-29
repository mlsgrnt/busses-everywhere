import React, { Component } from 'react';
import './App.css';

import vbb from 'vbb-client';
import stations from 'vbb-stations';
import autocomplete from 'vbb-stations-autocomplete';
import victor from 'victor';
import cleanStationName from './cleanStationName';

import Locate from './Locate';
import Arrivals from './Arrivals';
import { Textfit } from 'react-textfit';

let updateTimeout;

class App extends Component {
	constructor() {
		super();

		this.state = {
			station: { name: 'Locating' },
			arrivals: undefined,
			filteredArrivals: localStorage.getItem('staleArrivals')
				? JSON.parse(localStorage.getItem('staleArrivals'))
				: undefined,
			loading: true
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (
			nextState.filteredArrivals === undefined ||
			nextState.filteredArrivals.length === 0
		) {
			return false;
		}
		return true;
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevState.station.name !== this.state.station.name) {
			this.setState({
				loading: true
			});
		}
	};

	getArrivals = async station => {
		//preapre for next time
		//but if we're called eariler reset that timer
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(() => {
			this.getArrivals(this.state.station);
		}, 15000);

		//populate quicly if first loading

		if (!this.state.arrivals) {
			this.setState({
				filteredArrivals: await vbb.departures(station.id),
				loading: false
			});
		}

		//let the rest trickle in
		const arrivals = await vbb.departures(station.id, {
			duration: 120,
			results: 10
		});

		//save it to storage
		localStorage.setItem(
			'staleArrivals',
			JSON.stringify(arrivals.slice(0, 10))
		);

		//commit!
		this.setState(
			{
				arrivals: arrivals,
				filteredArrivals: arrivals,
				loading: false
			},
			() => {
				//filter! (if applicable)
				if (this.state.compassActivated !== undefined) {
					this.handleDirectionChange(
						this.state.heading,
						this.state.position,
						this.state.compassActivated
					);
				}
			}
		);
	};

	handleStation = nearestStations => {
		if (!nearestStations[0]) {
			this.setState({
				station: {
					name:
						"You're not in Berlin. This error message has prevented a crash."
				}
			});
			return;
		}
		this.setState({
			station: nearestStations[0]
		});

		this.getArrivals(this.state.station);
	};

	handleDirectionChange = async (heading, position, compassActivated) => {
		//for later, when we clkean this all up
		this.setState({
			heading,
			position,
			compassActivated
		});

		if (this.state.loading === true || compassActivated === false) {
			//to fully disable
			if (this.state.filteredArrivals !== this.state.arrivals) {
				this.setState({
					filteredArrivals: this.state.arrivals
				});
			}
		} else {
			let filteredArrivals = [];
			const arrivals = this.state.arrivals;

			for (let i in arrivals) {
				let direction = arrivals[i].direction;
				if (direction.split(', ')[1] !== undefined) {
					//if the destiantion has weird commas in it!
					direction = direction.split(', ')[1];
				}

				const autocompleted = autocomplete(direction, 1, false, false);

				const destination = await stations(
					autocompleted[0] ? autocompleted[0].id : undefined
				);

				if (destination === undefined) {
					//we can't find the destination. let's add it just to be safe
					//TODO: in the future look at the next stop of this line! --> use stations.nextStop to figure it out --> the "fallback algorithm"
					filteredArrivals.push(arrivals[i]);
					continue;
				}

				const me = new victor(position.latitude, position.longitude);
				const you = new victor(
					destination[0].location.latitude,
					destination[0].location.longitude
				);

				const us = you.subtract(me);
				const magnitude = us.magnitude();

				const score = Math.abs(us.horizontalAngleDeg() - heading);
				const errorThreshhold = 55 + magnitude * 100;

				/*console.log(
					direction,
					'with scores',
					score,
					'with errorThreshold',
					errorThreshhold,
					'with vectorAngle',
					us.horizontalAngleDeg(),
					'at direction',
					heading
				);*/

				if (score < errorThreshhold) {
					filteredArrivals.push(arrivals[i]);
				}
			}

			if (filteredArrivals && filteredArrivals.length === 0) {
				//whoopsie hehe
				filteredArrivals = this.state.arrivals;
			}
			this.setState({
				filteredArrivals
			});
		}
	};

	render() {
		return (
			<div className="container">
				<div>
					<Locate
						handleStation={this.handleStation}
						handleDirectionChange={this.handleDirectionChange}
					/>
					<h1 className="stationName">
						<Textfit mode="single" min={10} max={70}>
							{cleanStationName(this.state.station.name)}
						</Textfit>
					</h1>

					<Arrivals
						arrivals={this.state.filteredArrivals}
						loading={this.state.loading}
					/>
				</div>
			</div>
		);
	}
}

export default App;
