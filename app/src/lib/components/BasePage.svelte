<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		title,
		actions,
		children
	}: { class?: string; title: string; actions?: Snippet<[]>; children?: Snippet<[]> } = $props();
</script>

<div class="bg-base-100 min-h-full {className}">
	<!-- Page Header -->
	<div class="border-base-300 bg-base-200/50 border-b px-6 py-8 sm:px-8">
		<div class="mx-auto max-w-7xl">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h1 class="text-3xl font-bold tracking-tight">{title}</h1>
				{#if actions}
					<div class="flex items-center gap-3">
						{@render actions()}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Page Content -->
	<div class="mx-auto max-w-7xl px-6 py-8 sm:px-8">
		{@render children?.()}
	</div>
</div>
