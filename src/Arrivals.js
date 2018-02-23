import React, { Component } from 'react';

import { distanceInWords } from 'date-fns';

class Arrivals extends Component {
	render() {
		const renderedArrivals = this.props.arrivals.map(arrival => (
			<li
				key={arrival.trip}
				className={arrival.line.product}
				id={arrival.line.id}
			>
				{arrival.line.symbol + (arrival.line.nr ? arrival.line.nr : '')} to{' '}
				{arrival.direction} in{' '}
				<strong>{distanceInWords(arrival.when, new Date())}</strong>
			</li>
		));

		return (
			<div className="App">
				<ul>{renderedArrivals}</ul>
			</div>
		);
	}
}

Arrivals.defaultProps = {
	arrivals: []
};

export default Arrivals;
