<script lang="ts">
	import {
		createMutationChargerDelete,
		createMutationChargerReset,
		createMutationChargerUpdate,
		createMutationConnectorUnlock,
		createQueryConnector
	} from '$lib/queryClient';
	import { drawerStore } from '$lib/drawerStore';
	import { z } from 'zod';
	import type { InferResponseType } from 'hono';
	import type { hClient } from '$lib/hClient';
	import IconChargingPile from '$lib/icons/tabler/IconChargingPile.svelte';
	import { formatDistanceToNow } from 'date-fns';
	import IconPlug from '$lib/icons/tabler/IconPlug.svelte';

	const {
		charger
	}: { charger: InferResponseType<(typeof hClient)['charger']['$get']>['data'][0] } = $props();

	const queryConnectors = createQueryConnector(charger.id.toString(), 10000);

	const mutationChargerUpdate = createMutationChargerUpdate();
	const mutationChargerDelete = createMutationChargerDelete();
	const mutationChargerReset = createMutationChargerReset();
	const mutationConnectorUnlock = createMutationConnectorUnlock();

	const openEditDrawer = () => {
		drawerStore.open({
			header: 'Edit Charger',
			fields: [
				{
					label: 'Friendly Name',
					name: 'friendlyName',
					type: 'text',
					defaultValue: charger.friendlyName || '',
					validation: z.string().min(1, { message: 'Please enter a friendly name.' })
				},
				{
					label: 'Shortcode',
					name: 'shortcode',
					type: 'text',
					defaultValue: charger.shortcode || '',
					validation: z
						.string()
						.regex(/^[a-z0-9-]+$/, {
							message:
								'Only lowercase letters, numbers, and dashes are allowed (no spaces or other characters).'
						})
						.min(5, { message: 'Minimum length is 5 characters.' })
						.max(30, { message: 'Maximum length is 30 characters.' })
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
								status: fieldValues.status as any,
								shortcode: fieldValues.shortcode
							},
							{
								onSuccess: () => {
									closeDrawer();
								}
							}
						);
					}
				},
				{
					label: 'Cancel',
					key: 'cancel',
					class: 'btn-outline',
					callback: ({ closeDrawer }) => {
						closeDrawer();
					}
				},
				{
					label: 'Delete',
					key: 'delete',
					class: 'btn-error btn-outline',
					buttonType: 'button',
					callback: ({ closeDrawer }) => {
						$mutationChargerDelete.mutate(
							{ id: charger.id.toString() },
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

	const getStatusColor = (status: string) => {
		const colors = {
			Available: 'bg-success',
			Preparing: 'bg-info',
			Charging: 'bg-primary',
			SuspendedEVSE: 'bg-warning',
			SuspendedEV: 'bg-warning',
			Finishing: 'bg-info',
			Reserved: 'bg-secondary',
			Unavailable: 'bg-base-300',
			Faulted: 'bg-error'
		};
		return (colors as any)[status] || 'bg-base-300';
	};

	let dialogReset: HTMLDialogElement;

	const resetCharger = (type: 'Hard' | 'Soft') => {
		$mutationChargerReset.mutate(
			{
				id: charger.id,
				type
			},
			{
				onSuccess: () => {
					dialogReset.close();
				}
			}
		);
	};

	function getPhaseValue(data: any[], phase: string) {
		for (const entry of data) {
			const phaseData = entry.sampledValue.find(
				(item: any) => item.phase === phase && item.measurand === 'Current.Import'
			);
			if (phaseData) {
				return `${phaseData.value} ${phaseData.unit ?? ''}`.trim();
			}
		}
		return 'N/A';
	}

	function getMeasurandValue(data: any[], measurand: string) {
		for (const entry of data) {
			const measurandData = entry.sampledValue.find(
				(item: any) => item.measurand === measurand && !item.phase
			);
			if (measurandData) {
				return measurandData.value;
			}
		}
		return 'N/A';
	}
</script>

<div class="bg-base-200 container mx-auto rounded-lg px-4 py-6 shadow-md">
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center gap-4">
			<IconChargingPile class="text-primary h-10 w-10" />
			<div>
				<h2 class="text-2xl font-semibold">
					{charger.friendlyName || 'Unknown'}
				</h2>
				<p class="text-sm text-gray-500">{charger.vendor || 'Unknown Vendor'}</p>
			</div>
		</div>
		<div class="flex gap-x-2">
			<div>
				<button class="btn btn-ghost btn-sm" onclick={() => dialogReset.showModal()}>Reset</button>
				<dialog bind:this={dialogReset} class="modal">
					<div class="modal-box">
						<form method="dialog">
							<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
						</form>
						<h3 class="mb-10 text-lg font-bold">Reset Charger</h3>

						<div class="flex gap-x-2">
							<button
								disabled={$mutationChargerReset.isPending}
								class="btn btn-warning btn-sm"
								onclick={() => resetCharger('Soft')}>Soft Reset</button
							>
							<button
								disabled={$mutationChargerReset.isPending}
								class="btn btn-error btn-sm"
								onclick={() => resetCharger('Hard')}>Hard Reset</button
							>
						</div>
					</div>
				</dialog>
			</div>

			<button class="btn btn-ghost btn-sm" onclick={openEditDrawer}>Edit</button>
		</div>
	</div>

	<div class="mb-6">
		<span
			class="badge badge-lg badge-outline p-3"
			class:badge-warning={charger.status === 'Pending'}
			class:badge-success={charger.status === 'Accepted'}
		>
			{charger.status || 'Unknown'}
		</span>
	</div>

	<table class="bg-base-300 table w-full overflow-hidden rounded-lg">
		<tbody>
			<tr>
				<td class="w-60 font-medium">Connectivity</td>
				<td>
					<span
						class={`badge badge-outline ${charger.connectivity === 'Online' ? 'badge-success' : 'badge-warning'} p-3 text-white`}
					>
						{charger.connectivity || 'Unknown'}
					</span>
				</td>
			</tr>
			<tr>
				<td class="w-60 font-medium">Firmware</td>
				<td>{charger.firmwareVersion || 'N/A'}</td>
			</tr>
			<tr>
				<td class="w-60 font-medium">Model</td>
				<td>{charger.model || 'N/A'}</td>
			</tr>
			<tr>
				<td class="w-60 font-medium">Last Heartbeat</td>
				<td>
					{charger.lastHeartbeat
						? formatDistanceToNow(new Date(charger.lastHeartbeat), { addSuffix: true })
						: 'N/A'}
				</td>
			</tr>
			<tr>
				<td class="w-60 font-medium">Shortcode</td>
				<td>{charger.shortcode || 'N/A'}</td>
			</tr>
		</tbody>
	</table>

	<div class="mt-6">
		<h3 class="mb-4 text-xl font-bold">Connectors</h3>
		<div class="space-y-4">
			{#if $queryConnectors.data?.data}
				{#each $queryConnectors.data.data as connector}
					<div
						class="bg-base-300 flex w-full items-center justify-between rounded-lg p-4 shadow-md"
					>
						<div class="flex items-center gap-4">
							<IconPlug class="h-6 w-6 text-current" />
							<div class="flex flex-col text-left">
								<span class="font-bold">Connector {connector.connectorId}</span>
								{#if connector.telemetry?.meterValue.raw}
									<div class="text-sm">
										<p>
											<b>Current Load:</b> L1: {getPhaseValue(
												connector.telemetry?.meterValue.raw,
												'L1'
											)}, L2: {getPhaseValue(connector.telemetry?.meterValue.raw, 'L2')}, L3: {getPhaseValue(
												connector.telemetry?.meterValue.raw,
												'L3'
											)}
										</p>
										<p>
											<b>Power:</b>
											{getMeasurandValue(
												connector.telemetry?.meterValue.raw,
												'Power.Active.Import'
											)}W
										</p>
										<p>
											<b>Temperature:</b>
											{getMeasurandValue(connector.telemetry?.meterValue.raw, 'Temperature')}°C
										</p>
										<p>
											<b>Frequency:</b>
											{getMeasurandValue(connector.telemetry?.meterValue.raw, 'Frequency')} Hz
										</p>
									</div>
								{:else}
									<p class="text-sm">Telemetry data unavailable</p>
								{/if}
								{#if connector.errorCode}
									<p class="text-error mt-1 text-sm">Error: {connector.errorCode}</p>
								{/if}
							</div>
							<div class="w-16"></div>
							<button
								disabled={$mutationConnectorUnlock.isPending}
								class="btn btn-ghost btn-sm"
								onclick={() => $mutationConnectorUnlock.mutate({ id: connector.id.toString() })}
								>Unlock</button
							>
						</div>
						<div class="flex items-center gap-4">
							<p class="text-sm font-medium">{connector.status}</p>
							<div class={`h-3 w-20 rounded-full ${getStatusColor(connector.status)}`}></div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
