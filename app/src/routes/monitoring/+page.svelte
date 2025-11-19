<script lang="ts">
	import BasePage from '$lib/components/BasePage.svelte';
	import { createMutationChargerCreate, createQueryCharger } from '$lib/queryClient';
	import ChargerCard from '$lib/components/ChargerCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { drawerStore } from '$lib/drawerStore';
	import { z } from 'zod';
	import { Plug, Zap, Activity, Server, Info, Wifi, WifiOff, Bolt } from 'lucide-svelte';
	import { Dialog } from '@ark-ui/svelte/dialog';
	import { Portal } from '@ark-ui/svelte/portal';

	import { page } from '$app/state';
	import { PUBLIC_DEV_BACKEND_URL } from '$env/static/public';
	import { dev } from '$app/environment';
	import { hClient } from '$lib/hClient';

	let currentPage = $state(1);
	const pageSize = 20;
	let showTutorial = $state(false);

	const queryChargers = $derived(createQueryCharger(currentPage, pageSize, 10000));

	// Fetch all connectors for all chargers
	let allConnectors = $state<Record<number, any[]>>({});

	$effect(() => {
		const chargers = $queryChargers.data?.data || [];

		// Fetch connectors for each charger
		Promise.all(
			chargers.map(async (charger) => {
				try {
					const response = await hClient.connector.charger[':id'].detail.$get({
						param: { id: charger.id.toString() }
					});
					const data = await response.json();
					return { chargerId: charger.id, connectors: data.data || [] };
				} catch (error) {
					console.error(`Failed to fetch connectors for charger ${charger.id}:`, error);
					return { chargerId: charger.id, connectors: [] };
				}
			})
		).then((results) => {
			const newConnectors: Record<number, any[]> = {};
			results.forEach(({ chargerId, connectors }) => {
				newConnectors[chargerId] = connectors;
			});
			allConnectors = newConnectors;
		});
	});

	const mutationChargerCreate = createMutationChargerCreate();

	// Calculate overview stats from chargers
	const overviewStats = $derived(() => {
		const data = $queryChargers.data?.data || [];

		let totalPower = 0;
		Object.values(allConnectors).forEach((connectors) => {
			connectors.forEach((connector: any) => {
				if (connector.telemetry?.meterValue?.raw) {
					const powerData = connector.telemetry.meterValue.raw
						.flatMap((entry: any) => entry.sampledValue || [])
						.find((item: any) => item.measurand === 'Power.Active.Import' && !item.phase);
					if (powerData) {
						totalPower += parseFloat(powerData.value) || 0;
					}
				}
			});
		});

		return {
			totalChargers: data.length,
			online: data.filter((c) => c.connectivity === 'Online').length,
			offline: data.filter((c) => c.connectivity === 'Offline').length,
			totalPower: totalPower / 1000 // Convert W to kW
		};
	});

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
	{#snippet actions()}
		<button class="btn btn-ghost btn-sm gap-2" onclick={() => (showTutorial = true)}>
			<Info class="size-4" />
			Tutorial
		</button>
		<button class="btn btn-primary btn-sm gap-2" onclick={openCreateDrawer}>
			<Plug class="size-4" />
			Add Charger
		</button>
	{/snippet}

	<!-- Tutorial Dialog -->
	<Dialog.Root open={showTutorial} onOpenChange={(e) => (showTutorial = e.open)}>
		<Portal>
			<Dialog.Backdrop class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
			<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
				<Dialog.Content
					class="bg-base-100 max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl shadow-2xl"
				>
					<div class="p-6">
						<Dialog.Title class="mb-4 text-2xl font-bold"
							>Connect Your Charging Station</Dialog.Title
						>
						<Dialog.Description class="mb-6 text-sm opacity-70">
							Follow these steps to connect your OCPP-compatible charger
						</Dialog.Description>

						<div class="space-y-6">
							<div class="alert alert-info">
								<Info class="size-5" />
								<div>
									<div class="font-semibold">OCPP 1.6 WebSocket Connection</div>
									<div class="mt-1 text-xs">This manager uses OCPP 1.6 protocol over WebSocket</div>
								</div>
							</div>

							<div class="space-y-4">
								<div>
									<h4 class="mb-2 flex items-center gap-2 font-semibold">
										<span class="badge badge-primary badge-sm">1</span>
										Create a charger shortcode
									</h4>
									<p class="text-sm opacity-70">
										Choose a unique identifier for your charger (lowercase letters, numbers, and
										dashes only)
									</p>
								</div>

								<div>
									<h4 class="mb-2 flex items-center gap-2 font-semibold">
										<span class="badge badge-primary badge-sm">2</span>
										Build the OCPP URL
									</h4>
									<div class="bg-base-200 space-y-2 rounded-lg p-4">
										<div class="font-mono text-xs">
											<span class="text-info">{ocppURL.protocol}</span>
											<span class="text-success">{ocppURL.baseURL}</span>
											<span class="text-secondary">{ocppURL.path}</span>
											<span class="text-error">{ocppURL.shortcode}</span>
										</div>
										<p class="text-xs opacity-60">
											Replace <code class="text-error">{ocppURL.shortcode}</code> with your charger's
											unique identifier
										</p>
									</div>
								</div>

								<div>
									<h4 class="mb-2 flex items-center gap-2 font-semibold">
										<span class="badge badge-primary badge-sm">3</span>
										Configure your charger
									</h4>
									<p class="text-sm opacity-70">
										Enter the OCPP URL in your charger's configuration interface
									</p>
								</div>

								<div>
									<h4 class="mb-2 flex items-center gap-2 font-semibold">
										<span class="badge badge-primary badge-sm">4</span>
										Approve the connection
									</h4>
									<p class="text-sm opacity-70">
										Once connected, the charger will appear in the monitoring page. You can then
										approve it from the charger details.
									</p>
								</div>
							</div>

							<div class="alert">
								<Server class="size-5" />
								<div class="text-xs">
									<div class="font-semibold">Authentication</div>
									<div class="mt-1 opacity-70">
										Username and password authentication is not currently supported
									</div>
								</div>
							</div>
						</div>

						<div class="mt-6 flex justify-end gap-2">
							<Dialog.CloseTrigger class="btn btn-primary">Got it!</Dialog.CloseTrigger>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Positioner>
		</Portal>
	</Dialog.Root>

	{#if $queryChargers.isPending}
		<div class="flex flex-col items-center justify-center py-32">
			<span class="loading loading-spinner loading-lg text-primary mb-4"></span>
			<p class="text-sm opacity-60">Loading chargers...</p>
		</div>
	{:else if $queryChargers.data?.data && $queryChargers.data.data.length > 0}
		<!-- Overview Stats -->
		{@const stats = overviewStats()}
		<div class="mb-8">
			<h2 class="mb-4 flex items-center gap-2 text-lg font-bold">
				<Activity class="size-5" />
				System Overview
			</h2>
			<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
				<div class="stats border-base-300 bg-base-100 border shadow">
					<div class="stat p-4">
						<div class="stat-figure text-primary">
							<Server class="size-8" />
						</div>
						<div class="stat-title text-xs">Total Chargers</div>
						<div class="stat-value text-primary text-3xl">{stats.totalChargers}</div>
						<div class="stat-desc mt-1">In system</div>
					</div>
				</div>
				<div class="stats border-base-300 bg-base-100 border shadow">
					<div class="stat p-4">
						<div class="stat-figure text-success">
							<Wifi class="size-8" />
						</div>
						<div class="stat-title text-xs">Online</div>
						<div class="stat-value text-success text-3xl">{stats.online}</div>
						<div class="stat-desc mt-1">
							{stats.totalChargers > 0
								? Math.round((stats.online / stats.totalChargers) * 100)
								: 0}% connected
						</div>
					</div>
				</div>
				<div class="stats border-base-300 bg-base-100 border shadow">
					<div class="stat p-4">
						<div class="stat-figure text-error">
							<WifiOff class="size-8" />
						</div>
						<div class="stat-title text-xs">Offline</div>
						<div class="stat-value text-error text-3xl">{stats.offline}</div>
						<div class="stat-desc mt-1">Disconnected</div>
					</div>
				</div>
				<div class="stats border-base-300 bg-base-100 border shadow">
					<div class="stat p-4">
						<div class="stat-figure text-warning">
							<Bolt class="size-8" />
						</div>
						<div class="stat-title text-xs">Total Power</div>
						<div class="stat-value text-warning text-3xl">{stats.totalPower.toFixed(1)}</div>
						<div class="stat-desc mt-1">kW in use</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Chargers Grid -->
		<div class="grid gap-6 xl:grid-cols-2">
			{#each $queryChargers.data.data as charger (charger.id)}
				<ChargerCard {charger} connectors={allConnectors[charger.id] || []} />
			{/each}
		</div>

		<div class="mt-8">
			<Pagination
				{currentPage}
				totalCount={$queryChargers.data?.total_count ?? 0}
				{pageSize}
				onPageChange={(newPage) => {
					currentPage = newPage;
				}}
			/>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center py-32">
			<div
				class="from-primary/20 to-secondary/20 mb-6 rounded-full bg-gradient-to-br p-8 shadow-lg"
			>
				<Zap class="size-24 opacity-60" />
			</div>
			<h3 class="mb-2 text-2xl font-bold">No Chargers Yet</h3>
			<p class="text-base-content/60 mb-6 max-w-md text-center">
				Get started by adding your first charging station
			</p>
			<div class="flex gap-4">
				<button class="btn btn-primary gap-2" onclick={openCreateDrawer}>
					<Plug class="size-4" />
					Add Your First Charger
				</button>
				<button class="btn btn-ghost gap-2" onclick={() => (showTutorial = true)}>
					<Info class="size-4" />
					How to Connect
				</button>
			</div>
		</div>
	{/if}
</BasePage>
