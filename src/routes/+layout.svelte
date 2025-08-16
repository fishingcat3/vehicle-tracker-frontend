<script>
	import '../app.css';
	import { page } from '$app/stores';

	$: breadcrumbs = $page.url.pathname
		.split('/')
		.filter((segment) => segment !== '')
		.map((segment, index, array) => {
			return {
				name: decodeURIComponent(segment).replace(/-/g, ' '),
				href: '/' + array.slice(0, index + 1).join('/')
			};
		});
</script>

<nav aria-label="breadcrumb">
	<div class="container">
		<ol class="breadcrumbs">
			<li class="breadcrumb-item">
				<a href="/">Vehicle Tracker</a>
			</li>
			{#each breadcrumbs as crumb}
				<li class="breadcrumb-item breadcrumb-separator">/</li>
				<li class="breadcrumb-item">
					{#if crumb.href === $page.url.pathname}
						<a href={crumb.href} aria-current="page">{crumb.name}</a>
					{:else}
						<a href={crumb.href}>{crumb.name}</a>
					{/if}
				</li>
			{/each}
		</ol>
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

	.breadcrumbs {
		display: flex;
		flex-wrap: wrap;
		list-style: none;
		margin-block-end: 0;
		margin-block-start: 0;
		padding-inline-start: 0;
	}

	.breadcrumb-item {
		font-size: 1.4rem;
		font-weight: bold;
		letter-spacing: 0.02rem;
	}

	.breadcrumb-item a {
		color: var(--background-secondary);
		text-decoration: none;
		transition: color 0.2s ease-in-out;
	}

	.breadcrumb-item a:hover {
		color: var(--background-tertiary);
	}

	.breadcrumb-separator {
		font-weight: normal;
		margin: 0 1rem;
		color: var(--background-secondary);
	}
</style>
