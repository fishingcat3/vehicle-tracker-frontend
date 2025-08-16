<div class="table-container skeleton">
	<table class="skeleton-table">
		<thead>
			<tr>
				<th><div class="line"></div></th>
				<th><div class="line"></div></th>
				<th><div class="line"></div></th>
				<th><div class="line"></div></th>
				<th><div class="line"></div></th>
			</tr>
		</thead>
		<tbody>
			{#each { length: 15 } as _}
				<tr>
					<td><div class="line"></div></td>
					<td><div class="line"></div></td>
					<td><div class="line"></div></td>
					<td><div class="line"></div></td>
					<td><div class="line"></div></td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	@keyframes pulse {
		0% {
			background-color: #e0e0e0;
		}
		50% {
			background-color: #f0f0f0;
		}
		100% {
			background-color: #e0e0e0;
		}
	}
	.skeleton {
		border-radius: 8px;
		box-shadow: 0 4px 6px var(--box-shadow-10);
		overflow: hidden;
	}
	.skeleton-table {
		width: 100%;
		border-collapse: collapse;
	}
	.skeleton-table th,
	.skeleton-table td {
		padding: 1rem;
		border-bottom: 1px solid #eee;
	}
	.skeleton-table th {
		background-color: var(--background-quaternary);
	}
	.line {
		height: 1.25rem;
		width: 100%;
		border-radius: 4px;
		animation: pulse 1.5s infinite ease-in-out;
	}
</style>
