import React, { Component } from 'react';
import GeoJsonAdapter from '../GeoJsonAdapter';

export default class ImportMarkersButton extends Component {

	constructor() {
		super();

		this.importInput = null;
	}

	onOpenOwnFiles() {
		this.importInput.click();
	}

	onUploadFile(e) {
		if (!e.target.files.length) return;

		const file = e.target.files[0];

		let reader = new FileReader();
		reader.onload = this.onLoadFileHandler.bind(this);
		reader.readAsText(file);
	}

	onLoadFileHandler(e) {
		const content = this.parseJSON(e.target.result);
		const markers = GeoJsonAdapter.getFeatures(content);

		markers.map((marker) => {
			const lngLat = marker.geometry.coordinates;
			this.props.createMarker(lngLat, marker.scoreId);
		});
	}

	parseJSON(data) {
		try {
			return JSON.parse(data);
		} catch(e) {
			alert('Incorrect JSON.');
		}
	}

	render() {
		const title = 'Import (JSON)';

		return (
			<div>
				<button type="button" onClick={this.onOpenOwnFiles.bind(this)}>
					<input type="file" className="hidden" accept="application/json" ref={(ref) => this.importInput = ref} onChange={this.onUploadFile.bind(this)} />
					{title}
				</button>
			</div>
		);
	}
}