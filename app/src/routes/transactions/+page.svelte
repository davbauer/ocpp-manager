<script lang="ts">
	import {
		createQueryTransactionsDetail,
		createMutationTransactionDelete,
		createQueryCharger,
		createQueryRfidTagDetail
	} from '$lib/queryClient';

	import BasePage from '$lib/components/BasePage.svelte';
	import { formatDuration, intervalToDuration, subDays } from 'date-fns';
	import Pikaday from 'pikaday';
	import Papa from 'papaparse';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { hClient } from '$lib/hClient';
	import toast from 'svelte-french-toast';
	import { Collapsible } from '@ark-ui/svelte/collapsible';
	import {
		Download,
		Filter,
		ChevronDown,
		Trash2,
		Zap,
		Calendar,
		Clock,
		Battery,
		CreditCard,
		AlertCircle,
		Plug,
		Tag
	} from 'lucide-svelte';

	function getFormattedDuration(start: string, end: string | null) {
		if (!end) return 'Ongoing';
		const duration = intervalToDuration({ start: new Date(start), end: new Date(end) });
		return formatDuration(duration);
	}

	let currentPage = $state(1);
	const pageSize = 20;

	// Accumulate all loaded transactions
	let allLoadedTransactions = $state<any[]>([]);
	let totalCount = $state(0);
	let lastProcessedPage = $state(0);

	// Watch for new transaction data and accumulate
	$effect(() => {
		const data = $queryTransactions.data?.data;
		const page = currentPage;

		if (data && page !== lastProcessedPage) {
			// If page is 1, reset the list
			if (page === 1) {
				allLoadedTransactions = data;
			} else {
				// Append new transactions, avoiding duplicates
				const existingIds = new Set(allLoadedTransactions.map((t) => t.id));
				const uniqueNew = data.filter((t: any) => !existingIds.has(t.id));
				if (uniqueNew.length > 0) {
					allLoadedTransactions = [...allLoadedTransactions, ...uniqueNew];
				}
			}

			totalCount = $queryTransactions.data?.total_count ?? 0;
			lastProcessedPage = page;
		}
	});

	// Function to load more transactions
	function loadMore() {
		currentPage += 1;
	}

	const hasMore = $derived(() => {
		return allLoadedTransactions.length < totalCount;
	});

	// Draft filter states
	let draftChargerId = $state<number | undefined>(
		$page.url.searchParams.get('chargerId')
			? Number($page.url.searchParams.get('chargerId'))
			: undefined
	);
	let draftConnectorId = $state<number | undefined>(
		$page.url.searchParams.get('connectorId')
			? Number($page.url.searchParams.get('connectorId'))
			: undefined
	);
	let draftRfidTagId = $state<number | undefined>(
		$page.url.searchParams.get('rfidTagId')
			? Number($page.url.searchParams.get('rfidTagId'))
			: undefined
	);
	let draftStartDate = $state<string>($page.url.searchParams.get('startDate') || '');
	let draftEndDate = $state<string>($page.url.searchParams.get('endDate') || '');

	// Applied filter states
	let selectedChargerId = $state<number | undefined>(
		$page.url.searchParams.get('chargerId')
			? Number($page.url.searchParams.get('chargerId'))
			: undefined
	);
	let selectedConnectorId = $state<number | undefined>(
		$page.url.searchParams.get('connectorId')
			? Number($page.url.searchParams.get('connectorId'))
			: undefined
	);
	let selectedRfidTagId = $state<number | undefined>(
		$page.url.searchParams.get('rfidTagId')
			? Number($page.url.searchParams.get('rfidTagId'))
			: undefined
	);
	let startDate = $state<string>($page.url.searchParams.get('startDate') || '');
	let endDate = $state<string>($page.url.searchParams.get('endDate') || '');

	let startDateInput: HTMLInputElement;
	let endDateInput: HTMLInputElement;
	let isExporting = $state(false);

	let deleteModal: HTMLDialogElement;
	let transactionToDelete = $state<{ id: number; chargerName: string; tagName: string } | null>(
		null
	);

	const queryChargers = createQueryCharger(1, 1000);
	const queryRfidTags = createQueryRfidTagDetail(1, 1000);

	// Fetch connectors for the selected charger
	let availableConnectors = $state<any[]>([]);

	$effect(() => {
		if (draftChargerId) {
			// Fetch connectors for the selected charger
			hClient.connector.charger[':id'].detail
				.$get({
					param: { id: draftChargerId.toString() }
				})
				.then(async (response) => {
					const data = await response.json();
					availableConnectors = data.data || [];
				})
				.catch((error) => {
					console.error('Failed to fetch connectors:', error);
					availableConnectors = [];
				});
		} else {
			availableConnectors = [];
		}
	});

	const filters = $derived({
		chargerId: selectedChargerId,
		connectorId: selectedConnectorId,
		rfidTagId: selectedRfidTagId,
		startDate: startDate ? new Date(startDate) : undefined,
		endDate: endDate ? new Date(endDate) : undefined
	});

	const queryTransactions = $derived(
		createQueryTransactionsDetail(currentPage, pageSize, filters, 10000)
	);
	const mutationTransactionDelete = createMutationTransactionDelete();

	const confirmDelete = (transaction: any) => {
		transactionToDelete = {
			id: transaction.id,
			chargerName: transaction.chargeAuthorization?.charger?.friendlyName ?? 'Unknown',
			tagName: transaction.chargeAuthorization?.tag?.friendlyName ?? 'Unknown'
		};
		deleteModal?.showModal();
	};

	const handleDelete = () => {
		if (transactionToDelete) {
			$mutationTransactionDelete.mutate(
				{ id: transactionToDelete.id },
				{
					onSuccess: () => {
						// Reset state for fresh load
						currentPage = 1;
						allLoadedTransactions = [];
						lastProcessedPage = 0;
						deleteModal?.close();
						transactionToDelete = null;
					},
					onError: () => {
						toast.error('Failed to delete transaction');
					}
				}
			);
		}
	};

	const cancelDelete = () => {
		deleteModal?.close();
		transactionToDelete = null;
	};

	function updateURL() {
		const params = new URLSearchParams();
		if (selectedChargerId) params.set('chargerId', String(selectedChargerId));
		if (selectedConnectorId) params.set('connectorId', String(selectedConnectorId));
		if (selectedRfidTagId) params.set('rfidTagId', String(selectedRfidTagId));
		if (startDate) params.set('startDate', startDate);
		if (endDate) params.set('endDate', endDate);

		const url = params.toString() ? `?${params.toString()}` : '/transactions';
		goto(url, { replaceState: true, noScroll: true });
	}

	function applyFilters() {
		selectedChargerId = draftChargerId;
		selectedConnectorId = draftConnectorId;
		selectedRfidTagId = draftRfidTagId;
		startDate = draftStartDate;
		endDate = draftEndDate;
		currentPage = 1;
		allLoadedTransactions = []; // Reset accumulated transactions
		lastProcessedPage = 0; // Reset last processed page
		updateURL();
	}

	function clearFilters() {
		draftChargerId = undefined;
		draftConnectorId = undefined;
		draftRfidTagId = undefined;
		draftStartDate = '';
		draftEndDate = '';
		selectedChargerId = undefined;
		selectedConnectorId = undefined;
		selectedRfidTagId = undefined;
		startDate = '';
		endDate = '';
		currentPage = 1;
		allLoadedTransactions = []; // Reset accumulated transactions
		lastProcessedPage = 0; // Reset last processed page
		goto('/transactions', { replaceState: true, noScroll: true });
	}

	function setDatePreset(preset: 'today' | 'last24h' | 'last7d' | 'last30d') {
		const now = new Date();
		const tomorrow = subDays(now, -1);
		const formatDate = (date: Date) => date.toISOString().split('T')[0];

		switch (preset) {
			case 'today':
			case 'last24h':
				// Both mean today since filtering is day-based
				draftStartDate = formatDate(now);
				draftEndDate = formatDate(tomorrow);
				break;
			case 'last7d':
				draftStartDate = formatDate(subDays(now, 6)); // 7 days including today
				draftEndDate = formatDate(tomorrow);
				break;
			case 'last30d':
				draftStartDate = formatDate(subDays(now, 29)); // 30 days including today
				draftEndDate = formatDate(tomorrow);
				break;
		}

		// Automatically apply filters after setting preset
		selectedChargerId = draftChargerId;
		selectedConnectorId = draftConnectorId;
		selectedRfidTagId = draftRfidTagId;
		startDate = draftStartDate;
		endDate = draftEndDate;
		currentPage = 1;
		allLoadedTransactions = [];
		lastProcessedPage = 0;
		updateURL();
	}

	async function exportToCSV() {
		const loadingToast = toast.loading('Exporting transactions...');
		try {
			isExporting = true;

			const params = new URLSearchParams();
			params.set('limit', '1000000');
			params.set('offset', '0');
			if (selectedChargerId) params.set('chargerId', String(selectedChargerId));
			if (selectedConnectorId) params.set('connectorId', String(selectedConnectorId));
			if (selectedRfidTagId) params.set('rfidTagId', String(selectedRfidTagId));
			if (startDate) params.set('startDate', startDate);
			if (endDate) params.set('endDate', endDate);

			const response = await hClient.transaction.detail.$get({ query: Object.fromEntries(params) });
			const data = await response.json();

			if (!data.data || data.data.length === 0) {
				toast.error('No transactions to export', { id: loadingToast });
				return;
			}

			const csvData = data.data.map((t: any) => ({
				'Transaction ID': t.id,
				'Created At': t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A',
				'Start Time': t.startTime ? new Date(t.startTime).toLocaleString() : 'N/A',
				'End Time': t.stopTime ? new Date(t.stopTime).toLocaleString() : 'Ongoing',
				Duration: t.stopTime ? getFormattedDuration(t.startTime, t.stopTime) : 'Ongoing',
				'Current Status': t.stopTime ? 'Completed' : 'Active',
				'Transaction Status': t.status || 'N/A',
				'Charger Name': t.chargeAuthorization?.charger?.friendlyName || 'Unknown',
				'Charger Shortcode': t.chargeAuthorization?.charger?.shortcode || 'N/A',
				'Charger Vendor': t.chargeAuthorization?.charger?.vendor || 'N/A',
				'Charger Model': t.chargeAuthorization?.charger?.model || 'N/A',
				'Connector ID': t.connector?.connectorId || 'N/A',
				'RFID Tag Name': t.chargeAuthorization?.tag?.friendlyName || 'Unknown',
				'RFID Tag Number': t.chargeAuthorization?.tag?.rfidTag || 'N/A',
				'Meter Start (Wh)': t.meterStart || 0,
				'Meter Stop (Wh)': t.meterStop || 'N/A',
				'Energy Delivered (Wh)': t.energyDelivered || 0,
				'Energy Delivered (kWh)': t.energyDelivered
					? (t.energyDelivered / 1000).toFixed(2)
					: '0.00',
				'Estimated Energy (Wh)': t.estimatedEnergyDelivered?.totalEnergyDelivered || 'N/A',
				'Estimated Energy (kWh)': t.estimatedEnergyDelivered?.totalEnergyDelivered
					? (t.estimatedEnergyDelivered.totalEnergyDelivered / 1000).toFixed(2)
					: 'N/A',
				'Stop Reason': t.reason || 'N/A',
				'Payment Status': t.paymentStatus || 'N/A'
			}));

			const csv = Papa.unparse(csvData);
			const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
			const link = document.createElement('a');
			const url = URL.createObjectURL(blob);
			const timestamp = new Date().toISOString().split('T')[0];
			link.setAttribute('href', url);
			link.setAttribute('download', `transactions-export-${timestamp}.csv`);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success(`Exported ${data.data.length} transactions`, { id: loadingToast });
		} catch (error) {
			console.error('Export error:', error);
			toast.error('Failed to export transactions', { id: loadingToast });
		} finally {
			isExporting = false;
		}
	}

	$effect(() => {
		if (draftChargerId === undefined) {
			draftConnectorId = undefined;
		}
	});

	$effect(() => {
		if (startDateInput) {
			const startPicker = new Pikaday({
				field: startDateInput,
				format: 'YYYY-MM-DD',
				onSelect: (date: Date) => {
					draftStartDate = date.toISOString().split('T')[0];
				}
			});
			return () => startPicker.destroy();
		}
		return undefined;
	});

	$effect(() => {
		if (endDateInput) {
			const endPicker = new Pikaday({
				field: endDateInput,
				format: 'YYYY-MM-DD',
				onSelect: (date: Date) => {
					draftEndDate = date.toISOString().split('T')[0];
				}
			});
			return () => endPicker.destroy();
		}
		return undefined;
	});
</script>

<BasePage title="Transactions">
	{#snippet actions()}
		<button class="btn btn-sm gap-2" onclick={exportToCSV} disabled={isExporting}>
			{#if isExporting}
				<span class="loading loading-spinner loading-xs"></span>
				Exporting...
			{:else}
				<Download class="size-4" />
				Export CSV
			{/if}
		</button>
	{/snippet}

	<!-- Filters -->
	<Collapsible.Root class="bg-base-200 border-base-300 mb-6 overflow-hidden rounded-xl border">
		<Collapsible.Trigger
			class="hover:bg-base-300 flex w-full items-center justify-between px-6 py-4 text-left transition-colors"
		>
			<div class="flex items-center gap-2 font-semibold">
				<Filter class="size-5" />
				Filters
			</div>
			<Collapsible.Context>
				{#snippet children({ open })}
					<ChevronDown class="size-5 transition-transform {open ? 'rotate-180' : ''}" />
				{/snippet}
			</Collapsible.Context>
		</Collapsible.Trigger>

		<Collapsible.Content>
			<div class="border-base-300 border-t px-6 py-4">
				<div class="flex flex-wrap items-end gap-3">
					<div class="form-control w-48">
						<label class="label py-1" for="charger-filter">
							<span class="label-text text-xs font-medium">Charger</span>
						</label>
						<select
							id="charger-filter"
							class="select select-bordered select-sm w-full"
							bind:value={draftChargerId}
							disabled={$queryChargers.isPending}
						>
							<option value={undefined}>All Chargers</option>
							{#if $queryChargers.data?.data}
								{#each $queryChargers.data.data as charger (charger.id)}
									<option value={charger.id}>{charger.friendlyName}</option>
								{/each}
							{/if}
						</select>
					</div>

					{#if draftChargerId}
						<div class="form-control w-36">
							<label class="label py-1" for="connector-filter">
								<span class="label-text text-xs font-medium">Connector</span>
							</label>
							<select
								id="connector-filter"
								class="select select-bordered select-sm w-full"
								bind:value={draftConnectorId}
								disabled={availableConnectors.length === 0}
							>
								<option value={undefined}>All Connectors</option>
								{#each availableConnectors as connector (connector.connectorId)}
									<option value={connector.connectorId}>
										Connector {connector.connectorId}
									</option>
								{/each}
							</select>
						</div>
					{/if}

					<div class="form-control w-48">
						<label class="label py-1" for="rfid-filter">
							<span class="label-text text-xs font-medium">RFID Tag</span>
						</label>
						<select
							id="rfid-filter"
							class="select select-bordered select-sm w-full"
							bind:value={draftRfidTagId}
							disabled={$queryRfidTags.isPending}
						>
							<option value={undefined}>All Tags</option>
							{#if $queryRfidTags.data?.data}
								{#each $queryRfidTags.data.data as tag (tag.id)}
									<option value={tag.id}>{tag.friendlyName}</option>
								{/each}
							{/if}
						</select>
					</div>
					<div class="form-control w-40">
						<label class="label py-1" for="start-date">
							<span class="label-text text-xs font-medium">Start Date</span>
						</label>
						<input
							id="start-date"
							type="text"
							class="input input-bordered input-sm pika-single w-full"
							bind:this={startDateInput}
							bind:value={draftStartDate}
							placeholder="YYYY-MM-DD"
						/>
					</div>

					<div class="form-control w-40">
						<label class="label py-1" for="end-date">
							<span class="label-text text-xs font-medium">End Date</span>
						</label>
						<input
							id="end-date"
							type="text"
							class="input input-bordered input-sm pika-single w-full"
							bind:this={endDateInput}
							bind:value={draftEndDate}
							placeholder="YYYY-MM-DD"
						/>
					</div>

					<div class="form-control">
						<div class="label py-1">
							<span class="label-text text-xs font-medium">Quick Date</span>
						</div>
						<div class="btn-group">
							<button type="button" class="btn btn-sm" onclick={() => setDatePreset('today')}>
								1d
							</button>
							<button type="button" class="btn btn-sm" onclick={() => setDatePreset('last7d')}>
								7d
							</button>
							<button type="button" class="btn btn-sm" onclick={() => setDatePreset('last30d')}>
								30d
							</button>
						</div>
					</div>

					<div class="flex gap-2">
						<button class="btn btn-ghost btn-sm" onclick={clearFilters}>Clear</button>
						<button class="btn btn-primary btn-sm" onclick={applyFilters}>Apply</button>
					</div>
				</div>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>

	{#if $queryTransactions.isPending && currentPage === 1}
		<div class="flex flex-col items-center justify-center py-32">
			<span class="loading loading-spinner loading-lg text-primary mb-4"></span>
			<p class="text-sm opacity-60">Loading transactions...</p>
		</div>
	{:else if allLoadedTransactions.length > 0}
		<div class="space-y-4">
			{#each allLoadedTransactions as transaction (transaction.id)}
				{@const isActive = !transaction.stopTime}
				{@const energy = transaction.energyDelivered
					? (transaction.energyDelivered / 1000).toFixed(2)
					: transaction.estimatedEnergyDelivered?.totalEnergyDelivered
						? (transaction.estimatedEnergyDelivered.totalEnergyDelivered / 1000).toFixed(2)
						: null}

				<div
					class="card bg-base-100 border-base-300 overflow-hidden border shadow-md transition-shadow hover:shadow-lg {isActive
						? 'ring-primary/30 ring-2'
						: ''}"
				>
					<!-- Header -->
					<div
						class="from-base-200 to-base-300 border-base-300 flex items-center justify-between border-b bg-gradient-to-r px-6 py-4"
					>
						<div class="flex items-center gap-3">
							<div
								class="bg-base-100 rounded-xl p-3 shadow-sm {isActive
									? 'ring-primary/50 ring-2'
									: ''}"
							>
								<Zap class="size-6 {isActive ? 'text-primary animate-pulse' : 'opacity-60'}" />
							</div>
							<div>
								<h3 class="text-lg font-bold">Transaction #{transaction.id}</h3>
								<div class="mt-1 flex items-center gap-2">
									<span class="badge badge-{isActive ? 'primary' : 'success'} badge-sm">
										{isActive ? 'Active' : 'Completed'}
									</span>
									{#if transaction.paymentStatus}
										<span class="badge badge-ghost badge-sm">{transaction.paymentStatus}</span>
									{/if}
								</div>
							</div>
						</div>

						<button
							class="btn btn-circle btn-sm btn-ghost text-error"
							onclick={() => confirmDelete(transaction)}
							title="Delete Transaction"
						>
							<Trash2 class="size-4" />
						</button>
					</div>

					<!-- Content -->
					<div class="px-6 py-4">
						<div class="grid gap-4 md:grid-cols-2">
							<!-- Left Column -->
							<div class="space-y-3">
								<div class="flex items-center gap-3">
									<Zap class="size-4 opacity-60" />
									<div class="flex-1">
										<div class="text-xs opacity-60">Charger</div>
										<div class="font-semibold">
											{transaction.chargeAuthorization?.charger?.friendlyName ?? 'Unknown'}
										</div>
									</div>
								</div>

								<div class="flex items-center gap-3">
									<Plug class="size-4 opacity-60" />
									<div class="flex-1">
										<div class="text-xs opacity-60">Connector</div>
										<div class="font-semibold">#{transaction.connector?.connectorId ?? 'N/A'}</div>
									</div>
								</div>

								<div class="flex items-center gap-3">
									<Tag class="size-4 opacity-60" />
									<div class="flex-1">
										<div class="text-xs opacity-60">RFID Tag</div>
										<div class="font-semibold">
											{transaction.chargeAuthorization?.tag?.friendlyName ?? 'Unknown'}
										</div>
									</div>
								</div>
							</div>

							<!-- Right Column -->
							<div class="space-y-3">
								<div class="flex items-center gap-3">
									<Calendar class="size-4 opacity-60" />
									<div class="flex-1">
										<div class="text-xs opacity-60">Started</div>
										<div class="font-semibold">
											{new Date(transaction.startTime).toLocaleString()}
										</div>
									</div>
								</div>

								<div class="flex items-center gap-3">
									<Clock class="size-4 opacity-60" />
									<div class="flex-1">
										<div class="text-xs opacity-60">Duration</div>
										<div class="font-semibold">
											{getFormattedDuration(transaction.startTime, transaction.stopTime)}
										</div>
									</div>
								</div>

								<div class="flex items-center gap-3">
									<Battery class="size-4 opacity-60" />
									<div class="flex-1">
										<div class="text-xs opacity-60">Energy Delivered</div>
										<div class="font-semibold">
											{#if energy}
												<span class="text-primary">{energy} kWh</span>
												{#if transaction.estimatedEnergyDelivered && !transaction.energyDelivered}
													<span class="text-xs opacity-60">(estimated)</span>
												{/if}
											{:else}
												<span class="opacity-60">N/A</span>
											{/if}
										</div>
									</div>
								</div>
							</div>
						</div>

						{#if transaction.reason}
							<div class="bg-base-200 mt-4 rounded-lg p-3">
								<div class="flex items-center gap-2 text-sm">
									<AlertCircle class="size-4 opacity-60" />
									<span class="opacity-60">Stop Reason:</span>
									<span class="font-semibold">{transaction.reason}</span>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- Load More Button -->
		{#if hasMore()}
			<div class="mt-8 flex justify-center">
				<button
					class="btn btn-primary gap-2"
					onclick={loadMore}
					disabled={$queryTransactions.isPending}
				>
					{#if $queryTransactions.isPending && currentPage > 1}
						<span class="loading loading-spinner loading-sm"></span>
						Loading...
					{:else}
						Load More
					{/if}
				</button>
			</div>
		{:else}
			<div class="mt-8 text-center text-sm opacity-60">
				All transactions loaded ({totalCount} total)
			</div>
		{/if}
	{:else}
		<div class="flex flex-col items-center justify-center py-32">
			<div
				class="from-primary/20 to-secondary/20 mb-6 rounded-full bg-gradient-to-br p-8 shadow-lg"
			>
				<Zap class="size-24 opacity-60" />
			</div>
			<h3 class="mb-2 text-2xl font-bold">No Transactions Found</h3>
			<p class="text-base-content/60 text-center">
				{#if selectedChargerId || selectedRfidTagId || startDate || endDate}
					Try adjusting your filters
				{:else}
					No charging sessions have been recorded yet
				{/if}
			</p>
		</div>
	{/if}

	<!-- Delete Confirmation Modal -->
	<dialog bind:this={deleteModal} class="modal">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Delete Transaction</h3>
			{#if transactionToDelete}
				<p class="py-4">
					Are you sure you want to delete transaction <strong>#{transactionToDelete.id}</strong>?
				</p>
				<div class="bg-base-200 rounded-lg p-3">
					<div class="space-y-1 text-sm">
						<div class="flex items-center gap-2">
							<Zap class="size-4 opacity-60" />
							<span class="opacity-60">Charger:</span>
							<span class="font-semibold">{transactionToDelete.chargerName}</span>
						</div>
						<div class="flex items-center gap-2">
							<CreditCard class="size-4 opacity-60" />
							<span class="opacity-60">RFID Tag:</span>
							<span class="font-semibold">{transactionToDelete.tagName}</span>
						</div>
					</div>
				</div>
			{/if}
			<div class="modal-action">
				<button class="btn btn-outline" onclick={cancelDelete}>Cancel</button>
				<button
					class="btn btn-error"
					onclick={handleDelete}
					disabled={$mutationTransactionDelete.isPending}
				>
					{#if $mutationTransactionDelete.isPending}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					Delete Transaction
				</button>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button onclick={cancelDelete}>close</button>
		</form>
	</dialog>
</BasePage>
