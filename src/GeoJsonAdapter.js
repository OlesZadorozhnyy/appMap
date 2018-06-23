export default class GeoJsonAdapter {

	static toFeature(latLng, color, customElements = {}, customProperties = {}) {
		return {
			type: 'Feature',
			properties: {
				['marker-color']: color,
				...customProperties
			},
			geometry: {
				type: 'Point',
				coordinates: latLng
			},
			...customElements
		};
	}

	static toGeo(items, exceptElements = [], exceptProperties = []) {
		const features = items.map((item) => {
			if (exceptElements.length || exceptProperties.length) {
				let itemCopy = Object.assign({}, item);

				exceptElements.map((exceptElement) => delete itemCopy[exceptElement]);
				exceptProperties.map((exceptProperty) => delete itemCopy[exceptProperty]);

				return itemCopy;
			}

			return item;
		});

		return {
			type: 'FeatureCollection',
			features: features
		};
	}

	static getFeatures(data) {
		return data.features || [];
	}
}