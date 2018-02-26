import React, { Component } from 'react';
import vbb from 'vbb-client';

class Locate extends Component {
	constructor() {
		super();

		this.state = {
			loading: false,
			compassActivated: true,
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
				setInterval(this.handleCompassData, 200); //this doesn't rely on internet anymore so we can make this much faster
			}
		}, 750);
	};

	handleCompassData = () => {
		this.props.handleDirectionChange(
			this.state.orientation.webkitCompassHeading,
			this.state.position.coords,
			this.state.compassActivated
		);
	};

	handleTap = e => {
		e.preventDefault();

		this.setState(previousState => {
			return { compassActivated: !previousState.compassActivated };
		}, this.handleCompassData); //change right away
	};

	render() {
		return (
			<span
				className={'locateTouchRegion ' + !this.state.compassActivated}
				onClick={this.handleTap}
			/>
		);
	}
}

export default Locate;
