<script>
	import '../app.css';
</script>

<nav class="navbar">
	<div class="container">
		<a href="/" class="brand">Public Transport Vehicle History</a>
	</div>
</nav>

<main>
	<slot />
</main>

<style>
	.navbar {
		background-color: #2c3e50;
		color: white;
		padding: 1rem 2rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.container {
		max-width: 1200px;
		margin: 0 auto;
	}
	.brand {
		font-size: 1.5rem;
		font-weight: bold;
		color: white;
		text-decoration: none;
	}
</style>
