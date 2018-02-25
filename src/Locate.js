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
			longitude: this.state.position.coords.longitude,
			results: 1
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
			this.setState({
				orientation: orientation
			});
		});

		this.getPosition();

		//wait for compass to heat up
		setTimeout(() => {
			if (this.state.orientation) {
				setInterval(this.handleCompassData, 750); //this doesn't rely on internet anymore so we can make this much faster
			}
		}, 250);
	};

	handleCompassData = () => {
		const heading = this.state.orientation.webkitCompassHeading;

		this.props.handleDirectionChange(heading, this.state.position.coords);
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
