import React, { Component } from 'react';

import { distanceInWords } from 'date-fns';

class Arrivals extends Component {
	render() {
		const renderedArrivals = this.props.arrivals.map(arrival => (
			<li>
				{arrival.line.nr} to {arrival.direction} in{' '}
				{distanceInWords(arrival.when, new Date())}
			</li>
		));

		return (
			<div className="App">
				<ul>{renderedArrivals}</ul>
			</div>
		);
	}
}

export default Arrivals;
