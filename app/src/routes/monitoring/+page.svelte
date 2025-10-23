<script lang="ts">
	import BasePage from '$lib/components/BasePage.svelte';
	import { createMutationChargerCreate, createQueryCharger } from '$lib/queryClient';
	import MonitoringChargerRow from '$lib/components/MonitoringChargerRow.svelte';
	import Scrollable from '$lib/components/Scrollable.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { drawerStore } from '$lib/drawerStore';
	import { z } from 'zod';

	import { page } from '$app/state';
	import { PUBLIC_DEV_BACKEND_URL } from '$env/static/public';
	import { dev } from '$app/environment';

	let currentPage = $state(1);
	const pageSize = 20;

	const queryChargers = $derived(createQueryCharger(currentPage, pageSize, 10000));

	const mutationChargerCreate = createMutationChargerCreate();

	const openCreateDrawer = () => {
		drawerStore.open({
			header: 'Add Charger',
			fields: [
				{
					label: 'Label',
					name: 'label',
					type: 'text',
					defaultValue: '',
					validation: z.string().min(1)
				},
				{
					label: 'Shortcode',
					name: 'shortcode',
					type: 'text',
					defaultValue: 'your-shortcode',
					validation: z
						.string()
						.regex(/^[a-z0-9-]+$/, {
							message:
								'Only lowercase letters, numbers, and dashes are allowed (no spaces or other characters).'
						})
						.min(5, { message: 'Minimum length is 5 characters.' })
						.max(30, { message: 'Maximum length is 30 characters.' })
				}
			] as const,
			actions: [
				{
					label: 'Create',
					key: 'create',
					class: 'btn-primary',
					buttonType: 'submit',
					callback: ({ fieldValues, closeDrawer }) => {
						$mutationChargerCreate.mutate(
							{ friendlyName: fieldValues.label, shortcode: fieldValues.shortcode },
							{
								onSuccess: () => {
									closeDrawer();
								}
							}
						);
					}
				}
			]
		});
	};

	let dialogTutorial: HTMLDialogElement;

	const buildOCPPUrl = (shortcode: string) => {
		const connectionURL = dev ? new URL(PUBLIC_DEV_BACKEND_URL) : page.url;
		const protocol = connectionURL.origin.startsWith('https:') ? 'wss://' : 'ws://';
		const baseURL = connectionURL.origin.replace(/^https?:\/\//, '');
		const path = '/api/ocpp/version/1.6/';
		return {
			protocol,
			baseURL,
			path,
			shortcode,
			toString: () => `${protocol}${baseURL}${path}${shortcode}`
		};
	};

	const ocppURL = buildOCPPUrl('your-shortcode');
</script>

<BasePage title="Monitoring">
	<div class="container mx-auto px-4">
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-2xl font-bold">Chargers</h1>
			<div class="flex gap-x-2">
				<div>
					<button class="btn btn-outline" onclick={() => dialogTutorial.showModal()}
						>Tutorial</button
					>
					<dialog bind:this={dialogTutorial} class="modal">
						<div class="modal-box min-w-[50svw]">
							<form method="dialog">
								<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
							</form>
							<h3 class="mb-10 text-lg font-bold">Tutorial for connecting a charging station</h3>
							<p class="mb-4">To connect a charger using OCPP, follow the steps below:</p>
							<ul class="mb-6 list-inside list-disc">
								<li>
									Determine your charger's unique identifier (referred to as <span class="font-bold"
										>shortcode</span
									>).
								</li>
								<li>
									Use the following URL format:
									<div
										class="tooltip tooltip-top"
										data-tip="Protocol depends on whether your site uses HTTP or HTTPS"
									>
										<code class="mt-2 block rounded-sm bg-gray-200 p-2">
											<span class="text-blue-600">{ocppURL.protocol}</span>
											<span class="text-green-600">{ocppURL.baseURL}</span>
											<span class="text-purple-600">{ocppURL.path}</span>
											<span class="text-red-600">{ocppURL.shortcode}</span>
										</code>
									</div>
								</li>
								<li>
									For example, with the shortcode "<span class="font-bold">{ocppURL.shortcode}</span
									>", the URL is:
									<div
										class="tooltip tooltip-right"
										data-tip="Replace shortcode with your charger's unique identifier"
									>
										<code class="mt-2 block rounded-sm bg-gray-200 p-2 text-blue-600"
											>{ocppURL.toString()}</code
										>
									</div>
								</li>
							</ul>
							<p class="mb-4">
								Once the URL is used, the OCPP Manager will detect the charger automatically, and
								you can approve the connection.
							</p>
							<p>If you have any questions, please open an issue in the GitHub repository.</p>
							<p class="mt-6 text-sm font-medium">
								PS: Username and password authentication is currently not supported.
							</p>
						</div>
					</dialog>
				</div>
				<button class="btn btn-primary" onclick={openCreateDrawer}>Add Charger</button>
			</div>
		</div>
		
		{#if $queryChargers.isPending}
			<div class="flex justify-center py-12">
				<span class="loading loading-spinner loading-lg"></span>
			</div>
		{:else if $queryChargers.data?.data && $queryChargers.data.data.length > 0}
			<Pagination
				currentPage={currentPage}
				totalCount={$queryChargers.data?.total_count ?? 0}
				pageSize={pageSize}
				onPageChange={(newPage) => {
					currentPage = newPage;
				}}
				class="mb-4"
			/>

			<Scrollable class="p-4" maxHeight="80svh">
				<div class="space-y-6">
					{#each $queryChargers.data.data as charger}
						<MonitoringChargerRow {charger} />
					{/each}
				</div>
			</Scrollable>
		{:else}
			<div class="bg-base-200 rounded-lg p-8 text-center">
				<p class="text-base-content">No chargers found</p>
			</div>
		{/if}
	</div>
</BasePage>
