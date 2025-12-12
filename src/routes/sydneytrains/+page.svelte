<svelte:head>
	<title>VehicleTracker Sydney Trains</title>
</svelte:head>

<main>
	<div class="page-container">
		<h1 class="title">Tools for <strong>Sydney Trains</strong></h1>
		<a href="/sydneytrains/map" class="card">
			<h2 class="card-title">GTFS Locations Map</h2>
		</a>
	</div>
</main>

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
		display: flex;
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
