import React, { Component } from 'react';
import config from '../config';

export default class MarkerPopup extends Component {

	renderButton(text, attr) {
		return <button type="button" {...attr}>{text}</button>;
	}

	renderScoreButtons() {
		let list = [];

		for (let scoreId in config.MAP_SCORES) {
			const attributes = {
				onClick: this.props.onChangeScore.bind(this, this.props.markerId, scoreId),
				style: {
					background: config.MAP_SCORES[scoreId].color,
					color: '#fff',
					fontWeight: 'bold'
				}
			};


			list.push(
				<span key={scoreId}>{this.renderButton(scoreId, attributes)}</span>
			);
		}

		return <div>{list}</div>;
	}

	renderRemoveButton() {
		const text = 'Remove';
		const attributes = {
			onClick: this.props.onRemoveMarker
		};

		return <div className="text-center">{this.renderButton(text, attributes)}</div>;
	}

	render() {
		return (
			<div className="popup">
				{this.renderRemoveButton()}

				{this.renderScoreButtons()}
			</div>
		);
	}
}