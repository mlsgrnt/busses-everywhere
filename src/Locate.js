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

		const nextStation = this.state.directionalPosition
			? vbb.nearby({
					latitude: this.state.directionalPosition.latitude,
					longitude: this.state.directionalPosition.longitude
				})
			: undefined;

		this.props.handleStation(await nearby, await nextStation);

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
		window.addEventListener('deviceorientation', orientation => {
			this.handleCompassData(orientation.webkitCompassHeading);
		});

		this.getPosition();
		setInterval(() => {
			this.findStop(this.state.position);
		}, 5000);
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
