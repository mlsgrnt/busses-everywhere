import React, { Component } from 'react';
import vbb from 'vbb-client';

class Locate extends Component {
	constructor() {
		super();

		this.state = {
			loading: false,
			position: { coords: { latitude: 0, longitude: 0 } },
			facing: undefined
		};
	}

	findStop = async position => {
		const nearby = vbb.nearby({
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});

		this.props.handleStation(await nearby, {
			position: this.state.position,
			facing: this.state.facing
		}); //badhack TODO

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
	};

	componentWillUpdate = (newProps, newState) => {
		if (newState.facing !== this.state.facing) {
			this.findStop(this.state.position);
		}
	};

	handleCompassData = heading => {
		if (heading > 0 && heading <= 180) {
			this.setState({
				facing: 'north'
			});
		}
		if (heading > 181) {
			this.setState({
				facing: 'south'
			});
		}
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
