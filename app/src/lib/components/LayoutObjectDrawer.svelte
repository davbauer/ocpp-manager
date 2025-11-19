<script lang="ts">
	import {
		drawerStore,
		type Action,
		type DrawerState,
		type Field,
		type FieldValues
	} from '$lib/drawerStore';
	import { onMount } from 'svelte';
	import { z } from 'zod';

	let inputDrawerToggle: HTMLInputElement;
	let drawer = $state<DrawerState<readonly Field[]> | null>(null);
	let fieldValues = $state<Record<string, any>>({});
	let fieldErrors = $state<Record<string, string | undefined>>({});

	// Helper function for converting UTC to local datetime
	const convertUTCToLocal = (utcDateTime?: string | null): string | null | undefined => {
		if (!utcDateTime) return utcDateTime;
		if (!utcDateTime.endsWith('Z')) return utcDateTime;

		const utcDate = new Date(utcDateTime);
		const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
		return localDate.toISOString().slice(0, 16);
	};

	// Helper function for converting local datetime to UTC
	const convertLocalToUTC = (localDateTime?: string | null): string | null | undefined => {
		if (!localDateTime) return localDateTime;
		if (localDateTime.endsWith('Z')) return localDateTime;

		const localDate = new Date(localDateTime);
		const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
		return utcDate.toISOString();
	};

	const validateField = (field: Field, value: any): string | undefined => {
		if (!field.validation) return undefined;

		try {
			field.validation.parse(value);
			return undefined;
		} catch (error) {
			if (error instanceof z.ZodError) {
				return error.errors[0]?.message;
			}
			return 'Invalid value';
		}
	};

	const handleAction = (action: Action<any>) => {
		if (!drawer) return;

		fieldErrors = {};

		if (action.buttonType === 'submit') {
			let hasErrors = false;

			drawer.fields.forEach((field) => {
				const error = validateField(field, fieldValues[field.name]);
				if (error) {
					fieldErrors[field.name] = error;
					hasErrors = true;
				}
			});

			if (hasErrors) {
				return;
			}
		}

		action.callback({
			fieldValues: fieldValues as FieldValues<typeof drawer.fields>,
			closeDrawer: () => drawerStore.close()
		});
	};

	const initializeFieldValues = (state: DrawerState<readonly Field[]>) => {
		fieldValues = state.fields.reduce(
			(acc, field) => {
				let value: any;

				if (field.defaultValue !== undefined) {
					if (field.type === 'date') {
						value = convertUTCToLocal(field.defaultValue);
					} else {
						value = field.defaultValue;
					}
				} else if (field.type === 'checkbox') {
					value = false;
				} else if (field.type === 'dropdown') {
					value = field.options[0]?.value || '';
				} else if (field.type === 'number') {
					value = 0;
				} else {
					value = '';
				}

				acc[field.name] = value;
				return acc;
			},
			{} as Record<string, any>
		);

		state.fields.forEach((field) => {
			const value = fieldValues[field.name];
			handleFieldChange(field, value);
		});
	};

	onMount(() => {
		const unsubscribe = drawerStore.subscribe((state) => {
			const lastDrawerStateOpen = inputDrawerToggle.checked;
			drawer = state;
			if (drawer && !lastDrawerStateOpen) {
				initializeFieldValues(drawer);
				fieldErrors = {};
			}
			inputDrawerToggle.checked = !!drawer;
		});

		return () => {
			unsubscribe();
		};
	});

	const handleFieldChange = (field: Field, value: any) => {
		if (!field.onChange) return;

		switch (field.type) {
			case 'number':
				return field.onChange(value as number);
			case 'text':
				return field.onChange(value as string);
			case 'checkbox':
				return field.onChange(value as boolean);
			case 'dropdown':
				return field.onChange(value as string);
			case 'date':
				if (typeof value === 'string') {
					return field.onChange(convertLocalToUTC(value) || null);
				}
				return;
		}
	};
</script>

<div class="drawer drawer-end">
	<input id="object-drawer" bind:this={inputDrawerToggle} type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<label for="object-drawer" class="drawer-overlay"></label>
		{#if drawer}
			<form
				class="menu bg-base-200 text-base-content min-h-full w-80 p-0 md:w-96"
				onsubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					const submitAction = drawer?.actions.find((a) => a.buttonType === 'submit');
					if (submitAction) handleAction(submitAction);
				}}
			>
				<div class="flex h-full flex-col">
					<!-- Header with shadow for visual separation -->
					<div class="bg-base-100 p-4 shadow-md">
						<h2 class="text-xl font-semibold">{drawer.header}</h2>
					</div>

					<!-- Scrollable content area -->
					<div class="flex-grow overflow-y-auto p-6">
						<div class="space-y-6">
							{#each drawer.fields as field, index}
								<div class="form-control w-full">
									<!-- Label with consistent spacing -->
									<label for={`field-${index}`} class="label">
										<span class="label-text font-medium">{field.label}</span>
									</label>

									<!-- Input fields with consistent styling -->
									{#if field.type === 'text' || field.type === 'number'}
										<input
											id={`field-${index}`}
											type={field.type}
											class="input input-bordered h-10 w-full {field.class || ''} {fieldErrors[
												field.name
											]
												? 'input-error'
												: ''}"
											placeholder={field.placeholder || ''}
											bind:value={fieldValues[field.name]}
											oninput={() => {
												handleFieldChange(field, fieldValues[field.name]);
												const error = validateField(field, fieldValues[field.name]);
												fieldErrors[field.name] = error;
											}}
										/>
									{:else if field.type === 'checkbox'}
										<div class="flex h-10 items-center pl-2">
											<input
												id={`field-${index}`}
												type="checkbox"
												class="checkbox {field.class || ''} {fieldErrors[field.name]
													? 'checkbox-error'
													: ''}"
												bind:checked={fieldValues[field.name]}
												onchange={() => {
													handleFieldChange(field, fieldValues[field.name]);
													const error = validateField(field, fieldValues[field.name]);
													fieldErrors[field.name] = error;
												}}
											/>
										</div>
									{:else if field.type === 'dropdown'}
										<select
											id={`field-${index}`}
											class="select select-bordered h-10 w-full {field.class || ''} {fieldErrors[
												field.name
											]
												? 'select-error'
												: ''}"
											bind:value={fieldValues[field.name]}
											onchange={() => {
												handleFieldChange(field, fieldValues[field.name]);
												const error = validateField(field, fieldValues[field.name]);
												fieldErrors[field.name] = error;
											}}
										>
											{#each field.options as option}
												<option value={option.value}>{option.label}</option>
											{/each}
										</select>
									{:else if field.type === 'date'}
										<input
											id={`field-${index}`}
											type="datetime-local"
											class="input input-bordered h-10 w-full {field.class || ''} {fieldErrors[
												field.name
											]
												? 'input-error'
												: ''}"
											bind:value={fieldValues[field.name]}
											onchange={() => {
												handleFieldChange(field, fieldValues[field.name]);
												const error = validateField(field, fieldValues[field.name]);
												fieldErrors[field.name] = error;
											}}
										/>
									{/if}

									<!-- Error messages with consistent style -->
									{#if fieldErrors[field.name]}
										<div class="label pt-1" role="alert" aria-live="polite">
											<span class="label-text-alt text-error">{fieldErrors[field.name]}</span>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>

					<!-- Footer with action buttons -->
					<div class="bg-base-100 border-base-300 border-t p-4 shadow-inner">
						<div class="flex justify-end gap-3">
							{#each drawer.actions as action}
								<button
									type={action.buttonType}
									class="btn {action.buttonType === 'submit'
										? 'btn-primary'
										: 'btn-outline'} {action.class || ''}"
									onclick={() => {
										if (action.buttonType !== 'submit') handleAction(action);
									}}
								>
									{action.label}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</form>
		{/if}
	</div>
</div>
