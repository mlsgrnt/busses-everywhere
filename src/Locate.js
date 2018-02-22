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
		navigator.geolocation.getCurrentPosition(
			async position => {
				const nearby = vbb.nearby({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});

				this.props.handleStation(await nearby);
				this.setState({
					loading: true
				});
			},
			error => {
				console.log(error);
			}
		);
	};

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
