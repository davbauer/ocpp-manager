<script lang="ts">
	interface PaginationProps {
		currentPage: number;
		totalCount: number;
		pageSize?: number;
		onPageChange: (page: number) => void;
		class?: string;
	}

	let {
		currentPage,
		totalCount,
		pageSize = 20,
		onPageChange,
		class: className = ''
	}: PaginationProps = $props();

	const totalPages = $derived(Math.ceil(totalCount / pageSize));
	const hasNextPage = $derived(currentPage < totalPages);
	const hasPreviousPage = $derived(currentPage > 1);

	const startItem = $derived((currentPage - 1) * pageSize + 1);
	const endItem = $derived(Math.min(currentPage * pageSize, totalCount));

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	}

	function nextPage() {
		if (hasNextPage) {
			goToPage(currentPage + 1);
		}
	}

	function previousPage() {
		if (hasPreviousPage) {
			goToPage(currentPage - 1);
		}
	}

	// Generate page numbers to display
	const pageNumbers = $derived(() => {
		const pages: (number | 'ellipsis')[] = [];
		const maxVisible = 7; // Maximum number of page buttons to show

		if (totalPages <= maxVisible) {
			// Show all pages if total is less than max
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			if (currentPage <= 3) {
				// Near the start
				for (let i = 2; i <= 4; i++) {
					pages.push(i);
				}
				pages.push('ellipsis');
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				// Near the end
				pages.push('ellipsis');
				for (let i = totalPages - 3; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				// In the middle
				pages.push('ellipsis');
				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					pages.push(i);
				}
				pages.push('ellipsis');
				pages.push(totalPages);
			}
		}

		return pages;
	});
</script>

<div class="flex flex-col gap-2 {className}">
	<!-- Pagination controls -->
	{#if totalPages > 1}
		<div class="flex items-center justify-between gap-4">
			<!-- Info text -->
			<div class="text-xs text-base-content/70">
				{#if totalCount > 0}
					<span class="font-medium">{startItem}-{endItem}</span> of <span class="font-medium">{totalCount}</span>
				{/if}
			</div>

			<!-- Page controls -->
			<div class="join">
				<!-- Previous button -->
				<button
					class="join-item btn btn-xs"
					disabled={!hasPreviousPage}
					onclick={previousPage}
					aria-label="Previous page"
				>
					«
				</button>

				<!-- Page numbers -->
				{#each pageNumbers() as page}
					{#if page === 'ellipsis'}
						<button class="join-item btn btn-xs btn-disabled">...</button>
					{:else}
						<button
							class="join-item btn btn-xs"
							class:btn-active={page === currentPage}
							onclick={() => goToPage(page)}
							aria-label="Page {page}"
							aria-current={page === currentPage ? 'page' : undefined}
						>
							{page}
						</button>
					{/if}
				{/each}

				<!-- Next button -->
				<button
					class="join-item btn btn-xs"
					disabled={!hasNextPage}
					onclick={nextPage}
					aria-label="Next page"
				>
					»
				</button>
			</div>
		</div>
	{/if}
</div>
