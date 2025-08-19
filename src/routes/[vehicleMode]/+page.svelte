<script>
	import { onMount } from 'svelte';
	import SkeletonTable from '$lib/components/SkeletonTable.svelte';
	import { shortDate, fetchVehicles, secondsToHMS } from '$lib/functions.js';

	export let data;
	let { vehicleMode, streamed } = data;
	let vehicleList = [];

	const UPDATE_PERIOD = 90_000;
	let lastUpdate = Date.now();
	let elapsed = 0;

	streamed.vehicles.then((resolvedVehicles) => (vehicleList = resolvedVehicles));

	async function updateVehiclesData() {
		if (!(document.visibilityState === 'visible' && Date.now() - lastUpdate > UPDATE_PERIOD))
			return;
		vehicleList = await fetchVehicles({ loadFetch: fetch, vehicleMode });
		lastUpdate = Date.now();
		elapsed = 0;
	}

	onMount(() => {
		let interval;

		function startInterval() {
			interval = setInterval(updateVehiclesData, UPDATE_PERIOD);
		}

		startInterval();
		return () => clearInterval(interval);
	});

	function onvisibilitychange() {
		updateVehiclesData();
	}

	onMount(() => {
		if (typeof window === 'undefined') return;
		const i = setInterval(() => (elapsed += 1), 1000);
		return () => clearInterval(i);
	});
</script>

<svelte:document {onvisibilitychange} />

<svelte:head>
	<title>Vehicles for {vehicleMode}</title>
</svelte:head>

<div class="page-container">
	<h1 class="title">Vehicles for <strong>{vehicleMode}</strong></h1>
	<p>
		Automatically refreshes every {secondsToHMS(UPDATE_PERIOD / 1000)} (last refreshed {secondsToHMS(
			elapsed
		)} ago)
	</p>
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
