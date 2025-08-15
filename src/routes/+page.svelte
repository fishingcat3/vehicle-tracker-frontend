<script>
	const vehicleModes = [
		{
			path: 'nswtrains',
			name: 'NSW TrainLink'
		},
		{
			path: 'metro',
			name: 'Sydney Metro'
		},
		{
			path: 'lightrailcbdandsoutheast',
			name: 'Sydney CBDSE Light Rail'
		},
		{
			path: 'lightrailparramatta',
			name: 'Parramatta Light Rail'
		},
		{
			path: 'ferriessydneyferries',
			name: 'Sydney Ferries'
		},
		{
			path: 'ferriesmff',
			name: 'Manly Fast Ferry'
		},
		{
			path: 'adelaidemetro',
			name: 'Adelaide Metro'
		}
	];
</script>

<svelte:head>
	<title>VehicleTracker</title>
</svelte:head>

<div class="page-container">
	<h1 class="title">Select a Transit Mode</h1>
	<div class="grid-container">
		{#each vehicleModes as mode}
			<a href="/{mode.path}" class="card">
				<h2 class="card-title">{mode.name}</h2>
			</a>
		{/each}
	</div>
</div>

<style>
	.title {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 1.5rem;
	}
	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
		gap: 1.5rem;
	}
	.card {
		background-color: var(--background-secondary);
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px var(--box-shadow-10);
		transition:
			transform 0.2s ease-in-out,
			box-shadow 0.2s ease-in-out;
		text-align: left;
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
