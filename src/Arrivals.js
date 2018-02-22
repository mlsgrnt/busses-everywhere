import React, { Component } from 'react';

class Arrivals extends Component {
	render() {
		const renderedArrivals = this.props.arrivals.map(arrival => (
			<li>
				{arrival.line.nr} to {arrival.direction}
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
