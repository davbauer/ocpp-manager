<script lang="ts">
	import {
		createQueryTransactionsDetail,
		createMutationTransactionDelete,
		createQueryCharger,
		createQueryRfidTagDetail
	} from '$lib/queryClient';

	import BasePage from '$lib/components/BasePage.svelte';
	import TransactionExportModal from '$lib/components/TransactionExportModal.svelte';
	import { formatDuration, intervalToDuration, subDays } from 'date-fns';
	import Pikaday from 'pikaday';
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

	// Check if URL has any filter params to auto-open filters
	const hasFiltersInUrl = $derived(
		$page.url.searchParams.has('chargerId') ||
			$page.url.searchParams.has('connectorId') ||
			$page.url.searchParams.has('rfidTagId') ||
			$page.url.searchParams.has('startDate') ||
			$page.url.searchParams.has('endDate') ||
			$page.url.searchParams.has('status')
	);

	type TransactionStatus = 'all' | 'active' | 'completed';

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
	let totalEnergyWh = $state(0);

	$effect(() => {
		const responseData = $queryTransactions.data?.data;
		const transactions = responseData?.transactions;
		const pg = currentPage;

		if (transactions && pg !== lastProcessedPage) {
			if (pg === 1) {
				allLoadedTransactions = transactions;
			} else {
				const existingIds = new Set(allLoadedTransactions.map((t) => t.id));
				const uniqueNew = transactions.filter((t: any) => !existingIds.has(t.id));
				if (uniqueNew.length > 0) {
					allLoadedTransactions = [...allLoadedTransactions, ...uniqueNew];
				}
			}
			totalCount = $queryTransactions.data?.total_count ?? 0;
			totalEnergyWh = responseData?.totalEnergyWh ?? 0;
			lastProcessedPage = pg;
		}
	});

	function loadMore() {
		currentPage += 1;
	}

	const hasMore = $derived(allLoadedTransactions.length < totalCount);

	// Helper to reset pagination state
	function resetPagination() {
		currentPage = 1;
		allLoadedTransactions = [];
		lastProcessedPage = 0;
		totalEnergyWh = 0;
	}

	// Draft filter states (what user is editing)
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
	let draftStartDate = $state($page.url.searchParams.get('startDate') || '');
	let draftEndDate = $state($page.url.searchParams.get('endDate') || '');
	let draftStatus = $state<TransactionStatus>(
		($page.url.searchParams.get('status') as TransactionStatus) || 'all'
	);

	// Applied filter states (what's actually being queried)
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
	let startDate = $state($page.url.searchParams.get('startDate') || '');
	let endDate = $state($page.url.searchParams.get('endDate') || '');
	let selectedStatus = $state<TransactionStatus>(
		($page.url.searchParams.get('status') as TransactionStatus) || 'all'
	);

	let startDateInput: HTMLInputElement;
	let endDateInput: HTMLInputElement;
	let startPicker: Pikaday | null = null;
	let endPicker: Pikaday | null = null;

	let deleteModal: HTMLDialogElement;
	let exportModal: TransactionExportModal;
	let transactionToDelete = $state<{ id: number; chargerName: string; tagName: string } | null>(
		null
	);

	const queryChargers = createQueryCharger(1, 1000);
	const queryRfidTags = createQueryRfidTagDetail(1, 1000);

	// Fetch connectors for the selected charger
	let availableConnectors = $state<any[]>([]);

	$effect(() => {
		if (draftChargerId) {
			const chargerId = draftChargerId;
			hClient.connector.charger[':id'].detail
				.$get({ param: { id: chargerId.toString() } })
				.then(async (response) => {
					// Only update if charger hasn't changed
					if (draftChargerId === chargerId) {
						const data = await response.json();
						availableConnectors = data.data || [];
					}
				})
				.catch((error) => {
					console.error('Failed to fetch connectors:', error);
					if (draftChargerId === chargerId) {
						availableConnectors = [];
					}
				});
		} else {
			availableConnectors = [];
			draftConnectorId = undefined;
		}
	});

	const filters = $derived({
		chargerId: selectedChargerId,
		connectorId: selectedConnectorId,
		rfidTagId: selectedRfidTagId,
		startDate: startDate ? new Date(startDate) : undefined,
		endDate: endDate ? new Date(endDate) : undefined,
		status: selectedStatus !== 'all' ? selectedStatus : undefined
	});

	const queryTransactions = $derived(
		createQueryTransactionsDetail(currentPage, pageSize, filters, 10000)
	);
	const mutationTransactionDelete = createMutationTransactionDelete();

	// Export filters for the modal
	const exportFilters = $derived({
		chargerId: selectedChargerId,
		connectorId: selectedConnectorId,
		rfidTagId: selectedRfidTagId,
		startDate: startDate || undefined,
		endDate: endDate || undefined,
		status: selectedStatus !== 'all' ? selectedStatus : undefined
	});

	function confirmDelete(transaction: any) {
		transactionToDelete = {
			id: transaction.id,
			chargerName: transaction.charger?.friendlyName ?? 'Unknown',
			tagName: transaction.chargeAuthorization?.tag?.friendlyName ?? 'Unknown'
		};
		deleteModal?.showModal();
	}

	function handleDelete() {
		if (transactionToDelete) {
			$mutationTransactionDelete.mutate(
				{ id: transactionToDelete.id },
				{
					onSuccess: () => {
						resetPagination();
						deleteModal?.close();
						transactionToDelete = null;
					},
					onError: () => {
						toast.error('Failed to delete transaction');
					}
				}
			);
		}
	}

	function cancelDelete() {
		deleteModal?.close();
		transactionToDelete = null;
	}

	function updateURL() {
		const params = new URLSearchParams();
		if (selectedChargerId) params.set('chargerId', String(selectedChargerId));
		if (selectedConnectorId) params.set('connectorId', String(selectedConnectorId));
		if (selectedRfidTagId) params.set('rfidTagId', String(selectedRfidTagId));
		if (startDate) params.set('startDate', startDate);
		if (endDate) params.set('endDate', endDate);
		if (selectedStatus !== 'all') params.set('status', selectedStatus);

		const url = params.toString() ? `?${params.toString()}` : '/transactions';
		goto(url, { replaceState: true, noScroll: true });
	}

	function applyFilters() {
		selectedChargerId = draftChargerId;
		selectedConnectorId = draftConnectorId;
		selectedRfidTagId = draftRfidTagId;
		startDate = draftStartDate;
		endDate = draftEndDate;
		selectedStatus = draftStatus;
		resetPagination();
		updateURL();
	}

	function clearFilters() {
		draftChargerId = undefined;
		draftConnectorId = undefined;
		draftRfidTagId = undefined;
		draftStartDate = '';
		draftEndDate = '';
		draftStatus = 'all';
		selectedChargerId = undefined;
		selectedConnectorId = undefined;
		selectedRfidTagId = undefined;
		startDate = '';
		endDate = '';
		selectedStatus = 'all';
		resetPagination();
		goto('/transactions', { replaceState: true, noScroll: true });
	}

	function setDatePreset(preset: 'today' | 'last7d' | 'last30d') {
		const now = new Date();
		const tomorrow = subDays(now, -1);
		const formatDate = (date: Date) => date.toISOString().split('T')[0];

		switch (preset) {
			case 'today':
				draftStartDate = formatDate(now);
				draftEndDate = formatDate(tomorrow);
				break;
			case 'last7d':
				draftStartDate = formatDate(subDays(now, 6));
				draftEndDate = formatDate(tomorrow);
				break;
			case 'last30d':
				draftStartDate = formatDate(subDays(now, 29));
				draftEndDate = formatDate(tomorrow);
				break;
		}
		applyFilters();
	}

	// Export columns configuration
	const exportColumns = [
		{ key: 'transactionId', label: 'Transaction ID' },
		{ key: 'createdAt', label: 'Created At' },
		{ key: 'startTime', label: 'Start Time' },
		{ key: 'endTime', label: 'End Time' },
		{ key: 'duration', label: 'Duration' },
		{ key: 'currentStatus', label: 'Current Status' },
		{ key: 'transactionStatus', label: 'Transaction Status' },
		{ key: 'chargerName', label: 'Charger Name' },
		{ key: 'chargerShortcode', label: 'Charger Shortcode' },
		{ key: 'chargerVendor', label: 'Charger Vendor' },
		{ key: 'chargerModel', label: 'Charger Model' },
		{ key: 'connectorId', label: 'Connector ID' },
		{ key: 'rfidTagName', label: 'RFID Tag Name' },
		{ key: 'rfidTagNumber', label: 'RFID Tag Number' },
		{ key: 'meterStartWh', label: 'Meter Start (Wh)' },
		{ key: 'meterStopWh', label: 'Meter Stop (Wh)' },
		{ key: 'energyDeliveredWh', label: 'Energy Delivered (Wh)' },
		{ key: 'energyDeliveredKwh', label: 'Energy Delivered (kWh)' },
		{ key: 'estimatedEnergyWh', label: 'Estimated Energy (Wh)' },
		{ key: 'estimatedEnergyKwh', label: 'Estimated Energy (kWh)' },
		{ key: 'stopReason', label: 'Stop Reason' },
		{ key: 'paymentStatus', label: 'Payment Status' }
	] as const;

	// Pikaday setup with sync
	$effect(() => {
		if (!startDateInput) return;

		startPicker = new Pikaday({
			field: startDateInput,
			format: 'YYYY-MM-DD',
			onSelect: (date: Date) => {
				// Use local date components to avoid timezone issues
				draftStartDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
			}
		});

		return () => {
			startPicker?.destroy();
			startPicker = null;
		};
	});

	$effect(() => {
		if (!endDateInput) return;

		endPicker = new Pikaday({
			field: endDateInput,
			format: 'YYYY-MM-DD',
			onSelect: (date: Date) => {
				// Use local date components to avoid timezone issues
				draftEndDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
			}
		});

		return () => {
			endPicker?.destroy();
			endPicker = null;
		};
	});

	// Sync Pikaday displays when draft dates change
	$effect(() => {
		if (startPicker) {
			if (draftStartDate) {
				const pickerDate = startPicker.getDate();
				const currentDateStr = pickerDate
					? `${pickerDate.getFullYear()}-${String(pickerDate.getMonth() + 1).padStart(2, '0')}-${String(pickerDate.getDate()).padStart(2, '0')}`
					: null;
				if (currentDateStr !== draftStartDate) {
					// Parse as local date by splitting the string
					const [year, month, day] = draftStartDate.split('-').map(Number);
					startPicker.setDate(new Date(year, month - 1, day), true);
				}
			} else {
				startPicker.setDate(null as unknown as Date, true);
			}
		}
	});

	$effect(() => {
		if (endPicker) {
			if (draftEndDate) {
				const pickerDate = endPicker.getDate();
				const currentDateStr = pickerDate
					? `${pickerDate.getFullYear()}-${String(pickerDate.getMonth() + 1).padStart(2, '0')}-${String(pickerDate.getDate()).padStart(2, '0')}`
					: null;
				if (currentDateStr !== draftEndDate) {
					// Parse as local date by splitting the string
					const [year, month, day] = draftEndDate.split('-').map(Number);
					endPicker.setDate(new Date(year, month - 1, day), true);
				}
			} else {
				endPicker.setDate(null as unknown as Date, true);
			}
		}
	});
</script>

<BasePage title="Transactions">
	{#snippet actions()}
		<button class="btn btn-sm gap-2" onclick={() => exportModal?.open()}>
			<Download class="size-4" />
			Export CSV
		</button>
	{/snippet}

	<!-- Filters -->
	<Collapsible.Root
		defaultOpen={hasFiltersInUrl}
		class="bg-base-200 border-base-300 mb-6 overflow-hidden rounded-xl border"
	>
		<Collapsible.Trigger
			class="hover:bg-base-300 flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left transition-colors"
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

					<div class="form-control w-36">
						<label class="label py-1" for="status-filter">
							<span class="label-text text-xs font-medium">Status</span>
						</label>
						<select
							id="status-filter"
							class="select select-bordered select-sm w-full"
							bind:value={draftStatus}
						>
							<option value="all">All</option>
							<option value="active">Active</option>
							<option value="completed">Completed</option>
						</select>
					</div>

					<div class="form-control w-40">
						<label class="label py-1" for="sd">
							<span class="label-text text-xs font-medium">From Date</span>
						</label>
						<input
							id="sd"
							name="sd"
							type="text"
							class="input input-bordered input-sm pika-single w-full"
							bind:this={startDateInput}
							bind:value={draftStartDate}
							placeholder="YYYY-MM-DD"
							autocomplete="one-time-code"
						/>
					</div>

					<div class="form-control w-40">
						<label class="label py-1" for="ed">
							<span class="label-text text-xs font-medium">To Date</span>
						</label>
						<input
							id="ed"
							name="ed"
							type="text"
							class="input input-bordered input-sm pika-single w-full"
							bind:this={endDateInput}
							bind:value={draftEndDate}
							placeholder="YYYY-MM-DD"
							autocomplete="one-time-code"
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
	{:else}
		<!-- Stats Summary -->
		<div class="stats bg-base-100 border-base-300 mb-6 w-full border shadow-md">
			<div class="stat">
				<div class="stat-figure text-primary">
					<Zap class="size-8" />
				</div>
				<div class="stat-title">Total Energy</div>
				<div class="stat-value text-primary">
					{(totalEnergyWh / 1000).toFixed(2)} kWh
				</div>
				<div class="stat-desc">
					{#if selectedChargerId || selectedConnectorId || selectedRfidTagId || startDate || endDate}
						Filtered results
					{:else}
						All transactions
					{/if}
				</div>
			</div>
			<div class="stat">
				<div class="stat-figure text-secondary">
					<Battery class="size-8" />
				</div>
				<div class="stat-title">Transactions</div>
				<div class="stat-value text-secondary">{totalCount}</div>
				<div class="stat-desc">
					{allLoadedTransactions.length} loaded
				</div>
			</div>
		</div>

		{#if allLoadedTransactions.length > 0}
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
												{transaction.charger?.friendlyName ?? 'Unknown'}
											</div>
										</div>
									</div>

									<div class="flex items-center gap-3">
										<Plug class="size-4 opacity-60" />
										<div class="flex-1">
											<div class="text-xs opacity-60">Connector</div>
											<div class="font-semibold">
												#{transaction.connector?.connectorId ?? 'N/A'}
											</div>
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
			{#if hasMore}
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
			<div class="flex flex-col items-center justify-center py-16">
				<div
					class="from-primary/20 to-secondary/20 mb-6 rounded-full bg-gradient-to-br p-8 shadow-lg"
				>
					<Zap class="size-16 opacity-60" />
				</div>
				<h3 class="mb-2 text-xl font-bold">No Transactions Found</h3>
				<p class="text-base-content/60 text-center">
					{#if selectedChargerId || selectedRfidTagId || startDate || endDate}
						Try adjusting your filters
					{:else}
						No charging sessions have been recorded yet
					{/if}
				</p>
			</div>
		{/if}
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

	<!-- Export Format Modal -->
	<TransactionExportModal bind:this={exportModal} columns={exportColumns} filters={exportFilters} />
</BasePage>
