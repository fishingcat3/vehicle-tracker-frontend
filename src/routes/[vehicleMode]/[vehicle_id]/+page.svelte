<script>
	import { onMount } from 'svelte';
	import SkeletonTable from '$lib/components/SkeletonTable.svelte';
	import { shortDate, shortTime, shortYear, secondsToHMS, fetchVehicleData } from '$lib/functions';
	export let data;
	let { vehicleMode, vehicle_id, vehicleDetails } = data;

	onMount(async () => {
		if (typeof window === 'undefined') return;

		let pos = vehicleDetails.realtime.position;

		let map = L.map('map').setView([pos.lat, pos.lng], 13);
		L.tileLayer(
			'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}' +
				(L.Browser.retina ? '@2x.png' : '.png'),
			{
				attribution:
					'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
				subdomains: 'abcd',
				maxZoom: 18,
				minZoom: 6
			}
		).addTo(map);
		L.tileLayer('http://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
			attribution: `Data <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>, Style: <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA 2.0</a> <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a>`,
			subdomains: 'abc',
			maxZoom: 18,
			minZoom: 6
		}).addTo(map);
		let marker = L.marker([pos.lat, pos.lng]).addTo(map);

		const interval = setInterval(async () => {
			({ vehicleDetails } = await fetchVehicleData({ fetch: loadFetch, vehicleMode, vehicle_id }));
			pos = vehicleDetails.realtime.position;
			map.panTo([pos.lat, pos.lng], { animate: true, duration: 1.5 });
			marker.setLatLng([pos.lat, pos.lng]);
		}, 90000);
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>{vehicle_id} {vehicleMode}</title>
</svelte:head>

<div class="page-container">
	{#if vehicleDetails}
		<div class="details-block">
			<div class="details-card">
				<h1 class="vehicle-id">{vehicle_id}</h1>
				<p><strong>Model:</strong> {vehicleDetails.realtime.model}</p>
				<p>
					<strong>Route:</strong>
					{vehicleDetails.realtime.route_id} to {vehicleDetails.realtime.trip.destination} ({vehicleDetails
						.realtime.trip.start_time})
				</p>
				<p><strong>Location:</strong> {vehicleDetails.realtime.position.stop_name}</p>
				<p>
					<strong>Coordinates:</strong>
					{vehicleDetails.realtime.position.lat.toFixed(5)}°N, {vehicleDetails.realtime.position.lng.toFixed(
						5
					)}°E
				</p>
				<p>
					<strong>Bearing:</strong>
					{vehicleDetails.realtime.position.dir.toFixed(2)}°
				</p>
				<p>
					<strong>Speed:</strong>
					{vehicleDetails.realtime.position.speed.toFixed(2)} km/h
				</p>
				<p>
					<strong>Last Seen:</strong>
					{shortDate(vehicleDetails.realtime.timestamp * 1000)}
					({secondsToHMS(Date.now() / 1000 - vehicleDetails.realtime.timestamp)} ago)
				</p>
				<p><strong>Last Refresh:</strong> {shortTime(new Date())} (every 90 seconds)</p>
				<p>
					<strong>Days:</strong><br />{@html vehicleDetails.trips
						.filter((x) => x.dateHeader)
						.map((x) => x.dateHeader)
						.join('<br />')}
				</p>
			</div>

			<div id="map">
				<svg class="leaflet-attribution-flag"></svg>
			</div>
		</div>

		<h2 class="history-title">Trip History</h2>
		<div class="table-container">
			<table class="vehicle-table">
				<thead>
					<tr>
						<th>Start Time</th>
						{#if vehicleMode === 'lightrailcbdandsoutheast'}
							<th>Coupled</th>
						{/if}
						<th>Route</th>
						<th>Tracked</th>
					</tr>
				</thead>
				<tbody>
					{#each vehicleDetails.trips as trip (trip.key)}
						{#if trip.dateHeader}
							<tr class="date-header">
								<td colspan="5">{trip.dateHeader}</td>
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
								<td>{trip.route_id} to {trip.destination}</td>
								<td>{shortTime(trip.first_seen * 1000)} - {shortTime(trip.last_seen * 1000)}</td>
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
	.history-title {
		font-size: 1.6rem;
		font-weight: bold;
		margin-top: 2rem;
		margin-bottom: 1.2rem;
	}
</style>
