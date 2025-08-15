<script>
	const vehicleModes = [
		'nswtrains',
		'metro',
		'lightrailcbdandsoutheast',
		'lightrailparramatta',
		'ferriessydneyferries',
		'ferriesmff',
		'adelaidemetro'
	];
</script>

<svelte:head>
	<title>Select Transport Mode</title>
</svelte:head>

<div class="page-container">
	<h1 class="title">Select a Transport Mode</h1>
	<div class="grid-container">
		{#each vehicleModes as mode}
			<a href="/{mode}" class="card">
				<h2 class="card-title">{mode}</h2>
			</a>
		{/each}
	</div>
</div>

<style>
	.page-container {
		padding: 1rem;
	}
	.title {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 1.5rem;
	}
	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
	}
	.card {
		background-color: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s ease-in-out,
			box-shadow 0.2s ease-in-out;
		text-align: center;
	}
	.card:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
	}
	.card-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
	}
</style>
