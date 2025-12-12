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
			L.marker([location.lat, location.lng])
				.bindPopup(location.location_name)
				.addTo(locationsGroup);
		}
		console.log(locations.length);
	}

	function updateMapHeight() {
		const pc = document.getElementById('page-container');
		if (!pc) return;
		const height = pc.getBoundingClientRect().height;
		document.getElementById('map').style.height = `${height}px`;
	}

	onMount(() => {
		updateMapHeight();
		const observer = new ResizeObserver(updateMapHeight);
		observer.observe(document.getElementById('page-container'));
		return () => {
			observer.disconnect();
		};
	});

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
				minZoom: 14
			}
		).addTo(map);
		L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
			attribution: `Data <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>, Style: <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA 2.0</a> <a href="https://www.openrailwaymap.org/" target="_blank">OpenRailwayMap</a>`,
			subdomains: 'abc',
			maxZoom: 20,
			minZoom: 14
		}).addTo(map);

		locationsGroup = L.layerGroup([]);
		locationsGroup.addTo(map);

		updateLocations();

		map.on('moveend', updateLocations);
		return () => {};
	});
</script>

<svelte:head>
	<title>GTFS Locations Map</title>
</svelte:head>

<div class="page-container">
	<div id="map">
		<svg class="leaflet-attribution-flag"></svg>
	</div>
</div>

<style>
	:global(html) {
		height: 100%;
	}

	:global(nav) {
		flex: 0;
	}

	:global(body) {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.page-container {
		flex: 1;
	}

	#map {
		padding: 2rem;
		flex: 1;
		border-radius: 8px;
		box-shadow: 0 4px 6px var(--box-shadow-10);
	}
</style>
