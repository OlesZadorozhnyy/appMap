import React, { Component } from 'react';
import mapConfig from '../mapConfig';

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

		const mapScores = mapConfig.MAP_SCORES;

		for (let scoreId in mapScores) {
			const title = mapScores[scoreId].title;
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