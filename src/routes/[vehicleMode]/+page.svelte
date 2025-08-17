<script>
	import { onMount } from 'svelte';
	import SkeletonTable from '$lib/components/SkeletonTable.svelte';
	import { shortDate, fetchVehicles, secondsToHMS } from '$lib/functions.js';

	export let data;
	let { vehicleMode, streamed } = data;
	let vehicleList = [];

	let elapsed = 0;

	streamed.vehicles.then((resolvedVehicles) => {
		vehicleList = resolvedVehicles;
	});

	onMount(() => {
		const interval = setInterval(async () => {
			vehicleList = await fetchVehicles({ loadFetch: fetch, vehicleMode });
			elapsed = 0;
		}, 90000);
		return () => clearInterval(interval);
	});

	onMount(() => {
		const id = setInterval(() => {
			elapsed += 1;
		}, 1000);

		return () => clearInterval(id);
	});
</script>

<svelte:head>
	<title>Vehicles for {vehicleMode}</title>
</svelte:head>

<div class="page-container">
	<h1 class="title">Vehicles for <strong>{vehicleMode}</strong></h1>
	<p>Automatically refreshes every 90 seconds (last refreshed {secondsToHMS(elapsed)} ago)</p>
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
						<th>Last Stop</th>
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
							{#if vehicle.coupled_vehicle_id}
								<td>
									<a href={`/${vehicleMode}/${vehicle.coupled_vehicle_id}`}>
										{vehicle.coupled_vehicle_id}
									</a></td
								>
							{:else if vehicleMode === 'lightrailcbdandsoutheast'}
								<td>N/A</td>
							{/if}
							<td>{vehicle.model}</td>
							<td>{vehicle.route_id} to {vehicle.destination}</td>
							<td>{vehicle.stop_name}</td>
							<td
								class={((ts) => (ts < 600 ? 'active' : ts < 86400 ? 'semiactive' : 'inactive'))(
									Date.now() / 1000 - vehicle.timestamp
								)}>{shortDate(vehicle.timestamp * 1000)}</td
							>
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
		font-weight: 500;
		margin-bottom: 1.5rem;
	}
</style>
