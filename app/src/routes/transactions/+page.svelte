<script lang="ts">
	import { createQueryTransactionsDetail, createMutationTransactionDelete, createQueryCharger, createQueryRfidTagDetail } from '$lib/queryClient';

	import BasePage from '$lib/components/BasePage.svelte';
	import Scrollable from '$lib/components/Scrollable.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { formatDistanceToNow, formatDuration, intervalToDuration } from 'date-fns';
	import Pikaday from 'pikaday';
	import Papa from 'papaparse';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { hClient } from '$lib/hClient';
	import toast from 'svelte-french-toast';

	function getFormattedDuration(start: string, end: string | null) {
		if (!end) return 'N/A';
		const duration = intervalToDuration({ start: new Date(start), end: new Date(end) });
		return formatDuration(duration);
	}

	let currentPage = $state(1);
	const pageSize = 10;
	
	// Draft filter states (modified by user, not applied yet)
	let draftChargerId = $state<number | undefined>(
		$page.url.searchParams.get('chargerId') ? Number($page.url.searchParams.get('chargerId')) : undefined
	);
	let draftConnectorId = $state<number | undefined>(
		$page.url.searchParams.get('connectorId') ? Number($page.url.searchParams.get('connectorId')) : undefined
	);
	let draftRfidTagId = $state<number | undefined>(
		$page.url.searchParams.get('rfidTagId') ? Number($page.url.searchParams.get('rfidTagId')) : undefined
	);
	let draftStartDate = $state<string>(
		$page.url.searchParams.get('startDate') || ''
	);
	let draftEndDate = $state<string>(
		$page.url.searchParams.get('endDate') || ''
	);
	
	// Applied filter states (used in queries)
	let selectedChargerId = $state<number | undefined>(
		$page.url.searchParams.get('chargerId') ? Number($page.url.searchParams.get('chargerId')) : undefined
	);
	let selectedConnectorId = $state<number | undefined>(
		$page.url.searchParams.get('connectorId') ? Number($page.url.searchParams.get('connectorId')) : undefined
	);
	let selectedRfidTagId = $state<number | undefined>(
		$page.url.searchParams.get('rfidTagId') ? Number($page.url.searchParams.get('rfidTagId')) : undefined
	);
	let startDate = $state<string>(
		$page.url.searchParams.get('startDate') || ''
	);
	let endDate = $state<string>(
		$page.url.searchParams.get('endDate') || ''
	);
	
	// Pikaday input refs
	let startDateInput: HTMLInputElement;
	let endDateInput: HTMLInputElement;
	
	let isExporting = $state(false);
	
	// Fetch data for filter dropdowns
	const queryChargers = createQueryCharger(1, 1000);
	const queryRfidTags = createQueryRfidTagDetail(1, 1000);

	const filters = $derived({
		chargerId: selectedChargerId,
		connectorId: selectedConnectorId,
		rfidTagId: selectedRfidTagId,
		startDate: startDate ? new Date(startDate) : undefined,
		endDate: endDate ? new Date(endDate) : undefined
	});

	const queryTransactions = $derived(createQueryTransactionsDetail(currentPage, pageSize, filters, 10000));
	const mutationTransactionDelete = createMutationTransactionDelete();

	const deleteTransaction = (id: number) => {
		$mutationTransactionDelete.mutate({ id });
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
		goto('/transactions', { replaceState: true, noScroll: true });
	}
	
	async function exportToCSV() {
		try {
			isExporting = true;
			toast.loading('Exporting transactions...');
			
			// Build query params with filters and high limit
			const params = new URLSearchParams();
			params.set('limit', '1000000');
			params.set('offset', '0');
			if (selectedChargerId) params.set('chargerId', String(selectedChargerId));
			if (selectedConnectorId) params.set('connectorId', String(selectedConnectorId));
			if (selectedRfidTagId) params.set('rfidTagId', String(selectedRfidTagId));
			if (startDate) params.set('startDate', startDate);
			if (endDate) params.set('endDate', endDate);
			
			// Fetch all transactions
			const response = await hClient.transaction.detail.$get({ query: Object.fromEntries(params) });
			const data = await response.json();
			
			if (!data.data || data.data.length === 0) {
				toast.error('No transactions to export');
				return;
			}
			
			// Format data for CSV
			const csvData = data.data.map((t: any) => ({
				'Transaction ID': t.id,
				'Charger': t.chargeAuthorization?.charger?.friendlyName || 'Unknown',
				'Connector': t.connector?.connectorId || 'N/A',
				'RFID Tag': t.chargeAuthorization?.tag?.friendlyName || 'Unknown',
				'Start Time': t.startTime ? new Date(t.startTime).toLocaleString() : 'N/A',
				'End Time': t.stopTime ? new Date(t.stopTime).toLocaleString() : 'Ongoing',
				'Duration': t.stopTime ? getFormattedDuration(t.startTime, t.stopTime) : 'Ongoing',
				'Energy (kWh)': t.energyDelivered ? (t.energyDelivered / 1000).toFixed(3) : (t.estimatedEnergyDelivered?.totalEnergyDelivered ? (t.estimatedEnergyDelivered.totalEnergyDelivered / 1000).toFixed(3) : 'N/A'),
				'Stop Reason': t.reason || 'N/A',
				'Payment Status': t.paymentStatus || 'N/A',
				'Status': t.stopTime ? 'Completed' : 'Active'
			}));
			
			// Convert to CSV
			const csv = Papa.unparse(csvData);
			
			// Create and download file
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
			
			toast.success(`Exported ${data.data.length} transactions`);
		} catch (error) {
			console.error('Export error:', error);
			toast.error('Failed to export transactions');
		} finally {
			isExporting = false;
		}
	}
	
	// Reset connector when charger changes
	$effect(() => {
		if (draftChargerId === undefined) {
			draftConnectorId = undefined;
		}
	});
	
	// Initialize Pikaday for start date
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
	
	// Initialize Pikaday for end date
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
	<div class="container mx-auto px-4">
		<!-- Header with Export Button -->
		<div class="flex justify-end mb-4">
			<button 
				class="btn btn-sm btn-outline gap-2" 
				onclick={exportToCSV}
				disabled={isExporting}
			>
				{#if isExporting}
					<span class="loading loading-spinner loading-xs"></span>
					Exporting...
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
					</svg>
					Export CSV
				{/if}
			</button>
		</div>

		<!-- Filters -->
		<div class="collapse collapse-arrow bg-base-200 mb-4">
			<input type="checkbox" />
			<div class="collapse-title text-base font-medium">Filters</div>
			<div class="collapse-content">
				<div class="flex flex-wrap items-end gap-3 pt-2">
					<!-- Charger Filter -->
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
							<option value={undefined}>All</option>
							{#if $queryChargers.data?.data}
								{#each $queryChargers.data.data as charger}
									<option value={charger.id}>
										{charger.friendlyName}
									</option>
								{/each}
							{/if}
						</select>
					</div>

					<!-- Connector Filter (only shown when charger is selected) -->
					{#if draftChargerId && $queryChargers.data?.data}
						{@const charger = $queryChargers.data.data.find(c => c.id === draftChargerId)}
						{#if charger}
							<div class="form-control w-36">
								<label class="label py-1" for="connector-filter">
									<span class="label-text text-xs font-medium">Connector</span>
								</label>
								<select
									id="connector-filter"
									class="select select-bordered select-sm w-full"
									bind:value={draftConnectorId}
								>
									<option value={undefined}>All</option>
									<option value={1}>Connector 1</option>
									<option value={2}>Connector 2</option>
								</select>
							</div>
						{/if}
					{/if}

					<!-- RFID Tag Filter -->
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
							<option value={undefined}>All</option>
							{#if $queryRfidTags.data?.data}
								{#each $queryRfidTags.data.data as tag}
									<option value={tag.id}>
										{tag.friendlyName}
									</option>
								{/each}
							{/if}
						</select>
					</div>

					<!-- Start Date Filter -->
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

					<!-- End Date Filter -->
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

					<!-- Action Buttons -->
					<div class="flex gap-2">
						<button class="btn btn-ghost btn-sm" onclick={clearFilters}>
							Clear Filters
						</button>
						<button class="btn btn-primary btn-sm" onclick={applyFilters}>
							Apply Filters
						</button>
					</div>
				</div>
			</div>
		</div>

		{#if $queryTransactions.isPending}
			<div class="flex justify-center py-12">
				<span class="loading loading-spinner loading-lg"></span>
			</div>
		{:else if $queryTransactions.data?.data && $queryTransactions.data.data.length > 0}
			<Pagination
				{currentPage}
				totalCount={$queryTransactions.data?.total_count ?? 0}
				{pageSize}
				onPageChange={(newPage) => {
					currentPage = newPage;
				}}
				class="mb-4"
			/>

			<Scrollable class="p-4" maxHeight="80svh">
				<div class="space-y-6">
					{#each $queryTransactions.data.data as transaction}
						<div class="bg-base-200 rounded-lg p-6 shadow-md">
							<div class="mb-4 flex items-center justify-between">
								<div>
									<h3 class="text-xl font-semibold">
										Transaction #{transaction.id}
									</h3>
									<p class="text-sm text-gray-500">
										Status: <span class="font-bold">{transaction.status}</span>
									</p>
								</div>
								<button
									class="btn btn-ghost btn-sm"
									onclick={() => deleteTransaction(transaction.id)}
								>
									Delete
								</button>
							</div>

							<table class="bg-base-300 table w-full overflow-hidden rounded-lg">
								<tbody>
									<tr>
										<td class="w-60 font-medium">Charger</td>
										<td>{transaction.chargeAuthorization?.charger?.friendlyName ?? 'Unknown'}</td>
									</tr>

									<tr>
										<td class="w-60 font-medium">Connector</td>
										<td>{transaction.connector?.connectorId}</td>
									</tr>
									<tr>
										<td class="w-60 font-medium">Tag Used</td>
										<td>{transaction.chargeAuthorization?.tag?.friendlyName ?? 'Unknown'}</td>
									</tr>
									<tr>
										<td class="w-60 font-medium">Start Time</td>
										<td>
											{new Date(transaction.startTime).toLocaleString()}
										</td>
									</tr>
									<tr>
										<td class="w-60 font-medium">Duration</td>
										<td>
											{getFormattedDuration(transaction.startTime, transaction?.stopTime)}
										</td>
									</tr>
									<tr>
										<td class="w-60 font-medium">Energy Delivered</td>

										{#if transaction.energyDelivered}
											<td>{transaction.energyDelivered / 1000} kWh</td>
										{:else if transaction.estimatedEnergyDelivered?.totalEnergyDelivered}
											<td
												class="tooltip"
												data-tip="Last update {formatDistanceToNow(
													transaction.estimatedEnergyDelivered.lastUpdateTimestamp
												)}"
											>
												Estimated {transaction.estimatedEnergyDelivered.totalEnergyDelivered / 1000}
												kWh</td
											>
										{:else}
											<td>N/A</td>
										{/if}
									</tr>
									<tr>
										<td class="w-60 font-medium">Stop Reason</td>
										<td>{transaction.reason || 'N/A'}</td>
									</tr>
									<tr>
										<td class="w-60 font-medium">Payment Status</td>
										<td>{transaction.paymentStatus}</td>
									</tr>
								</tbody>
							</table>
						</div>
					{/each}
				</div>
			</Scrollable>
		{:else}
			<div class="bg-base-200 rounded-lg p-8 text-center">
				<p class="text-base-content">No Transactions Found</p>
			</div>
		{/if}
	</div>
</BasePage>
