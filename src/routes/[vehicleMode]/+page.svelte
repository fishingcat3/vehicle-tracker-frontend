<script>
	import { onMount } from 'svelte';
	import SkeletonTable from '$lib/components/SkeletonTable.svelte';

	export let data;
	let { vehicleMode, streamed } = data;
	let vehicleList = [];

	// Handle initial data from the stream
	streamed.vehicles.then((resolvedVehicles) => {
		vehicleList = resolvedVehicles;
	});

	async function refreshVehicles() {
		const response = await fetch(
			`https://gtfs-r-vehicles.up.railway.app/api/realtime/${vehicleMode}`
		);
		const apiData = await response.json();
		let processedVehicles = apiData.results || [];

		if (vehicleMode === 'lightrailcbdandsoutheast') {
			const coupledVehicles = [];
			processedVehicles.forEach((v) => {
				coupledVehicles.push(v);
				if (v.coupled_vehicle_id) {
					const coupled = {
						...v,
						vehicle_id: v.coupled_vehicle_id,
						coupled_vehicle_id: v.vehicle_id
					};
					coupledVehicles.push(coupled);
				}
			});
			processedVehicles = coupledVehicles;
		}

		vehicleList = processedVehicles.sort((a, b) => a.vehicle_id.localeCompare(b.vehicle_id));
	}

	onMount(() => {
		const interval = setInterval(refreshVehicles, 90000); // 90 seconds
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
						<th>Vehicle ID</th>
						{#if vehicleMode === 'lightrailcbdandsoutheast'}
							<th>Coupled Vehicle ID</th>
						{/if}
						<th>Model</th>
						<th>Destination</th>
						<th>Current Stop</th>
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
							<td>{vehicle.trip.destination}</td>
							<td>{vehicle.position.stop_name}</td>
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
	.vehicle-table tbody tr:hover {
		background-color: #f1f1f1;
	}
</style>
