import React, { Component } from 'react';
import config from '../config';

export default class MarkerStatistics extends Component {

	itemText(title, value) {
		return (
			<li key={title}>
				<span className="statisticsName">{title + ': '}</span>
				<span className="statisticsValue">{value}</span>
			</li>
		);
	}

	renderStatisticItems() {
		let list = [];

		for (let scoreId in config.MAP_SCORES) {
			const title = config.MAP_SCORES[scoreId].title;
			const markersCountByScoreId = this.props.markers.filter(marker => marker.scoreId === +scoreId).length;

			list.unshift(this.itemText(title, markersCountByScoreId));
		}

		list.unshift(this.itemText('Total', this.props.markers.length));

		return list;
	}

	render() {
		return (
			<ul className="statistics">
				{this.renderStatisticItems()}
			</ul>
		);
	}
}