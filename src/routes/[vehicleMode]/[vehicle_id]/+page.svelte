<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import SkeletonTable from '$lib/components/SkeletonTable.svelte';
	import PaginationBar from '$lib/components/PaginationBar.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import { shortDate, shortTime, secondsToHMS, fetchVehicleData } from '$lib/functions';
	export let data;
	let { vehicleMode, vehicle_id, vehicleDetails } = data;

	const UPDATE_PERIOD = 90_000;
	let lastUpdate = Date.now();
	let elapsed = 0;
	let currentPage = $page.url.searchParams.get('page') || 1;
	let totalPages = 1;
	let map, marker;

	async function updateVehicleData(map, marker) {
		if (document.visibilityState === 'visible' && Date.now() - lastUpdate > UPDATE_PERIOD) {
			({ vehicleDetails } = await fetchVehicleData({
				loadFetch: fetch,
				vehicleMode,
				vehicle_id,
				currentPage
			}));
			let pos = vehicleDetails.realtime.position;
			map.panTo([pos.lat, pos.lng], { animate: true, duration: 1.5 });
			marker.setLatLng([pos.lat, pos.lng]);
			lastUpdate = Date.now();
			elapsed = 0;
		}
	}

	function handlePageChange(event) {
		currentPage = event.detail;
		lastUpdate = 0;
		updateVehicleData(map, marker);
	}

	onMount(async () => {
		if (typeof window === 'undefined') return;

		totalPages = vehicleDetails.total_pages;
		let pos = vehicleDetails.realtime.position;
		map = L.map('map').setView([pos.lat, pos.lng], 13);
		L.tileLayer(
			'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}' +
				(L.Browser.retina ? '@2x.png' : '.png'),
			{
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
				subdomains: 'abcd',
				maxZoom: 20,
				minZoom: 6
			}
		).addTo(map);
		L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
			attribution: `Data <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>, Style: <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA 2.0</a> <a href="https://www.openrailwaymap.org/" target="_blank">OpenRailwayMap</a>`,
			subdomains: 'abc',
			maxZoom: 20,
			minZoom: 6
		}).addTo(map);
		marker = L.marker([pos.lat, pos.lng]).addTo(map);

		let interval;

		function startInterval() {
			interval = setInterval(async () => {
				await updateVehicleData(map, marker);
			}, UPDATE_PERIOD);
		}

		startInterval();
		return () => clearInterval(interval);
	});

	function onvisibilitychange() {
		updateVehicleData(map, marker);
	}

	onMount(() => {
		if (typeof window === 'undefined') return;
		const i = setInterval(() => (elapsed += 1), 1000);
		return () => clearInterval(i);
	});

	let navBarHeight = 0;
	const updateNavBarHeight = () =>
		(navBarHeight = document.querySelector('nav').offsetHeight || 59);

	onMount(() => {
		updateNavBarHeight();
		window.addEventListener('scroll', updateNavBarHeight);
		return () => window.removeEventListener('scroll', updateNavBarHeight);
	});
</script>

<svelte:document {onvisibilitychange} />

<svelte:head>
	<title>{vehicle_id} {vehicleMode}</title>
	<meta
		name="description"
		content="{vehicleDetails.realtime.model || 'Unknown vehicle model'}, last seen {shortDate(
			vehicleDetails.realtime.timestamp * 1000
		)}"
	/>
	<meta property="og:site_name" content="Vehicle Tracker" />
	<meta property="og:title" content="{vehicle_id} ({vehicleMode})" />
	<meta
		property="og:description"
		content="{vehicleDetails.realtime.model || 'Unknown vehicle model'}, last seen {shortDate(
			vehicleDetails.realtime.timestamp * 1000
		)}"
	/>
	<meta
		property="og:url"
		content="https://vehicletracker.fishingcat3.com/{vehicleMode}/{vehicle_id}"
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="{vehicle_id} ({vehicleMode})" />
	<meta
		name="twitter:description"
		content="{vehicleDetails.realtime.model || 'Unknown vehicle model'}, last seen {shortDate(
			vehicleDetails.realtime.timestamp * 1000
		)}"
	/>
	<meta
		name="twitter:url"
		content="https://vehicletracker.fishingcat3.com/{vehicleMode}/{vehicle_id}"
	/>
</svelte:head>

<div class="page-container">
	{#if vehicleDetails}
		<div class="details-block">
			<div class="details-card">
				<h1 class="vehicle-id">{vehicle_id}</h1>
				<table class="info-table table-container">
					<tbody>
						<tr><td>Model:</td><td>{vehicleDetails.realtime.model}</td></tr>
						<tr
							><td>Route:</td><td>
								{vehicleDetails.realtime.route_id} ({vehicleDetails.realtime.trip.start_time.slice(
									0,
									-3
								)})
								{#if vehicleDetails.realtime.trip.origin}
									<br />
									{vehicleDetails.realtime.trip.origin} to {vehicleDetails.realtime.trip
										.destination}
								{:else}
									to {vehicleDetails.realtime.trip.destination}{/if}
							</td></tr
						>
						<tr><td>Last Stop:</td><td>{vehicleDetails.realtime.position.stop_name}</td></tr>
						<tr
							><td>Coordinates:</td><td
								>{vehicleDetails.realtime.position.lat.toFixed(5)}°N, {vehicleDetails.realtime.position.lng.toFixed(
									5
								)}°E</td
							></tr
						>
						<tr><td>Bearing:</td><td>{vehicleDetails.realtime.position.dir.toFixed(2)}°</td></tr>
						<tr><td>Speed:</td><td>{vehicleDetails.realtime.position.speed.toFixed(2)} km/h</td></tr
						>
						<tr
							><td>Last Seen:</td><td
								class={((ts) => (ts < 600 ? 'active' : ts < 86400 ? 'semiactive' : 'inactive'))(
									Date.now() / 1000 - vehicleDetails.realtime.timestamp
								)}
							>
								{shortDate(vehicleDetails.realtime.timestamp * 1000)}
								({secondsToHMS(Date.now() / 1000 - vehicleDetails.realtime.timestamp)} ago)</td
							></tr
						>
						<tr
							><td>Last Refresh:</td><td
								>{shortTime(new Date())} (every {secondsToHMS(UPDATE_PERIOD / 1000)}, {secondsToHMS(
									elapsed
								)} ago)</td
							></tr
						>
					</tbody>
				</table>
				<br />
				<Accordion title="Day Summary"
					><table class="info-table">
						<thead><tr><th>Day</th><th>Trips</th><th>Hours</th></tr></thead>
						<tbody>
							{#each vehicleDetails.trips.filter((x) => x.dayText) as day (day.key)}
								<tr><td>{day.dayText}</td><td>{day.dayTrips}</td><td>{day.dayHoursTracked}</td></tr>
							{/each}
						</tbody>
					</table></Accordion
				>
			</div>

			<div id="map">
				<svg class="leaflet-attribution-flag"></svg>
			</div>
		</div>

		<div class="history-title-container" style="--nav-height: {navBarHeight}px">
			<h2 class="history-title">Trip History</h2>
			<PaginationBar {currentPage} {totalPages} on:pageChange={handlePageChange} />
		</div>
		<div class="table-container">
			<table class="vehicle-table">
				<thead>
					<tr>
						<th>Start Time</th>
						{#if vehicleMode === 'lightrailcbdandsoutheast'}
							<th>Coupled</th>
						{/if}
						<th colspan="2">Route</th>
						<th>Tracked</th>
					</tr>
				</thead>
				<tbody>
					{#each vehicleDetails.trips as trip (trip.key)}
						{#if trip.dateHeader}
							<tr class="date-header">
								<td colspan="5">{@html trip.dateHeader}</td>
							</tr>
						{:else}
							<tr>
								<td>{trip.start_time}</td>
								{#if vehicleMode === 'lightrailcbdandsoutheast'}
									<td
										>{(vehicle_id === trip.vehicle_id
											? trip.coupled_vehicle_id
											: trip.vehicle_id) || 'N/A'}</td
									>
								{/if}
								<td style="width: 1px;">{trip.route_id}</td>
								<td>{trip.origin ? `${trip.origin} ` : ''}to {trip.destination}</td>
								<td
									>{shortTime(trip.first_seen * 1000)} - {shortTime(trip.last_seen * 1000)} ({secondsToHMS(
										trip.last_seen - trip.first_seen
									)})</td
								>
							</tr>{/if}
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="details-card">
			<h1 class="vehicle-id">Vehicle Not Found</h1>
			<p>Could not retrieve details for vehicle ID {vehicle_id} ({vehicleMode})</p>
		</div>
	{/if}
</div>

<style>
	.info-table tr td,
	.info-table tr th {
		padding: 0.3rem;
		border-bottom: 1px solid var(--background-tertiary);
	}
	.info-table tr:last-child td {
		border-bottom: none;
	}
	.info-table tr td:first-child {
		font-weight: bold;
		text-align: right;
		white-space: nowrap;
	}
	.details-block {
		display: flex;
		flex-direction: row;
		gap: 16px;
	}
	.details-card {
		background-color: var(--background-secondary);
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px var(--box-shadow-10);
		flex: 1;
	}
	#map {
		padding: 2rem;
		flex: 1;
		border-radius: 8px;
		box-shadow: 0 4px 6px var(--box-shadow-10);
	}
	.vehicle-id {
		font-size: 2rem;
		font-weight: bold;
		margin-top: 0;
		margin-bottom: 1rem;
	}
	.details-card p {
		font-size: 1.1rem;
		line-height: 1.6;
		margin: 0.2rem 0;
	}
	.history-title-container {
		width: 100%;
		display: inline-flex;
		justify-content: space-between;
		padding: 0;
		font-weight: 700;
		padding-top: 1.2rem;
		padding-bottom: 1rem;
		position: sticky;
		background-color: var(--background-primary);
		top: var(--nav-height);
	}
	.history-title {
		margin: 0;
	}
	@media (max-width: 768px) {
		#map {
			min-height: 300px;
		}

		.details-block {
			flex-direction: column;
		}
	}
</style>
