import React, { Component } from 'react';

import { differenceInMinutes } from 'date-fns';

class Arrivals extends Component {
	render() {
		const renderMinutes = differential => {
			if (differential === 0) {
				return 'now';
			}
			if (differential < 0) {
				return 'here';
			}

			return differential;
		};

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
					{renderMinutes(differenceInMinutes(arrival.when, new Date()))}
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
