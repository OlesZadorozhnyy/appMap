import React, { Component } from 'react';
import GeoJsonAdapter from '../GeoJsonAdapter';

export default class ExportMarkersButton extends Component {

	constructor() {
		super();

		this.downloadLink = null;
	}

	prepareJSON(data) {
		return 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
	}

	onDownload() {
		const exceptElements = ['instance']; // elements to ignore for export
		const markersGeoJson = GeoJsonAdapter.toGeo(this.props.markers, exceptElements);
		const data = this.prepareJSON(markersGeoJson);

		this.downloadLink.setAttribute('href', data);
		this.downloadLink.setAttribute('download', 'markers.json');
		this.downloadLink.click();
	}

	render() {
		const title = 'Export';

		return (
			<div>
				<button type="button" onClick={this.onDownload.bind(this)}>{title}</button>

				<a ref={(ref) => this.downloadLink = ref} className="hidden" />
			</div>
		);
	}
}