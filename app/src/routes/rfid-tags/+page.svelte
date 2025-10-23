<script lang="ts">
	import {
		createQueryRfidTagDetail,
		createMutationRfidTagCreate,
		createMutationRfidTagDelete,
		createMutationRfidTagUpdate
	} from '$lib/queryClient';
	import { drawerStore } from '$lib/drawerStore';
	import { z } from 'zod';
	import { formatDistanceToNow } from 'date-fns';
	import BasePage from '$lib/components/BasePage.svelte';
	import IconDeviceAirtag from '$lib/icons/tabler/IconDeviceAirtag.svelte';
	import Scrollable from '$lib/components/Scrollable.svelte';

	const queryRfidTags = createQueryRfidTagDetail(10000);
	const mutationRfidTagCreate = createMutationRfidTagCreate();
	const mutationRfidTagDelete = createMutationRfidTagDelete();
	const mutationRfidTagUpdate = createMutationRfidTagUpdate();

	const openCreateDrawer = () => {
		drawerStore.open({
			header: 'Add RFID Tag',
			fields: [
				{
					label: 'Friendly Name',
					name: 'friendlyName',
					type: 'text',
					defaultValue: '',
					validation: z.string().min(1)
				},
				{
					label: 'RFID Tag',
					name: 'rfidTag',
					type: 'text',
					defaultValue: '',
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
						$mutationRfidTagCreate.mutate(
							{
								friendlyName: fieldValues.friendlyName,

								rfidTag: fieldValues.rfidTag
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

	const openEditDrawer = (tag: NonNullable<typeof $queryRfidTags.data>['data'][0]) => {
		drawerStore.open({
			header: 'Edit RFID Tag',
			fields: [
				{
					label: 'Friendly Name',
					name: 'friendlyName',
					type: 'text',
					defaultValue: tag.friendlyName,
					validation: z.string().min(1)
				},
				{
					label: 'RFID Tag',
					name: 'rfidTag',
					type: 'text',
					defaultValue: tag.rfidTag,
					validation: z.string().min(1)
				}
			] as const,
			actions: [
				{
					label: 'Save',
					key: 'save',
					class: 'btn-primary',
					buttonType: 'submit',
					callback: ({ fieldValues, closeDrawer }) => {
						$mutationRfidTagUpdate.mutate(
							{
								id: tag.id,
								friendlyName: fieldValues.friendlyName,
								rfidTag: fieldValues.rfidTag
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
					callback: ({ closeDrawer }) => closeDrawer()
				},
				{
					label: 'Delete',
					key: 'delete',
					class: 'btn-error btn-outline',
					buttonType: 'button',
					callback: ({ closeDrawer }) => {
						$mutationRfidTagDelete.mutate(
							{ id: tag.id },
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

<BasePage title="RFID Tags">
	<div class="container mx-auto px-4">
		<div class="mb-6 flex items-center justify-end">
			<button class="btn btn-primary" onclick={openCreateDrawer}>Add RFID Tag</button>
		</div>

		<Scrollable class="p-4" maxHeight="80svh">
			<div class="space-y-6">
				{#if $queryRfidTags.data?.data && $queryRfidTags.data.data.length > 0}
					{#each $queryRfidTags.data.data as tag}
						<div class="bg-base-200 rounded-lg p-6 shadow-md">
							<div class="mb-6 flex items-center justify-between">
								<div class="flex items-center gap-4">
									<IconDeviceAirtag class="text-primary h-10 w-10" />
									<div>
										<h3 class="text-xl font-semibold">{tag.friendlyName}</h3>
										<p class="text-sm text-gray-500">RFID: {tag.rfidTag}</p>
									</div>
								</div>
								<button class="btn btn-ghost btn-sm" onclick={() => openEditDrawer(tag)}>
									Edit
								</button>
							</div>

							<table class="bg-base-300 table w-full overflow-hidden rounded-lg">
								<tbody>
									<tr>
										<td class="w-60 font-medium">Created</td>
										<td>{formatDistanceToNow(new Date(tag.createdAt), { addSuffix: true })}</td>
									</tr>
									{#if tag.lastTransaction}
										<tr>
											<td class="w-60 font-medium">Last Transaction</td>
											<td
												>#{tag.lastTransaction.id} -
												{formatDistanceToNow(tag.lastTransaction.createdAt, {
													addSuffix: true
												})}</td
											>
										</tr>
									{/if}
								</tbody>
							</table>
						</div>
					{/each}
				{:else}
					<div class="bg-base-200 rounded-lg p-8 text-center">
						<p class="text-base-content">No RFID Tags Found</p>
					</div>
				{/if}
			</div>
		</Scrollable>
	</div>
</BasePage>
