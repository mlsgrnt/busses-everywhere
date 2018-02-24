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

	findStop = async () => {
		const nearby = vbb.nearby({
			latitude: this.state.position.coords.latitude,
			longitude: this.state.position.coords.longitude
		});

		this.props.handleStation(await nearby);

		this.setState({
			loading: true
		});
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
					this.findStop();
				}
			},
			error => {
				console.log(error);
			},
			{ enableHighAccuracy: true }
		);
	};

	componentDidMount = () => {
		window.addEventListener('deviceorientation', orientation => {
			this.handleCompassData(orientation.webkitCompassHeading);
		});

		this.getPosition();

		//TEMP TODO FIX
		//because the compass takes a second to spin up
		setInterval(async () => {
			if (this.state.directionalPosition !== undefined) {
				this.props.handleDirectionChange(
					await vbb.nearby({
						latitude: this.state.directionalPosition.latitude,
						longitude: this.state.directionalPosition.longitude
					})
				);
			}
		}, 1500);
	};

	handleCompassData = heading => {
		const goNorth = Math.sin(heading * (Math.PI / 180)) * 0.0001;
		const goEast = Math.cos(heading * (Math.PI / 180)) * 0.0001;

		const directionalLatitude =
			this.state.position.coords.latitude +
			this.state.position.coords.latitude * goEast;
		const directionalLongitude =
			this.state.position.coords.longitude +
			this.state.position.coords.longitude * goNorth;

		this.setState({
			directionalPosition: {
				longitude: directionalLongitude,
				latitude: directionalLatitude
			}
		});
	};

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
