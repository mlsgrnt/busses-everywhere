import React, { Component } from 'react';

import vbb from 'vbb-client';

class Locate extends Component {
	constructor() {
		super();

		this.state = {
			loading: false
		};
	}

	wo = () => {
		navigator.geolocation.watchPosition(
			async position => {
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
			},
			error => {
				console.log(error);
			},
			{ enableHighAccuracy: true }
		);
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
					<span>loading</span>
				) : (
					<button onClick={() => this.wo()}>WOOOOO</button>
				)}
			</span>
		);
	}
}

export default Locate;
