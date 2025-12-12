<script>
	const vehicleModes = [
		{
			path: 'sydneytrains',
			name: 'Sydney Trains',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/TfNSW_T.svg'
		},
		{
			path: 'nswtrains',
			name: 'NSW TrainLink',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/TfNSW_T.svg'
		},
		{
			path: 'metro',
			name: 'Sydney Metro',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/8/89/TfNSW_M.svg'
		},
		{
			path: 'lightrailcbdandsoutheast',
			name: 'Sydney CBDSE Light Rail',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/TfNSW_L.svg'
		},
		{
			path: 'lightrailparramatta',
			name: 'Parramatta Light Rail',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/TfNSW_L.svg'
		},
		{
			path: 'ferriessydneyferries',
			name: 'Sydney Ferries',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/TfNSW_F.svg'
		},
		{
			path: 'ferriesmff',
			name: 'Manly Fast Ferry',
			icon: 'https://assets.myfastferry.com.au/images/2019/12/26221058/cropped-fast_ferry_icon-32x32.png'
		},
		{
			path: 'adelaidemetro',
			name: 'Adelaide Metro',
			icon: 'https://www.adelaidemetro.com.au/__data/assets/image/0005/813623/favicon-2.png'
		}
	];
</script>

<svelte:head>
	<title>VehicleTracker</title>
	<meta name="description" content="Track the history of public transport vehicles" />
	<meta property="og:site_name" content="Vehicle Tracker" />
	<meta property="og:title" content="Vehicles Tracker" />
	<meta property="og:description" content="Track the history of public transport vehicles" />
	<meta property="og:url" content="https://vehicletracker.fishingcat3.com" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Vehicle Tracker" />
	<meta name="twitter:description" content="Track the history of public transport vehicles" />
	<meta name="twitter:url" content="https://vehicletracker.fishingcat3.com" />
</svelte:head>

<main>
	<div class="page-container">
		<h1 class="title">Select a Transit Mode</h1>
		<div class="grid-container">
			{#each vehicleModes as mode}
				<a href="/{mode.path}" class="card">
					{#if mode.icon}
						<img height="25" width="25" src={mode.icon} alt="{mode.name} Roundel" />
					{/if}
					<h2 class="card-title">{mode.name}</h2>
				</a>
			{/each}
		</div>
	</div>

	<footer>
		Sydney Trains is for tracking non timetabled, freight, track inspection or heritage train trips <br
		/>
		NSW TrainLink stores up to 90 days of trips, Sydney Metro stores 60 days and everything else stores
		up to 21 days<br />Vehicle Tracker does not guarantee the accuracy of its data, completeness of
		its data or complete uptime<br /><br />
		Data licensed under
		<a href="https://opendata.transport.nsw.gov.au/datalicence" target="_blank"
			>CC BY 4.0 by TfNSW</a
		><br />
		Data licensed under
		<a href="https://www.adelaidemetro.com.au/developer-info" target="_blank"
			>CC BY 4.0 by Adelaide Metro</a
		>
		<br /><br />

		Visit <a href="https://fishingcat3.com" target="_blank">https://fishingcat3.com</a>
	</footer>
</main>

<style>
	.title {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 1.5rem;
	}
	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}
	footer {
		background-color: var(--background-secondary);
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px var(--box-shadow-10);
		margin-top: 2rem;
	}
</style>
