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
	import toast from 'svelte-french-toast';
	import { format, isPast } from 'date-fns';
	import BasePage from '$lib/components/BasePage.svelte';
	import { CreditCard, Zap, Plus, Calendar, CheckCircle, Trash2, AlertTriangle, PencilLine } from 'lucide-svelte';
	import Scrollable from '$lib/components/Scrollable.svelte';

	const queryChargeAuthorizations = createQueryChargeAuthorizationDetail(1, 10000, 10000);
	const queryChargers = createQueryCharger(1, 1000, 10000);
	const queryRfidTags = createQueryRfidTagDetail(1, 1000, 10000);

	const mutationChargeAuthorizationCreate = createMutationChargeAuthorizationCreate();
	const mutationChargeAuthorizationUpdate = createMutationChargeAuthorizationUpdate();
	const mutationChargeAuthorizationDelete = createMutationChargeAuthorizationDelete();

	let deleteModal: HTMLDialogElement;
	let authToDelete = $state<{ id: number; chargerName: string; tagName: string } | null>(null);

	// Check if authorization is expired
	function isExpired(expiryDate: string | null): boolean {
		if (!expiryDate) return false;
		return isPast(new Date(expiryDate));
	}

	// Derived: All chargers as dropdown options - O(c) where c = charger count
	const allChargerOptions = $derived(
		($queryChargers.data?.data || []).map((c) => ({
			label: `${c.friendlyName} (${c.vendor})`,
			value: c.id.toString(),
			id: c.id
		}))
	);

	// Derived: Total charger count
	const totalChargers = $derived(allChargerOptions.length);

	// Derived: Map of rfidTagId -> Set of assigned charger IDs - O(a) where a = auth count
	const assignedChargersByTag = $derived.by(() => {
		const auths = $queryChargeAuthorizations.data?.data || [];
		const map = new Map<number, Set<number>>();
		for (const auth of auths) {
			if (auth.rfidTagId) {
				let set = map.get(auth.rfidTagId);
				if (!set) {
					set = new Set();
					map.set(auth.rfidTagId, set);
				}
				set.add(auth.chargerId);
			}
		}
		return map;
	});

	// Derived: Set of existing authorization combinations - O(a)
	const existingCombinations = $derived(
		new Set(($queryChargeAuthorizations.data?.data || []).map((a) => `${a.rfidTagId}-${a.chargerId}`))
	);

	// Get available chargers for a tag - O(c) lookup, cached by Svelte reactivity
	function getAvailableChargersForTag(rfidTagId: number) {
		const assignedIds = assignedChargersByTag.get(rfidTagId);
		if (!assignedIds || assignedIds.size === 0) return allChargerOptions;
		return allChargerOptions.filter((c) => !assignedIds.has(c.id));
	}

	// Get available charger count for a tag - O(1) if no assignments, O(c) otherwise
	function getAvailableCountForTag(rfidTagId: number): number {
		const assignedIds = assignedChargersByTag.get(rfidTagId);
		if (!assignedIds) return totalChargers;
		return totalChargers - assignedIds.size;
	}

	// Derived: RFID tags that have at least one available charger - O(t) where t = tag count
	const tagsWithAvailableChargers = $derived.by(() => {
		const tags = $queryRfidTags.data?.data || [];
		return tags.filter((tag) => getAvailableCountForTag(tag.id) > 0);
	});

	// Derived: Authorizations grouped by RFID tag with availability count - O(a)
	const groupedByTag = $derived.by(() => {
		const auths = ($queryChargeAuthorizations.data?.data || []).filter((a) => a.rfidTagId && a.tag);
		const grouped = new Map<number, typeof auths>();

		for (const auth of auths) {
			if (auth.rfidTagId) {
				let list = grouped.get(auth.rfidTagId);
				if (!list) {
					list = [];
					grouped.set(auth.rfidTagId, list);
				}
				list.push(auth);
			}
		}

		return Array.from(grouped.entries()).map(([rfidTagId, authorizations]) => ({
			rfidTag: authorizations[0].tag!,
			authorizations,
			availableCount: getAvailableCountForTag(rfidTagId)
		}));
	});

	const addChargerAccess = (rfidTag: any) => {
		const availableChargers = getAvailableChargersForTag(rfidTag.id);

		if (availableChargers.length === 0) {
			toast.error('All chargers are already assigned to this RFID tag.');
			return;
		}

		drawerStore.open({
			header: `Add Charger Access for ${rfidTag.friendlyName}`,
			fields: [
				{
					label: 'Charger',
					name: 'chargerId',
					type: 'dropdown',
					options: availableChargers,
					validation: z.string().min(1)
				},
				{
					label: 'Expiry Date (Optional)',
					name: 'expiryDate',
					type: 'date',
					defaultValue: '',
					validation: z.string()
				}
			] as const,
			actions: [
				{
					label: 'Add Access',
					key: 'create',
					class: 'btn-primary',
					buttonType: 'submit',
					callback: ({ fieldValues, closeDrawer }) => {
						$mutationChargeAuthorizationCreate.mutate(
							{
								rfidTagId: rfidTag.id,
								chargerId: parseInt(fieldValues.chargerId),
								expiryDate: fieldValues.expiryDate ? new Date(fieldValues.expiryDate) : null
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

	const editExpiry = (auth: any) => {
		drawerStore.open({
			header: 'Edit Expiry Date',
			fields: [
				{
					label: 'Expiry Date',
					name: 'expiryDate',
					type: 'date',
					defaultValue: auth.expiryDate || '',
					validation: z.string()
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
								chargerId: auth.chargerId,
								expiryDate: fieldValues.expiryDate ? new Date(fieldValues.expiryDate) : null,
								rfidTagId: auth.rfidTagId
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
					label: 'Remove Expiry',
					key: 'remove',
					class: 'btn-outline',
					buttonType: 'button',
					callback: ({ closeDrawer }) => {
						$mutationChargeAuthorizationUpdate.mutate(
							{
								id: auth.id,
								chargerId: auth.chargerId,
								expiryDate: null,
								rfidTagId: auth.rfidTagId
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

	const confirmDelete = (auth: any) => {
		authToDelete = {
			id: auth.id,
			chargerName: auth.charger.friendlyName,
			tagName: auth.tag.friendlyName
		};
		deleteModal?.showModal();
	};

	const handleDelete = () => {
		if (authToDelete) {
			$mutationChargeAuthorizationDelete.mutate(
				{ id: authToDelete.id },
				{
					onSuccess: () => {
						deleteModal?.close();
						authToDelete = null;
					}
				}
			);
		}
	};

	const cancelDelete = () => {
		deleteModal?.close();
		authToDelete = null;
	};

	const openCreateDrawer = () => {
		if (tagsWithAvailableChargers.length === 0) {
			toast.error('All RFID tags are already assigned to all chargers.');
			return;
		}

		drawerStore.open({
			header: 'Create Authorization',
			fields: [
				{
					label: 'RFID Tag',
					name: 'rfidTagId',
					type: 'dropdown',
					options: tagsWithAvailableChargers.map((tag) => ({
						label: `${tag.friendlyName} (${tag.rfidTag})`,
						value: tag.id.toString()
					})),
					validation: z.string().min(1)
				},
				{
					label: 'Charger',
					name: 'chargerId',
					type: 'dropdown',
					options: allChargerOptions.map(({ label, value }) => ({ label, value })),
					validation: z.string().min(1)
				},
				{
					label: 'Expiry Date (Optional)',
					name: 'expiryDate',
					type: 'date',
					defaultValue: '',
					validation: z.string()
				}
			] as const,
			actions: [
				{
					label: 'Create',
					key: 'create',
					class: 'btn-primary',
					buttonType: 'submit',
					callback: ({ fieldValues, closeDrawer }) => {
						const rfidTagId = parseInt(fieldValues.rfidTagId);
						const chargerId = parseInt(fieldValues.chargerId);

						// Check if this combination already exists (uses derived)
						if (existingCombinations.has(`${rfidTagId}-${chargerId}`)) {
							toast.error('This RFID tag is already authorized for this charger.');
							return;
						}

						$mutationChargeAuthorizationCreate.mutate(
							{
								rfidTagId,
								chargerId,
								expiryDate: fieldValues.expiryDate ? new Date(fieldValues.expiryDate) : null
							},
							{ onSuccess: closeDrawer }
						);
					}
				}
			]
		});
	};
</script>

<BasePage title="Charge Authorizations">
	{#snippet actions()}
		<button class="btn btn-primary btn-sm gap-2" onclick={openCreateDrawer}>
			<Plus class="h-4 w-4" />
			Add Authorization
		</button>
	{/snippet}
	<div class="container mx-auto">
		{#if $queryChargeAuthorizations.isPending || $queryChargers.isPending || $queryRfidTags.isPending}
			<div class="flex flex-col items-center justify-center py-32">
				<span class="loading loading-spinner loading-lg text-primary mb-4"></span>
				<p class="text-sm opacity-60">Loading authorizations...</p>
			</div>
		{:else if groupedByTag.length > 0}
			<Scrollable class="p-4" maxHeight="80svh">
				<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
					{#each groupedByTag as { rfidTag, authorizations, availableCount } (`${rfidTag.id}-${authorizations.map((a) => a.id).join('-')}`)}
						<div class="card bg-base-100 border-base-300 overflow-hidden border shadow-sm">
							<!-- Card Header -->
							<div class="bg-base-200 px-5 py-4">
								<div class="mb-3 flex items-center gap-2 opacity-60">
									<CreditCard class="h-4 w-4" />
									<span class="text-xs font-medium uppercase tracking-wide">RFID Access Tag</span>
								</div>

								<!-- Card Number -->
								<div class="mb-3">
									<p class="font-mono text-lg font-semibold tracking-wide">{rfidTag.rfidTag}</p>
								</div>

								<!-- Name -->
								<div class="mb-4">
									<p class="text-base font-medium">{rfidTag.friendlyName}</p>
								</div>

								<!-- Add Button -->
								<button
									class="btn btn-ghost btn-sm w-full gap-2"
									onclick={() => addChargerAccess(rfidTag)}
									disabled={availableCount === 0}
								>
									<Plus class="h-4 w-4" />
									{#if availableCount === 0}
										All Chargers Assigned
									{:else}
										Add Charger Access
										<span class="badge badge-sm">{availableCount}/{totalChargers}</span>
									{/if}
								</button>
							</div>

							<!-- Authorized Chargers List -->
							<div class="divide-base-300 bg-base-100 divide-y">
								{#each authorizations as auth}
									{@const expired = isExpired(auth.expiryDate)}
									<div class="hover:bg-base-200/50 group px-5 py-4 transition-colors {expired ? 'opacity-60' : ''}">
										<div class="flex items-center justify-between gap-4">
											<!-- Charger Info -->
											<div class="flex items-center gap-3">
												<div class="opacity-40">
													<Zap class="h-5 w-5" />
												</div>
												<div>
													<p class="mb-1 font-medium">{auth.charger.friendlyName}</p>
													<div class="flex flex-wrap items-center gap-2">
														<span class="badge badge-sm font-mono opacity-60"
															>{auth.charger.shortcode}</span
														>
														{#if auth.expiryDate}
															{#if expired}
																<span class="badge badge-error badge-sm gap-1">
																	<AlertTriangle class="h-3 w-3" />
																	Expired {format(new Date(auth.expiryDate), 'MMM d, yyyy')}
																</span>
															{:else}
																<span class="flex items-center gap-1 text-xs opacity-50">
																	<Calendar class="h-3 w-3" />
																	Expires {format(new Date(auth.expiryDate), 'MMM d, yyyy')}
																</span>
															{/if}
														{:else}
															<span class="flex items-center gap-1 text-xs">
																<CheckCircle class="text-success h-3 w-3" />
																<span class="opacity-50">Permanent</span>
															</span>
														{/if}
													</div>
												</div>
											</div>

											<!-- Actions -->
											<div class="flex gap-1">
												<button
													class="btn btn-ghost btn-xs btn-square"
													onclick={() => editExpiry(auth)}
													title="Edit expiry"
												>
													<PencilLine class="h-3.5 w-3.5" />
												</button>
												<button
													class="btn btn-ghost btn-xs btn-square text-error"
													onclick={() => confirmDelete(auth)}
													title="Remove access"
												>
													<Trash2 class="h-3.5 w-3.5" />
												</button>
											</div>
										</div>
									</div>
								{/each}
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
				<h3 class="mb-2 text-2xl font-bold">No Authorizations Found</h3>
				<p class="text-base-content/60 mb-6">RFID tags with charger access will appear here</p>
				<button
					class="btn btn-primary gap-2"
					onclick={() =>
						drawerStore.open({
							header: 'Create Authorization',
							fields: [
								{
									label: 'RFID Tag',
									name: 'rfidTagId',
									type: 'dropdown',
									options: $queryRfidTags.data?.data
										? $queryRfidTags.data.data.map((tag) => ({
												label: `${tag.friendlyName} (${tag.rfidTag})`,
												value: tag.id.toString()
											}))
										: [],
									validation: z.string().min(1)
								},
								{
									label: 'Charger',
									name: 'chargerId',
									type: 'dropdown',
									options: $queryChargers.data?.data
										? $queryChargers.data.data.map((charger) => ({
												label: `${charger.friendlyName} (${charger.vendor})`,
												value: charger.id.toString()
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
												rfidTagId: parseInt(fieldValues.rfidTagId),
												chargerId: parseInt(fieldValues.chargerId),
												expiryDate: null
											},
											{ onSuccess: closeDrawer }
										);
									}
								}
							]
						})}
				>
					<Plus class="h-4 w-4" />
					Add First Authorization
				</button>
			</div>
		{/if}
	</div>

	<!-- Delete Confirmation Modal -->
	<dialog bind:this={deleteModal} class="modal">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Remove Charger Access</h3>
			{#if authToDelete}
				<p class="py-4">
					Are you sure you want to remove <strong>{authToDelete.tagName}</strong>'s access to
					<strong>{authToDelete.chargerName}</strong>?
				</p>
				<div class="alert alert-info">
					<AlertTriangle class="h-5 w-5" />
					<div>
						<p class="font-semibold">This authorization will be deactivated</p>
						<p class="text-sm">The tag will no longer be able to start new charging sessions on this charger. Existing transactions and their history will be preserved.</p>
					</div>
				</div>
			{/if}
			<div class="modal-action">
				<button class="btn btn-outline" onclick={cancelDelete}>Cancel</button>
				<button
					class="btn btn-error"
					onclick={handleDelete}
					disabled={$mutationChargeAuthorizationDelete.isPending}
				>
					{#if $mutationChargeAuthorizationDelete.isPending}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					Remove Access
				</button>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button onclick={cancelDelete}>close</button>
		</form>
	</dialog>
</BasePage>
