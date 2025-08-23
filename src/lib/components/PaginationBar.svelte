<script>
	import { createEventDispatcher } from 'svelte';

	export let currentPage;
	export let totalPages;

	const dispatch = createEventDispatcher();

	function goToPage(page) {
		if (page < 1 && page > totalPages) return;
		currentPage = page;
		dispatch('pageChange', currentPage);
	}
</script>

<div class="pagination-bar">
	<button
		on:click={() => goToPage(1)}
		disabled={currentPage === 1}
		class="page-button"
		aria-label="first page"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="square"
			stroke-linejoin="square"
		>
			<path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
		</svg>
	</button>
	<button
		on:click={() => goToPage(currentPage - 1)}
		disabled={currentPage === 1}
		class="page-button"
		aria-label="back page"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="square"
			stroke-linejoin="square"
		>
			<path d="M15 17l-5-5 5-5" />
		</svg>
	</button>

	<span class="page-info">Page {currentPage} of {totalPages}</span>

	<button
		on:click={() => goToPage(currentPage + 1)}
		disabled={currentPage === totalPages}
		class="page-button"
		aria-label="forward page"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="square"
			stroke-linejoin="square"
		>
			<path d="M9 17l5-5-5-5" />
		</svg>
	</button>
	<button
		on:click={() => goToPage(totalPages)}
		disabled={currentPage === totalPages}
		class="page-button"
		aria-label="last page"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="square"
			stroke-linejoin="square"
		>
			<path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
		</svg>
	</button>
</div>

<style>
	.pagination-bar {
		display: flex;
		align-items: center;
	}

	.page-button {
		transition: background-color 0.2s;
		background-color: transparent;
		border: none;
		cursor: pointer;
	}

	.page-button:hover:not([disabled]) {
		background-color: var(--background-primary);
	}

	.page-button[disabled] {
		opacity: 0.5;
		cursor: default;
	}

	svg {
		width: 1.6rem;
		height: 1.6rem;
	}
</style>
