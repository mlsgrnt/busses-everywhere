import React, { Component } from 'react';

import { differenceInMinutes } from 'date-fns';

class Arrivals extends Component {
	render() {
		const renderedArrivals = this.props.arrivals.map(arrival => (
			<li
				key={arrival.journeyId}
				className={arrival.line.product}
				id={arrival.line.id}
			>
				<span className="info">
					<strong>
						{arrival.line.symbol + (arrival.line.nr ? arrival.line.nr : '')}
					</strong>{' '}
					{arrival.direction}
				</span>
				<strong className="timeTo">
					{differenceInMinutes(arrival.when, new Date()) === 0
						? 'now'
						: differenceInMinutes(arrival.when, new Date())}
				</strong>
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
