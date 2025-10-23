<script lang="ts">
	import BasePage from '$lib/components/BasePage.svelte';
	import IconInfoCircle from '$lib/icons/tabler/IconInfoCircle.svelte';
	import { createMutationSetting, createQuerySetting } from '$lib/queryClient';
	const querySettings = createQuerySetting();
	const mutationSettings = createMutationSetting();

	let heartbeatInterval = $state(0);
	let meterValueSampleInterval = $state(0);
	let clockAlignedDataInterval = $state(0);

	$effect(() => {
		if ($querySettings.data?.data) {
			heartbeatInterval = $querySettings.data.data.heartbeatInterval;
			meterValueSampleInterval = $querySettings.data.data.meterValueSampleInterval;
			clockAlignedDataInterval = $querySettings.data.data.clockAlignedDataInterval;
		}
	});

	function updateSettings() {
		$mutationSettings.mutate({
			heartbeatInterval,
			meterValueSampleInterval,
			clockAlignedDataInterval
		});
	}
</script>

<BasePage title="Administration">
	<div class="max-w-xl p-4">
		{#if $querySettings.isPending}
			<p class="text-center">Loading settings...</p>
		{:else}
			<form
				class="space-y-6"
				onsubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					updateSettings();
				}}
			>
				<div class="form-control">
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label
						for="heartbeatInterval"
						data-tip="Sets how often (in seconds) the charge point sends a heartbeat to the server."
						class="tooltip mb-2 flex w-fit items-center gap-x-2 text-sm font-medium"
					>
						Heartbeat Interval (seconds) <IconInfoCircle class="size-4" />
					</label>
					<input
						id="heartbeatInterval"
						type="number"
						class="input input-bordered w-full"
						bind:value={heartbeatInterval}
						placeholder="300"
						min="10"
						max="99999"
						required
						disabled={$mutationSettings.isPending}
					/>
				</div>

				<div class="form-control">
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label
						for="meterValueSampleInterval"
						data-tip="Defines how often (in seconds) the charge point sends meter updates during charging."
						class="tooltip mb-2 flex w-fit items-center gap-x-2 text-sm font-medium"
					>
						Meter Value Sample Interval (seconds) <IconInfoCircle class="size-4" />
					</label>

					<input
						id="meterValueSampleInterval"
						type="number"
						class="input input-bordered w-full"
						bind:value={meterValueSampleInterval}
						placeholder="60"
						min="10"
						max="99999"
						required
						disabled={$mutationSettings.isPending}
					/>
				</div>

				<div class="form-control">
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label
						for="clockAlignedDataInterval"
						data-tip="Defines how often (in seconds) the charge point sends periodic updates, apart from its status."
						class="tooltip mb-2 flex w-fit items-center gap-x-2 text-sm font-medium"
					>
						Clock Aligned Data Interval (seconds) <IconInfoCircle class="size-4" />
					</label>

					<input
						id="clockAlignedDataInterval"
						type="number"
						class="input input-bordered w-full"
						bind:value={clockAlignedDataInterval}
						placeholder="60"
						min="10"
						max="99999"
						required
						disabled={$mutationSettings.isPending}
					/>
				</div>

				<button type="submit" class="btn btn-primary w-full" disabled={$mutationSettings.isPending}>
					{#if $mutationSettings.isPending}
						<span class="loading loading-spinner"></span>
					{/if} Update Settings
				</button>
			</form>
		{/if}
	</div>
</BasePage>
