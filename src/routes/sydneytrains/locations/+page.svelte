<script>
	import { onMount } from 'svelte';
	import { fetchLocations } from '$lib/functions';
	let locations;

	let map, locationsGroup;

	async function updateLocations() {
		const bounds = map.getBounds();
		const minX = bounds.getWest();
		const minY = bounds.getSouth();
		const maxX = bounds.getEast();
		const maxY = bounds.getNorth();

		locations = await fetchLocations({ loadFetch: fetch, minX, minY, maxX, maxY });

		locationsGroup.clearLayers();
		for (const location of locations) {
			L.marker([location.lat, location.lng]).addTo(locationsGroup);
		}
	}

	onMount(async () => {
		if (typeof window === 'undefined') return;

		map = L.map('map').setView([-33.882653, 151.20598], 17);
		L.tileLayer(
			'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}' +
				(L.Browser.retina ? '@2x.png' : '.png'),
			{
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
				subdomains: 'abcd',
				maxZoom: 20,
				minZoom: 15
			}
		).addTo(map);
		L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
			attribution: `Data <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>, Style: <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA 2.0</a> <a href="https://www.openrailwaymap.org/" target="_blank">OpenRailwayMap</a>`,
			subdomains: 'abc',
			maxZoom: 20,
			minZoom: 15
		}).addTo(map);

		locationsGroup = L.layerGroup([]);
		locationsGroup.addTo(map);

		updateLocations();

		map.on('moveend', updateLocations);
		return () => {};
	});
</script>

<svelte:head>
	<title>VehicleTracker Sydney Trains Locations</title>
</svelte:head>

<div class="page-container">
	<div id="map">
		<svg class="leaflet-attribution-flag"></svg>
	</div>
</div>

<style>
	#map {
		padding: 2rem;
		flex: 1;
		border-radius: 8px;
		box-shadow: 0 4px 6px var(--box-shadow-10);
		height: 50vh;
	}
</style>
