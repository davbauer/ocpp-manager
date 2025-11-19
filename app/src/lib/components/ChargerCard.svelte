<script lang="ts">
	import { formatDistanceToNow } from 'date-fns';
	import {
		Plug,
		RefreshCw,
		PencilLine,
		Trash2,
		Zap,
		MoreVertical,
		Clock,
		Wifi,
		WifiOff,
		AlertCircle,
		Activity,
		Gauge,
		ThermometerIcon,
		Unlock,
		Globe,
		Hash,
		Cpu
	} from 'lucide-svelte';
	import {
		createMutationChargerDelete,
		createMutationChargerReset,
		createMutationChargerUpdate,
		createMutationConnectorUnlock
	} from '$lib/queryClient';
	import { drawerStore } from '$lib/drawerStore';
	import { z } from 'zod';
	import type { InferResponseType } from 'hono';
	import type { hClient } from '$lib/hClient';

	const {
		charger,
		connectors = []
	}: {
		charger: InferResponseType<(typeof hClient)['charger']['$get']>['data'][0];
		connectors?: any[];
	} = $props();
	const mutationChargerUpdate = createMutationChargerUpdate();
	const mutationChargerDelete = createMutationChargerDelete();
	const mutationChargerReset = createMutationChargerReset();
	const mutationConnectorUnlock = createMutationConnectorUnlock();

	let menuOpen = $state(false);

	const getStatusColor = (status: string) => {
		const colors: Record<string, string> = {
			Available: 'success',
			Preparing: 'info',
			Charging: 'primary',
			SuspendedEVSE: 'warning',
			SuspendedEV: 'warning',
			Finishing: 'info',
			Reserved: 'secondary',
			Unavailable: 'ghost',
			Faulted: 'error'
		};
		return colors[status] || 'ghost';
	};

	const getChargerStatusColor = (status: string) => {
		if (status === 'Accepted') return 'success';
		if (status === 'Pending') return 'warning';
		return 'error';
	};

	function getPhaseValue(data: any[], phase: string) {
		for (const entry of data) {
			const phaseData = entry.sampledValue.find(
				(item: any) => item.phase === phase && item.measurand === 'Current.Import'
			);
			if (phaseData) return parseFloat(phaseData.value) || 0;
		}
		return 0;
	}

	function getMeasurandValue(data: any[], measurand: string) {
		for (const entry of data) {
			const measurandData = entry.sampledValue.find(
				(item: any) => item.measurand === measurand && !item.phase
			);
			if (measurandData) return parseFloat(measurandData.value) || 0;
		}
		return 0;
	}

	const stats = $derived(() => {
		const s = {
			total: connectors.length,
			available: 0,
			charging: 0,
			totalPower: 0
		};
		connectors.forEach((c: any) => {
			if (c.status === 'Available') s.available++;
			if (c.status === 'Charging') s.charging++;
			if (c.telemetry?.meterValue?.raw) {
				const p = getMeasurandValue(c.telemetry.meterValue.raw, 'Power.Active.Import');
				s.totalPower += p;
			}
		});
		return s;
	});

	const isCharging = $derived(stats().charging > 0);

	const openEditDrawer = () => {
		drawerStore.open({
			header: 'Edit Charger',
			fields: [
				{
					label: 'Friendly Name',
					name: 'friendlyName',
					type: 'text',
					defaultValue: charger.friendlyName || '',
					validation: z.string().min(1)
				},
				{
					label: 'Shortcode',
					name: 'shortcode',
					type: 'text',
					defaultValue: charger.shortcode || '',
					validation: z
						.string()
						.regex(/^[a-z0-9-]+$/)
						.min(5)
						.max(30)
				},
				{
					label: 'Status',
					name: 'status',
					type: 'dropdown',
					options: [
						{ label: 'Pending', value: 'Pending' },
						{ label: 'Accepted', value: 'Accepted' },
						{ label: 'Rejected', value: 'Rejected' }
					],
					defaultValue: charger.status || 'Pending',
					validation: z.enum(['Pending', 'Accepted', 'Rejected'])
				}
			] as const,
			actions: [
				{
					label: 'Save',
					key: 'save',
					class: 'btn-primary',
					buttonType: 'submit',
					callback: ({ fieldValues, closeDrawer }) => {
						$mutationChargerUpdate.mutate(
							{
								id: charger.id.toString(),
								friendlyName: fieldValues.friendlyName,
								status: fieldValues.status as 'Accepted' | 'Pending' | 'Rejected',
								shortcode: fieldValues.shortcode
							},
							{ onSuccess: () => closeDrawer() }
						);
					}
				},
				{
					label: 'Cancel',
					key: 'cancel',
					class: 'btn-outline',
					callback: ({ closeDrawer }) => closeDrawer()
				},
				{
					label: 'Delete',
					key: 'delete',
					class: 'btn-error btn-outline',
					buttonType: 'button',
					callback: ({ closeDrawer }) => {
						$mutationChargerDelete.mutate(
							{ id: charger.id.toString() },
							{ onSuccess: () => closeDrawer() }
						);
					}
				}
			]
		});
	};

	const resetCharger = (type: 'Hard' | 'Soft') => {
		$mutationChargerReset.mutate({ id: charger.id, type });
	};
</script>

<div
	class="card bg-base-100 border-base-300 flex flex-col overflow-hidden border shadow-lg transition-all duration-300 hover:shadow-xl {isCharging
		? 'ring-primary/30 ring-2'
		: ''}"
>
	{#if isCharging}
		<div
			class="via-primary absolute left-0 right-0 top-0 h-1 animate-pulse bg-gradient-to-r from-transparent to-transparent"
		></div>
	{/if}

	<!-- Header -->
	<div class="from-base-200 to-base-300 border-base-300 border-b bg-gradient-to-br px-6 py-4">
		<div class="flex items-start justify-between gap-3">
			<div class="flex min-w-0 flex-1 items-start gap-3">
				<div
					class="bg-base-100 rounded-xl p-3 shadow-sm {isCharging ? 'ring-primary/50 ring-2' : ''}"
				>
					<Zap
						class="size-6 {isCharging ? 'text-primary animate-pulse' : 'text-base-content/60'}"
					/>
				</div>
				<div class="min-w-0 flex-1">
					<h3 class="truncate text-lg font-bold">{charger.friendlyName || 'Unnamed Charger'}</h3>
					<div class="mt-1 flex flex-wrap items-center gap-2">
						<span
							class="badge badge-{getChargerStatusColor(
								charger.status || 'Unknown'
							)} badge-sm gap-1"
						>
							{charger.status}
						</span>
						{#if charger.connectivity === 'Online'}
							<span class="badge badge-success badge-sm gap-1">
								<Wifi class="size-3" /> Online
							</span>
						{:else}
							<span class="badge badge-error badge-sm gap-1">
								<WifiOff class="size-3" /> Offline
							</span>
						{/if}
					</div>
				</div>
			</div>

			<div class="dropdown dropdown-end" class:dropdown-open={menuOpen}>
				<button
					class="btn btn-sm btn-circle btn-ghost"
					onclick={() => (menuOpen = !menuOpen)}
					onblur={() => setTimeout(() => (menuOpen = false), 200)}
				>
					<MoreVertical class="size-5" />
				</button>
				<ul
					class="dropdown-content menu bg-base-100 border-base-300 z-10 w-48 rounded-lg border p-2 shadow-xl"
				>
					<li>
						<button
							onclick={() => {
								openEditDrawer();
								menuOpen = false;
							}}><PencilLine class="size-4" /> Edit</button
						>
					</li>
					<li>
						<button
							onclick={() => {
								resetCharger('Soft');
								menuOpen = false;
							}}><RefreshCw class="size-4" /> Soft Reset</button
						>
					</li>
					<li>
						<button
							onclick={() => {
								resetCharger('Hard');
								menuOpen = false;
							}}><RefreshCw class="size-4" /> Hard Reset</button
						>
					</li>
					<div class="divider my-1"></div>
					<li>
						<button
							class="text-error"
							onclick={() => {
								$mutationChargerDelete.mutate({ id: charger.id.toString() });
								menuOpen = false;
							}}><Trash2 class="size-4" /> Delete</button
						>
					</li>
				</ul>
			</div>
		</div>

		<!-- Quick Info -->
		<div class="mt-4 grid grid-cols-2 gap-3 text-xs">
			<div class="bg-base-100 flex items-center gap-2 rounded-lg px-3 py-2">
				<Activity class="size-4 opacity-60" />
				<div class="min-w-0 flex-1">
					<div class="text-[10px] uppercase tracking-wide opacity-60">Model</div>
					<div class="truncate font-semibold">{charger.model || 'Unknown'}</div>
				</div>
			</div>
			<div class="bg-base-100 flex items-center gap-2 rounded-lg px-3 py-2">
				<Hash class="size-4 opacity-60" />
				<div class="min-w-0 flex-1">
					<div class="text-[10px] uppercase tracking-wide opacity-60">Shortcode</div>
					<code class="truncate font-mono text-xs font-semibold">{charger.shortcode || '-'}</code>
				</div>
			</div>
			{#if charger.firmwareVersion}
				<div class="bg-base-100 flex items-center gap-2 rounded-lg px-3 py-2">
					<Cpu class="size-4 opacity-60" />
					<div class="min-w-0 flex-1">
						<div class="text-[10px] uppercase tracking-wide opacity-60">Firmware</div>
						<div class="truncate font-semibold">{charger.firmwareVersion}</div>
					</div>
				</div>
			{/if}
			{#if charger.lastHeartbeat}
				<div class="bg-base-100 flex items-center gap-2 rounded-lg px-3 py-2">
					<Clock class="size-4 opacity-60" />
					<div class="min-w-0 flex-1">
						<div class="text-[10px] uppercase tracking-wide opacity-60">Last Heartbeat</div>
						<div class="truncate font-semibold">
							{formatDistanceToNow(new Date(charger.lastHeartbeat), { addSuffix: true })}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- OCPP Endpoint -->
		<div class="bg-base-100 mt-3 rounded-lg px-3 py-2">
			<div class="flex items-start gap-2">
				<Globe class="mt-0.5 size-4 flex-shrink-0 opacity-60" />
				<div class="min-w-0 flex-1">
					<div class="mb-1 text-[10px] uppercase tracking-wide opacity-60">OCPP Endpoint</div>
					<code class="block truncate font-mono text-xs opacity-80">
						ws://{window.location.host}/api/ocpp/version/1.6/{charger.shortcode}
					</code>
				</div>
			</div>
		</div>
	</div>

	<!-- Connectors -->
	<div class="border-base-300 border-t px-6 py-4">
		<!-- Connectors Header with Stats -->
		<div class="mb-4 flex items-center justify-between gap-4">
			<h4 class="flex items-center gap-2 text-sm font-bold">
				<Plug class="size-4" />
				Connectors ({connectors.length})
			</h4>

			{#if true}
				{@const s = stats()}
				<div class="flex gap-3 text-xs">
					<div class="flex items-center gap-1.5">
						<div class="text-success font-bold">{s.available}</div>
						<div class="opacity-60">Available</div>
					</div>
					<div class="flex items-center gap-1.5">
						<div class="text-primary font-bold">{s.charging}</div>
						<div class="opacity-60">Charging</div>
					</div>
					<div class="flex items-center gap-1.5">
						<div class="text-warning font-bold">
							{s.totalPower > 0 ? `${(s.totalPower / 1000).toFixed(2)}` : '0.00'}
						</div>
						<div class="opacity-60">kW</div>
					</div>
				</div>
			{/if}
		</div>

		{#if connectors && connectors.length > 0}
			<div class="space-y-3">
				{#each connectors as connector (connector.id)}
					{@const power = connector.telemetry?.meterValue?.raw
						? getMeasurandValue(connector.telemetry.meterValue.raw, 'Power.Active.Import')
						: 0}
					{@const temp = connector.telemetry?.meterValue?.raw
						? getMeasurandValue(connector.telemetry.meterValue.raw, 'Temperature')
						: 0}
					{@const freq = connector.telemetry?.meterValue?.raw
						? getMeasurandValue(connector.telemetry.meterValue.raw, 'Frequency')
						: 0}
					{@const l1 = connector.telemetry?.meterValue?.raw
						? getPhaseValue(connector.telemetry.meterValue.raw, 'L1')
						: 0}
					{@const l2 = connector.telemetry?.meterValue?.raw
						? getPhaseValue(connector.telemetry.meterValue.raw, 'L2')
						: 0}
					{@const l3 = connector.telemetry?.meterValue?.raw
						? getPhaseValue(connector.telemetry.meterValue.raw, 'L3')
						: 0}

					<div
						class="overflow-hidden rounded-xl border-2 shadow-sm transition-all {connector.status ===
						'Charging'
							? 'border-primary bg-primary/5'
							: 'border-base-300 bg-base-100'}"
					>
						<!-- Always Visible Header -->
						<div
							class="px-4 py-3 {connector.status === 'Charging'
								? 'from-primary/10 bg-gradient-to-r to-transparent'
								: 'from-base-200 bg-gradient-to-r to-transparent'}"
						>
							<div class="flex items-center justify-between gap-3">
								<div class="flex items-center gap-3">
									<div
										class="rounded-lg p-2 {connector.status === 'Charging'
											? 'bg-primary/20 ring-primary/30 ring-2'
											: 'bg-base-300'}"
									>
										<Plug
											class="size-5 {connector.status === 'Charging'
												? 'text-primary'
												: 'opacity-60'}"
										/>
									</div>
									<div>
										<div class="text-base font-bold">Connector #{connector.connectorId}</div>
										<span
											class="badge badge-{getStatusColor(connector.status)} badge-sm mt-1 gap-1"
										>
											{connector.status}
										</span>
									</div>
								</div>
								<div class="text-right">
									<div class="flex items-center gap-3">
										<div>
											{#if power > 0}
												<div class="text-primary text-2xl font-bold">
													{(power / 1000).toFixed(2)}
												</div>
												<div class="text-xs opacity-60">kW</div>
											{:else}
												<div class="text-lg font-semibold opacity-60">Idle</div>
											{/if}
										</div>
										<button
											class="btn btn-circle btn-sm"
											disabled={$mutationConnectorUnlock.isPending}
											onclick={() =>
												$mutationConnectorUnlock.mutate({ id: connector.id.toString() })}
											title="Unlock Connector"
										>
											<Unlock class="size-4" />
										</button>
									</div>
								</div>
							</div>
						</div>

						<!-- Details - Always Visible -->
						<div class="bg-base-100 border-base-300 border-t px-4 py-3">
							{#if connector.telemetry?.meterValue?.raw}
								<div class="flex flex-wrap items-center gap-2">
									{#if l1 > 0 || l2 > 0 || l3 > 0}
										<span class="text-xs opacity-50">Phases:</span>
										{#if l1 > 0}
											<span class="badge badge-sm">L1: {l1.toFixed(1)}A</span>
										{/if}
										{#if l2 > 0}
											<span class="badge badge-sm">L2: {l2.toFixed(1)}A</span>
										{/if}
										{#if l3 > 0}
											<span class="badge badge-sm">L3: {l3.toFixed(1)}A</span>
										{/if}
									{/if}
									{#if temp > 0}
										<span class="badge badge-sm gap-1">
											<ThermometerIcon class="size-3" />
											{temp.toFixed(1)}°C
										</span>
									{/if}
									{#if freq > 0}
										<span class="badge badge-sm gap-1">
											<Gauge class="size-3" />
											{freq.toFixed(1)}Hz
										</span>
									{/if}
									{#if l1 === 0 && l2 === 0 && l3 === 0 && temp === 0 && freq === 0}
										<span class="text-xs opacity-50">No detailed metrics available</span>
									{/if}
								</div>
							{:else}
								<div class="text-center text-xs opacity-50">No telemetry data available</div>
							{/if}

							{#if connector.errorCode}
								<div class="alert alert-error alert-sm mt-3">
									<AlertCircle class="size-4" />
									<span class="text-xs">{connector.errorCode}</span>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="py-8 text-center opacity-60">
				<Plug class="mx-auto mb-2 size-8 opacity-40" />
				<div class="text-sm">No connectors available</div>
			</div>
		{/if}
	</div>
</div>
