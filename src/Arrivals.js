import React, { Component } from 'react';

import { differenceInMinutes, differenceInSeconds } from 'date-fns';

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

		const renderDirection = direction => {
			if (
				direction.split(', ')[1] !== undefined &&
				direction.split(', ')[1].length > 4
			) {
				//if the destiantion has weird commas in it! but we don't want to wind up with Hbf either
				direction = direction.split(', ')[1];
			}

			//strip S + U
			if (direction.split('S ')[1] !== undefined) {
				direction = direction.split('S ')[1];
			}
			if (direction.split('U ')[1] !== undefined) {
				direction = direction.split('U ')[1];
			}

			return direction;
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
					{renderDirection(arrival.direction)}
				</span>
				<strong className="timeTo">{renderMinutes(arrival.when)}</strong>
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
