<script>
	import '../app.css';
</script>

<nav>
	<div class="container">
		<a href="/">Vehicle Tracker</a>
	</div>
</nav>

<main>
	<slot />
</main>

<style>
	nav {
		background-color: var(--background-theme);
		padding: 1rem 2rem;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
	}

	a {
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--background-secondary);
	}
</style>
