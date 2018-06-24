import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import ReactDOM from 'react-dom';
import GeoJsonAdapter from '../GeoJsonAdapter';
import MarkerPopup from './MarkerPopup';
import MarkerStatistics from './MarkerStatistics';
import ImportMarkersButton from './ImportMarkersButton';
import ExportMarkersButton from './ExportMarkersButton';
import mainConfig from '../mainConfig';
import mapConfig from '../mapConfig';

import '../Styles/App.css';

export default class App extends Component {

	constructor() {
		super();

		this.state = {
			markers: []
		};

		this.map = null;
		this.isMarkerClicked = false; // flag to check when to create new marker 
	}

	componentDidMount() {
		mapboxgl.accessToken = mainConfig.MAP_BOX_TOKEN;

		this.map = new mapboxgl.Map(mapConfig.MAP_BOX_OPTIONS);
		this.map.on('click', this.onClickMap.bind(this));
	}

	findMarkerById(id) {
		return this.state.markers.find(marker => marker.id === id);
	}

	onClickMap(e) {
		if (this.isMarkerClicked) {
			this.isMarkerClicked = false;
			return;
		}

		const lngLat = e.lngLat.toArray();
		this.createMarker(lngLat);
	}

	onClickMarker() {
		this.isMarkerClicked = true;
	}

	onChangeScore(markerId, scoreId) {
		const marker = this.findMarkerById(markerId);
		const lngLat = marker.geometry.coordinates;

		this.onRemoveMarker(marker.id);
		this.createMarker(lngLat, scoreId);
	}

	onRemoveMarker(id) {
		this.setState((prevState) => {
			return { markers: prevState.markers.filter(marker => marker.id !== id) }
		});

		const marker = this.findMarkerById(id);
		marker.instance.remove();
	}

	onDragEndMarker(id, e) {
		const newCoordinates = e.target.getLngLat().toArray();
		
		this.setState((prevState) => {
			const markers = prevState.markers.map((marker) => {
				if (marker.id == id) {
					marker.geometry.coordinates = newCoordinates;
				}

				return marker;
			})

			return { markers: markers };
		});
	}

	createMarker(lngLat, scoreId = mapConfig.DEFAULT_MAP_SCORE, options = {}) {
		const { markers } = this.state;

		const markerId = (markers.length) ? markers[markers.length - 1].id + 1 : 0;
		const color = mapConfig.MAP_SCORES[scoreId].color;

		const assignedOptions = Object.assign({ draggable: true, color: color }, options);

		const markerInstance = new mapboxgl.Marker(assignedOptions)
			.setLngLat(lngLat)
			.setPopup(this.createMarkerPopup(markerId))
			.addTo(this.map);

		markerInstance.getElement().addEventListener('click', this.onClickMarker.bind(this), false);
		markerInstance.on('dragend', this.onDragEndMarker.bind(this, markerId));

		const elements = { id: +markerId, scoreId: +scoreId, instance: markerInstance };
		const newMarker = GeoJsonAdapter.toFeature(lngLat, color, elements);

		this.setState((prevState) => {
			return { markers: prevState.markers.concat([newMarker])};
		});
	}

	createMarkerPopup(markerId) {
		const popupBlock = document.createElement('div'); 
		ReactDOM.render(<MarkerPopup
			markerId={markerId}
			onChangeScore={this.onChangeScore.bind(this)}
			onRemoveMarker={this.onRemoveMarker.bind(this, markerId)}
		/>, popupBlock); // convert react element to node for mapboxgl popup

		return new mapboxgl.Popup()
			.setDOMContent(popupBlock);
	}

	render() {
		return (
			<div>
				<div id={mapConfig.MAP_BOX_OPTIONS.container}></div>

				<div className="content">
					<MarkerStatistics markers={this.state.markers} />

					<ImportMarkersButton createMarker={this.createMarker.bind(this)} />

					<ExportMarkersButton markers={this.state.markers} />
				</div>
			</div>
		);
	}
}
