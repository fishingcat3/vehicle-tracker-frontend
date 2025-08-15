<script>
	import { onMount } from 'svelte';
	import SkeletonTable from '$lib/components/SkeletonTable.svelte';
	import { shortDate, fetchVehicles } from '$lib/functions.js';

	export let data;
	let { vehicleMode, streamed } = data;
	let vehicleList = [];

	streamed.vehicles.then((resolvedVehicles) => {
		vehicleList = resolvedVehicles;
	});

	onMount(() => {
		const interval = setInterval(async () => {
			vehicleList = await fetchVehicles(vehicleMode);
		}, 90000);
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>Vehicles for {vehicleMode}</title>
</svelte:head>

<div class="page-container">
	<h1 class="title">Vehicles for {vehicleMode}</h1>
	{#await streamed.vehicles}
		<SkeletonTable />
	{:then vehicles}
		<div class="table-container">
			<table class="vehicle-table">
				<thead>
					<tr>
						<th>Vehicle</th>
						{#if vehicleMode === 'lightrailcbdandsoutheast'}
							<th>Coupled</th>
						{/if}
						<th>Model</th>
						<th>Route</th>
						<th>Stop</th>
						<th>Last Seen</th>
					</tr>
				</thead>
				<tbody>
					{#each vehicleList as vehicle (vehicle.vehicle_id)}
						<tr>
							<td>
								<a href={`/${vehicleMode}/${vehicle.vehicle_id}`}>
									{vehicle.vehicle_id}
								</a>
							</td>
							{#if vehicleMode === 'lightrailcbdandsoutheast'}
								<td>{vehicle.coupled_vehicle_id || 'N/A'}</td>
							{/if}
							<td>{vehicle.model}</td>
							<td>{vehicle.route_id} to {vehicle.destination}</td>
							<td>{vehicle.stop_name}</td>
							<td>{shortDate(vehicle.timestamp * 1000)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:catch error}
		<p style="color: red;">Error loading vehicles: {error.message}</p>
	{/await}
</div>

<style>
	.title {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 1.5rem;
	}
	.table-container {
		overflow-x: auto;
		background-color: var(--background-secondary);
		border-radius: 8px;
		box-shadow: 0 4px 6px var(--drop-shadow-10);
	}
	.vehicle-table {
		width: 100%;
		border-collapse: collapse;
	}
	.vehicle-table th,
	.vehicle-table td {
		padding: 1rem;
		text-align: left;
		border-bottom: 1px solid var(--background-tertiary);
	}
	.vehicle-table th {
		background-color: var(--background-tertiary);
		font-weight: 600;
	}
	.vehicle-table tbody tr:hover {
		background-color: var(--background-primary);
	}
</style>
