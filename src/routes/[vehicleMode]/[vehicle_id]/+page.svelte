<script>
	import SkeletonTable from '$lib/components/SkeletonTable.svelte';
	export let data;
	let { vehicleDetails } = data;
</script>

<svelte:head>
	<title>Details for {data.vehicle_id}</title>
</svelte:head>

<div class="page-container">
	{#if vehicleDetails}
		<div class="details-card">
			<h1 class="vehicle-id">{vehicleDetails.realtime.vehicle_id}</h1>
			<p><strong>Model:</strong> {vehicleDetails.realtime.model}</p>
			<p><strong>Destination:</strong> {vehicleDetails.realtime.trip.destination}</p>
			<p><strong>Current Location:</strong> {vehicleDetails.realtime.position.stop_name}</p>
		</div>

		<h2 class="history-title">Trip History</h2>
		<div class="table-container">
			<table class="vehicle-table">
				<thead>
					<tr>
						<th>Date</th>
						<th>Start Time</th>
						<th>Destination</th>
						<th>Route ID</th>
					</tr>
				</thead>
				<tbody>
					{#each vehicleDetails.trips as trip (trip.trip_id)}
						<tr>
							<td>{trip.date}</td>
							<td>{trip.start_time}</td>
							<td>{trip.destination}</td>
							<td>{trip.route_id}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<!-- This part will show if load() returned null -->
		<div class="details-card">
			<h1 class="vehicle-id">Vehicle Not Found</h1>
			<p>Could not retrieve details for vehicle ID {data.vehicle_id}.</p>
		</div>
	{/if}
</div>

<style>
	.details-card {
		background-color: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
