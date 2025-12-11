<svelte:head>
	<title>VehicleTracker Sydney Trains</title>
</svelte:head>

<div class="page-container">
	<a href="/locations" class="card">
		<h2 class="card-title">Sydney Trains GTFS Locations</h2>
	</a>
</div>

<style>
	.card {
		background-color: var(--background-secondary);
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px var(--box-shadow-10);
		transition:
			transform 0.2s ease-in-out,
			box-shadow 0.2s ease-in-out;
		text-align: left;
	}
	a {
		display: inline-flex;
		gap: 10px;
	}
	.card:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 12px var(--box-shadow-15);
	}
	.card-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
	}
</style>
