<script lang="ts">
	import { Download } from 'lucide-svelte';
	import { storage, StorageKeys } from '$lib/storage';
	import { hClient } from '$lib/hClient';
	import { formatDuration, intervalToDuration } from 'date-fns';
	import Papa from 'papaparse';
	import toast from 'svelte-french-toast';

	type NumberFormat = 'dot' | 'comma';

	export interface ExportColumn {
		key: string;
		label: string;
	}

	export interface ExportFilters {
		chargerId?: number;
		connectorId?: number;
		rfidTagId?: number;
		startDate?: string;
		endDate?: string;
		status?: 'active' | 'completed';
	}

	interface Props {
		columns: readonly ExportColumn[];
		filters: ExportFilters;
	}

	const { columns, filters }: Props = $props();

	const allColumnKeys = $derived(columns.map((c) => c.key));

	let dialog: HTMLDialogElement;
	let isExporting = $state(false);
	let selectedNumberFormat = $state<NumberFormat>(
		storage.retrieve(StorageKeys.CSV_NUMBER_FORMAT, 'dot')
	);
	let selectedColumns = $state<string[]>(
		storage.retrieve(StorageKeys.CSV_COLUMNS, null) ?? [...columns.map((c) => c.key)]
	);

	export function open() {
		dialog?.showModal();
	}

	export function close() {
		dialog?.close();
	}

	function toggleColumn(key: string) {
		if (selectedColumns.includes(key)) {
			selectedColumns = selectedColumns.filter((c) => c !== key);
		} else {
			selectedColumns = [...selectedColumns, key];
		}
	}

	function selectAllColumns() {
		selectedColumns = [...allColumnKeys];
	}

	function deselectAllColumns() {
		selectedColumns = [];
	}

	function getFormattedDuration(start: string, end: string | null) {
		if (!end) return 'Ongoing';
		const duration = intervalToDuration({ start: new Date(start), end: new Date(end) });
		return formatDuration(duration);
	}

	function formatNumber(value: number, format: NumberFormat): string {
		const str = value.toFixed(2);
		return format === 'comma' ? str.replace('.', ',') : str;
	}

	async function handleExport() {
		if (selectedColumns.length === 0) {
			toast.error('Please select at least one column');
			return;
		}

		storage.save(StorageKeys.CSV_NUMBER_FORMAT, selectedNumberFormat);
		storage.save(StorageKeys.CSV_COLUMNS, selectedColumns);
		close();

		const loadingToast = toast.loading('Exporting transactions...');
		try {
			isExporting = true;

			const params = new URLSearchParams();
			params.set('limit', '1000000');
			params.set('offset', '0');
			if (filters.chargerId) params.set('chargerId', String(filters.chargerId));
			if (filters.connectorId) params.set('connectorId', String(filters.connectorId));
			if (filters.rfidTagId) params.set('rfidTagId', String(filters.rfidTagId));
			if (filters.startDate) params.set('startDate', filters.startDate);
			if (filters.endDate) params.set('endDate', filters.endDate);
			if (filters.status) params.set('status', filters.status);

			const response = await hClient.transaction.detail.$get({ query: Object.fromEntries(params) });
			const json = await response.json();
			const transactions = json.data.transactions;

			if (!transactions || transactions.length === 0) {
				toast.error('No transactions to export', { id: loadingToast });
				return;
			}

			const columnGetters: Record<string, (t: any) => any> = {
				transactionId: (t) => t.id,
				createdAt: (t) => (t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A'),
				startTime: (t) => (t.startTime ? new Date(t.startTime).toLocaleString() : 'N/A'),
				endTime: (t) => (t.stopTime ? new Date(t.stopTime).toLocaleString() : 'Ongoing'),
				duration: (t) => (t.stopTime ? getFormattedDuration(t.startTime, t.stopTime) : 'Ongoing'),
				currentStatus: (t) => (t.stopTime ? 'Completed' : 'Active'),
				transactionStatus: (t) => t.status || 'N/A',
				chargerName: (t) => t.chargeAuthorization?.charger?.friendlyName || 'Unknown',
				chargerShortcode: (t) => t.chargeAuthorization?.charger?.shortcode || 'N/A',
				chargerVendor: (t) => t.chargeAuthorization?.charger?.vendor || 'N/A',
				chargerModel: (t) => t.chargeAuthorization?.charger?.model || 'N/A',
				connectorId: (t) => t.connector?.connectorId || 'N/A',
				rfidTagName: (t) => t.chargeAuthorization?.tag?.friendlyName || 'Unknown',
				rfidTagNumber: (t) => t.chargeAuthorization?.tag?.rfidTag || 'N/A',
				meterStartWh: (t) => t.meterStart || 0,
				meterStopWh: (t) => t.meterStop || 'N/A',
				energyDeliveredWh: (t) => t.energyDelivered || 0,
				energyDeliveredKwh: (t) =>
					t.energyDelivered
						? formatNumber(t.energyDelivered / 1000, selectedNumberFormat)
						: formatNumber(0, selectedNumberFormat),
				estimatedEnergyWh: (t) => t.estimatedEnergyDelivered?.totalEnergyDelivered || 'N/A',
				estimatedEnergyKwh: (t) =>
					t.estimatedEnergyDelivered?.totalEnergyDelivered
						? formatNumber(
								t.estimatedEnergyDelivered.totalEnergyDelivered / 1000,
								selectedNumberFormat
							)
						: 'N/A',
				stopReason: (t) => t.reason || 'N/A',
				paymentStatus: (t) => t.paymentStatus || 'N/A'
			};

			const csvData = transactions.map((t: any) => {
				const row: Record<string, any> = {};
				for (const col of columns) {
					if (selectedColumns.includes(col.key)) {
						row[col.label] = columnGetters[col.key](t);
					}
				}
				return row;
			});

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

			toast.success(`Exported ${transactions.length} transactions`, { id: loadingToast });
		} catch (error) {
			console.error('Export error:', error);
			toast.error('Failed to export transactions', { id: loadingToast });
		} finally {
			isExporting = false;
		}
	}
</script>

<dialog bind:this={dialog} class="modal">
	<div class="modal-box max-w-2xl">
		<h3 class="mb-4 text-lg font-bold">Export Options</h3>

		<!-- Number Format Section -->
		<div class="mb-6">
			<h4 class="mb-2 text-sm font-medium opacity-70">Number Format</h4>
			<div class="flex gap-4">
				<label class="flex cursor-pointer items-center gap-2">
					<input
						type="radio"
						name="number-format"
						class="radio radio-primary radio-sm"
						value="dot"
						bind:group={selectedNumberFormat}
					/>
					<span class="text-sm">
						<span class="font-medium">1.23</span>
						<span class="ml-1 opacity-60">(US/UK)</span>
					</span>
				</label>
				<label class="flex cursor-pointer items-center gap-2">
					<input
						type="radio"
						name="number-format"
						class="radio radio-primary radio-sm"
						value="comma"
						bind:group={selectedNumberFormat}
					/>
					<span class="text-sm">
						<span class="font-medium">1,23</span>
						<span class="ml-1 opacity-60">(EU)</span>
					</span>
				</label>
			</div>
		</div>

		<!-- Columns Section -->
		<div>
			<div class="mb-2 flex items-center justify-between">
				<h4 class="text-sm font-medium opacity-70">
					Columns ({selectedColumns.length}/{columns.length})
				</h4>
				<div class="flex gap-2">
					<button class="btn btn-ghost btn-xs" onclick={selectAllColumns}>Select All</button>
					<button class="btn btn-ghost btn-xs" onclick={deselectAllColumns}>Clear</button>
				</div>
			</div>
			<div class="bg-base-200 max-h-64 overflow-y-auto rounded-lg p-3">
				<div class="grid grid-cols-2 gap-1">
					{#each columns as col (col.key)}
						<label
							class="hover:bg-base-300 flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors"
						>
							<input
								type="checkbox"
								class="checkbox checkbox-primary checkbox-sm"
								checked={selectedColumns.includes(col.key)}
								onchange={() => toggleColumn(col.key)}
							/>
							<span class="truncate text-sm">{col.label}</span>
						</label>
					{/each}
				</div>
			</div>
		</div>

		<div class="modal-action">
			<button class="btn btn-ghost" onclick={close}>Cancel</button>
			<button
				class="btn btn-primary gap-2"
				onclick={handleExport}
				disabled={selectedColumns.length === 0 || isExporting}
			>
				{#if isExporting}
					<span class="loading loading-spinner loading-xs"></span>
					Exporting...
				{:else}
					<Download class="size-4" />
					Export CSV
				{/if}
			</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
