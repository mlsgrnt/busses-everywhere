import React, { Component } from 'react';

import { differenceInMinutes, differenceInSeconds } from 'date-fns';
import cleanStationName from './cleanStationName';

class Arrivals extends Component {
	render() {
		const renderMinutes = arrivalTime => {
			const differential = differenceInMinutes(arrivalTime, new Date());

			if (differential === 0) {
				return 'now'; //TODO: seconds?
				//return Math.abs(differenceInSeconds(arrivalTime, new Date()));
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
					{cleanStationName(arrival.direction)}
				</span>
				<strong className="timeTo">{renderMinutes(arrival.when)}</strong>
			</li>
		));

		return (
			<div className="App">
				{this.props.arrivals.length > 0 ? (
					<ul className={'blur ' + this.props.loading}>{renderedArrivals}</ul>
				) : (
					'Crickets'
				)}
			</div>
		);
	}
}

Arrivals.defaultProps = {
	arrivals: []
};

export default Arrivals;
