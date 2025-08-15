<script>
	import SkeletonTable from '$lib/components/SkeletonTable.svelte';
	import { shortDate, shortYear } from '$lib/functions';
	export let data;
	let { vehicleMode, vehicle_id, vehicleDetails } = data;
</script>

<svelte:head>
	<title>{vehicleMode} {vehicle_id}</title>
</svelte:head>

<div class="page-container">
	{#if vehicleDetails}
		<div class="details-card">
			<h1 class="vehicle-id">
				{vehicleDetails.realtime.vehicle_id} (<a href="/{vehicleMode}" class="back">{vehicleMode}</a
				>)
			</h1>
			<p><strong>Model:</strong> {vehicleDetails.realtime.model}</p>
			<p>
				<strong>Route:</strong>
				{vehicleDetails.realtime.route_id} to {vehicleDetails.realtime.trip.destination}
			</p>
			<p><strong>Last Location:</strong> {vehicleDetails.realtime.position.stop_name}</p>
			<p>
				<strong>Coordinates:</strong>
				{vehicleDetails.realtime.position.lat.toFixed(5)}, {vehicleDetails.realtime.position.lng.toFixed(
					5
				)}
			</p>
			<p>
				<strong>Speed:</strong>
				{vehicleDetails.realtime.position.speed.toFixed(2)} km/h
			</p>
			<p><strong>Last Seen:</strong> {shortDate(vehicleDetails.realtime.timestamp * 1000)}</p>
		</div>

		<h2 class="history-title">Trip History</h2>
		<div class="table-container">
			<table class="vehicle-table">
				<thead>
					<tr>
						<th>Date</th>
						<th>Start Time</th>
						{#if vehicleMode === 'lightrailcbdandsoutheast'}
							<th>Coupled</th>
						{/if}
						<th>Route</th>
						<th>First & Last Seen</th>
					</tr>
				</thead>
				<tbody>
					{#each vehicleDetails.trips as trip (trip.key)}
						<tr>
							<td>{shortYear(trip.date)}</td>
							<td>{trip.start_time}</td>
							{#if vehicleMode === 'lightrailcbdandsoutheast'}
								<td
									>{(trip.vehicle_id === vehicleDetails.realtime.vehicle_id
										? trip.coupled_vehicle_id
										: trip.vehicle_id) || 'N/A'}</td
								>
							{/if}
							<td>{trip.route_id} to {trip.destination}</td>
							<td>{shortDate(trip.first_seen * 1000)}<br />{shortDate(trip.last_seen * 1000)}</td>
						</tr>
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
	.details-card {
		background-color: var(--background-secondary);
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px var(--box-shadow-10);
		margin-bottom: 2rem;
	}
	.vehicle-id {
		font-size: 2.5rem;
		font-weight: bold;
		margin-top: 0;
		margin-bottom: 1rem;
	}
	.details-card p {
		font-size: 1.1rem;
		line-height: 1.6;
		margin: 0.5rem 0;
	}
	.history-title {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 1.5rem;
	}
	.table-container {
		overflow-x: auto;
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 4px 6px var(--box-shadow-10);
	}
	.vehicle-table {
		width: 100%;
		border-collapse: collapse;
	}
	.vehicle-table th,
	.vehicle-table td {
		padding: 1rem;
		text-align: left;
		border-bottom: 1px solid #ddd;
	}
	.vehicle-table th {
		background-color: #f7f7f7;
		font-weight: 600;
	}
</style>
