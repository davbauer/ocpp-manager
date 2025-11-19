<script lang="ts">
	import {
		createQueryRfidTagDetail,
		createMutationRfidTagCreate,
		createMutationRfidTagDelete,
		createMutationRfidTagUpdate
	} from '$lib/queryClient';
	import { drawerStore } from '$lib/drawerStore';
	import { z } from 'zod';
	import { formatDistanceToNow, format } from 'date-fns';
	import BasePage from '$lib/components/BasePage.svelte';
	import { CreditCard, Edit, Plus } from 'lucide-svelte';
	import Scrollable from '$lib/components/Scrollable.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	let currentPage = $state(1);
	const pageSize = 20;

	const queryRfidTags = $derived(createQueryRfidTagDetail(currentPage, pageSize, 10000));
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
	{#snippet actions()}
		<button class="btn btn-primary btn-sm gap-2" onclick={openCreateDrawer}>
			<Plus class="h-4 w-4" />
			Add RFID Tag
		</button>
	{/snippet}

	<div class="container mx-auto px-4">
		{#if $queryRfidTags.isPending}
			<div class="flex flex-col items-center justify-center py-32">
				<span class="loading loading-spinner loading-lg text-primary mb-4"></span>
				<p class="text-sm opacity-60">Loading RFID tags...</p>
			</div>
		{:else if $queryRfidTags.data?.data && $queryRfidTags.data.data.length > 0}
			<Pagination
				{currentPage}
				totalCount={$queryRfidTags.data?.total_count ?? 0}
				{pageSize}
				onPageChange={(newPage) => {
					currentPage = newPage;
				}}
				class="mb-4"
			/>

			<Scrollable class="p-4" maxHeight="80svh">
				<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
					{#each $queryRfidTags.data.data as tag}
						<div
							class="card bg-base-100 border-base-300 group overflow-hidden border shadow-sm transition-all hover:shadow-md"
						>
							<!-- Card Header -->
							<div class="bg-base-200 px-5 py-4">
								<div class="mb-3 flex items-center justify-between">
									<div class="flex items-center gap-2 opacity-60">
										<CreditCard class="h-4 w-4" />
										<span class="text-xs font-medium uppercase tracking-wide">RFID Access tag</span>
									</div>
									<button
										class="btn btn-ghost btn-xs btn-square opacity-0 transition-opacity group-hover:opacity-100"
										onclick={() => openEditDrawer(tag)}
									>
										<Edit class="h-3.5 w-3.5" />
									</button>
								</div>

								<!-- Card Number -->
								<div class="mb-3">
									<p class="font-mono text-lg font-semibold tracking-wide">{tag.rfidTag}</p>
								</div>

								<!-- Name -->
								<div>
									<p class="text-base font-medium">{tag.friendlyName}</p>
								</div>
							</div>

							<!-- Card Footer - Info -->
							<div class="bg-base-100 px-5 py-4">
								<div class="flex items-center justify-between gap-4 text-sm">
									<div>
										<p class="mb-0.5 text-xs opacity-50">Issued</p>
										<p class="font-medium">
											{format(new Date(tag.createdAt), 'MMM d, yyyy')}
										</p>
									</div>

									{#if tag.lastTransaction}
										<div class="text-right">
											<p class="mb-0.5 text-xs opacity-50">Last Used</p>
											<p class="font-medium">
												{formatDistanceToNow(new Date(tag.lastTransaction.createdAt), {
													addSuffix: true
												})}
											</p>
										</div>
									{:else}
										<div class="text-right">
											<p class="mb-0.5 text-xs opacity-50">Status</p>
											<p class="font-medium opacity-60">Unused</p>
										</div>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</Scrollable>
		{:else}
			<div class="flex flex-col items-center justify-center py-32">
				<div class="bg-base-200 mb-6 rounded-2xl p-8">
					<CreditCard class="size-24 opacity-40" />
				</div>
				<h3 class="mb-2 text-2xl font-bold">No RFID Tags Found</h3>
				<p class="text-base-content/60 mb-6">Create your first RFID tag to get started</p>
				<button class="btn btn-primary gap-2" onclick={() => openCreateDrawer()}>
					<Plus class="h-4 w-4" />
					Add RFID Tag
				</button>
			</div>
		{/if}
	</div>
</BasePage>
