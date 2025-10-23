<script lang="ts">
	import {
		createQueryChargeAuthorizationDetail,
		createMutationChargeAuthorizationCreate,
		createMutationChargeAuthorizationUpdate,
		createMutationChargeAuthorizationDelete,
		createQueryCharger,
		createQueryRfidTagDetail
	} from '$lib/queryClient';
	import { drawerStore } from '$lib/drawerStore';
	import { z } from 'zod';
	import { formatDistanceToNow } from 'date-fns';
	import BasePage from '$lib/components/BasePage.svelte';
	import IconLockPin from '$lib/icons/tabler/IconLockPin.svelte';
	import Scrollable from '$lib/components/Scrollable.svelte';

	const queryChargeAuthorizations = createQueryChargeAuthorizationDetail(10000);
	const queryChargers = createQueryCharger(10000);
	const queryRfidTags = createQueryRfidTagDetail(10000);

	const mutationChargeAuthorizationCreate = createMutationChargeAuthorizationCreate();
	const mutationChargeAuthorizationUpdate = createMutationChargeAuthorizationUpdate();
	const mutationChargeAuthorizationDelete = createMutationChargeAuthorizationDelete();

	const openCreateDrawer = () => {
		drawerStore.open({
			header: 'Add Charge Authorization',
			fields: [
				{
					label: 'Charger ID',
					name: 'chargerId',
					type: 'dropdown',
					options: $queryChargers.data?.data
						? $queryChargers.data.data.map((charger) => ({
								label: `${charger.friendlyName} (${charger.vendor})`,
								value: charger.id.toString()
							}))
						: [],
					validation: z.string().min(1)
				},

				{
					label: 'Expiry Date',
					name: 'expiryDate',
					type: 'date',
					defaultValue: '',
					validation: z.string()
				},
				{
					label: 'RFID Tag ID',
					name: 'rfidTagId',
					type: 'dropdown',
					options: $queryRfidTags.data?.data
						? $queryRfidTags.data.data.map((tag) => ({
								label: `${tag.friendlyName} (${tag.rfidTag})`,
								value: tag.id.toString()
							}))
						: [],

					validation: z.string().min(1)
				}
			] as const,
			actions: [
				{
					label: 'Create',
					key: 'create',
					class: 'btn-primary',
					buttonType: 'submit',
					callback: ({ fieldValues, closeDrawer }) => {
						$mutationChargeAuthorizationCreate.mutate(
							{
								chargerId: parseInt(fieldValues.chargerId),
								expiryDate: fieldValues.expiryDate ? new Date(fieldValues.expiryDate) : null,
								rfidTagId: parseInt(fieldValues.rfidTagId) || null
							},
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

	const openEditDrawer = (auth: NonNullable<typeof $queryChargeAuthorizations.data>['data'][0]) => {
		drawerStore.open({
			header: 'Edit Charge Authorization',
			fields: [
				{
					label: 'Charger ID',
					name: 'chargerId',
					type: 'dropdown',
					defaultValue: auth.chargerId.toString(),
					options: $queryChargers.data?.data
						? $queryChargers.data.data.map((charger) => ({
								label: `${charger.friendlyName} (${charger.vendor})`,
								value: charger.id.toString()
							}))
						: [],
					validation: z.string().min(1)
				},

				{
					label: 'Expiry Date',
					name: 'expiryDate',
					type: 'date',
					defaultValue: auth.expiryDate || '',
					validation: z.string()
				},
				{
					label: 'RFID Tag ID',
					name: 'rfidTagId',
					type: 'dropdown',
					defaultValue: auth.rfidTagId?.toString() || '',
					options: $queryRfidTags.data?.data
						? $queryRfidTags.data.data.map((tag) => ({
								label: `${tag.friendlyName} (${tag.rfidTag})`,
								value: tag.id.toString()
							}))
						: [],
					validation: z.string().min(1)
				}
			],
			actions: [
				{
					label: 'Save',
					key: 'save',
					class: 'btn-primary',
					buttonType: 'submit',
					callback: ({ fieldValues, closeDrawer }) => {
						$mutationChargeAuthorizationUpdate.mutate(
							{
								id: auth.id,
								chargerId: parseInt(fieldValues.chargerId),
								expiryDate: fieldValues.expiryDate ? new Date(fieldValues.expiryDate) : null,
								rfidTagId: parseInt(fieldValues.rfidTagId) || null
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
						$mutationChargeAuthorizationDelete.mutate(
							{ id: auth.id },
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
</script>

<BasePage title="Charge Authorizations">
	<div class="container mx-auto px-4">
		<div class="mb-6 flex items-center justify-end">
			<button
				class="btn btn-primary"
				disabled={$queryChargers.isPending || $queryRfidTags.isPending}
				onclick={openCreateDrawer}
			>
				Add Charge Authorization
			</button>
		</div>

		<Scrollable class="p-4" maxHeight="80svh">
			<div class="space-y-6">
				{#if $queryChargeAuthorizations.data?.data}
					{#each $queryChargeAuthorizations.data.data as auth}
						<div class="bg-base-200 rounded-lg p-6 shadow-md">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<IconLockPin class="text-primary h-10 w-10" />
									<div>
										<h3 class="text-xl font-semibold">Charger ID: {auth.chargerId}</h3>
									</div>
								</div>
								<button class="btn btn-ghost btn-sm" onclick={() => openEditDrawer(auth)}
									>Edit</button
								>
							</div>
							<table class="bg-base-300 mt-4 table w-full overflow-hidden rounded-lg">
								<tbody>
									<tr>
										<td class="w-60 font-medium">RFID Tag</td>
										<td>{auth.tag.friendlyName} ({auth.tag.rfidTag})</td>
									</tr>
									<tr>
										<td class="w-60 font-medium">Charging Station</td>
										<td>{auth.charger.friendlyName} ({auth.charger.vendor})</td>
									</tr>
									<tr>
										<td class="w-60 font-medium">Expiry Date</td>
										<td
											>{auth.expiryDate
												? formatDistanceToNow(new Date(auth.expiryDate), { addSuffix: true })
												: 'N/A'}</td
										>
									</tr>
									<tr>
										<td class="w-60 font-medium">Created</td>
										<td>{formatDistanceToNow(new Date(auth.createdAt), { addSuffix: true })}</td>
									</tr>
								</tbody>
							</table>
						</div>
					{/each}
				{:else}
					<div class="bg-base-200 rounded-lg p-8 text-center">
						<p class="text-base-content">Loading Charge Authorizations...</p>
					</div>
				{/if}
			</div>
		</Scrollable>
	</div>
</BasePage>
