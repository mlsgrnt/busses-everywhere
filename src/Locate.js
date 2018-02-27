import React, { Component } from 'react';
import vbb from 'vbb-client';

class Locate extends Component {
	constructor() {
		super();

		this.state = {
			compassActivated: true,
			orientation: false,
			position: { coords: { latitude: 0, longitude: 0 } },
			compassActiveHack: 0
		};
	}

	findStop = async () => {
		const nearby = vbb.nearby({
			latitude: this.state.position.coords.latitude,
			longitude: this.state.position.coords.longitude,
			results: 1
		});

		this.props.handleStation(await nearby);
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
				orientation: orientation.webkitCompassHeading,
				compassActiveHack: this.state.compassActiveHack + 1
			});
		});

		this.getPosition();
	};

	componentDidUpdate(prevProps, prevState) {
		if (
			this.state.orientation !== false &&
			this.state.compassActiveHack === 10
		) {
			this.setState({
				compassActiveHack: 0
			});
			this.handleCompassData();
		}
	}

	handleCompassData = () => {
		this.props.handleDirectionChange(
			this.state.orientation,
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
			<span className={'locateTouchRegion'} onClick={this.handleTap}>
				<span className={'' + !this.state.compassActivated} />
			</span>
		);
	}
}

export default Locate;
