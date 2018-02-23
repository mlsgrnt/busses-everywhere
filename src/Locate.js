import React, { Component } from 'react';

import vbb from 'vbb-client';

class Locate extends Component {
	constructor() {
		super();

		this.state = {
			loading: false,
			position: { coords: { latitude: 0, longitude: 0 } }
		};
	}

	findStop = async position => {
		const nearby = vbb.nearby({
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});

		this.props.handleStation(await nearby);
		/*const nextStationInDirection = this.findDirection(
					await nearby,
					position.coords
				);*/

		this.setState({
			loading: true /*,
					nextStationInDirection*/
		});
		//console.log('next station in direction: ', nextStationInDirection);
	};

	getPosition = () => {
		navigator.geolocation.watchPosition(
			position => {
				if (
					Math.abs(
						position.coords.latitude - this.state.position.coords.latitude
					) > 0.0001 ||
					Math.abs(
						position.coords.longitude - this.state.position.coords.longitude
					) > 0.0001
				) {
					this.setState({
						position
					});
					this.findStop(position);
				}
			},
			error => {
				console.log(error);
			},
			{ enableHighAccuracy: true }
		);
	};

	componentDidMount = () => {
		this.getPosition();
	};
	/*
	findDirection = (nearestStations, position) => {
		console.log(position, position.heading); //for some reason it doesn't work without this
		let facing;

		if (position.heading > 0 && position.heading <= 180) {
			//facing north
			facing = 'north';
		} else if (position.heading > 180) {
			//facing south
			facing = 'south';
		} else {
			//if all fails just return
			return false;
		}

		let i = 1; //start at the second station there is

		while (i < nearestStations.length) {
			let stationLocation = nearestStations[i].location;

			if (facing === 'north') {
				//latitude better be larger
				if (stationLocation.longitude > position.longitude) {
					//console.log('this station is north', nearestStations[i]);
					break;
				}
			}
			if (facing === 'south') {
				//latitude better be smaller
				if (stationLocation.longitude < position.longitude) {
					//console.log('this station is south', nearestStations[i]);
					break;
				}
			}

			i++;
		}

		return nearestStations[i];
	};
*/
	render() {
		return (
			<span className="App">
				{this.state.loading ? (
					<span className="loading" />
				) : (
					<span>
						loading the loading
						{/*<button onClick={() => this.getPosition()}>
							Click Me If Chrome is being shitty
						</button>*/}
					</span>
				)}
			</span>
		);
	}
}

export default Locate;
