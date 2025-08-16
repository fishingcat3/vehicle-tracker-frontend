<script>
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export let title;
	let isOpen = false;
</script>

<div class="accordion">
	<button
		class="accordion-header {isOpen ? 'open' : 'closed'}"
		type="button"
		on:click={() => (isOpen = !isOpen)}
	>
		<span>{title}</span>
	</button>

	{#if isOpen}
		<div class="accordion-content" transition:fly={{ y: -10, duration: 200, easing: quintOut }}>
			<slot />
		</div>
	{/if}
</div>

<style>
	.accordion-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.7rem;
		background-color: var(--background-secondary);
		cursor: pointer;
		border: 1px solid var(--background-tertiary);
		border-radius: 8px;
		font-weight: bold;
		transition: background-color 0.2s ease;
		width: 100%;
		text-align: left;
		font-size: 1.1rem;
	}

	.accordion-header:hover {
		background-color: var(--background-primary);
	}

	.accordion-header.open {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.accordion-content {
		padding: 1rem;
		background-color: var(--background-secondary);
		border: 1px solid var(--background-tertiary);
		border-top: none;
		border-radius: 0 0 8px 8px;
	}
</style>
