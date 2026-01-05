<script lang="ts">
	import BasePage from '$lib/components/BasePage.svelte';
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
						class="mb-2 flex w-fit flex-col gap-1 text-sm font-medium"
					>
						<span>Heartbeat Interval (seconds)</span>
						<span class="text-xs font-normal opacity-60">
							How often the charger sends a "still alive" signal. Recommended: 300s (5 min). Lower
							values detect offline chargers faster but increase network traffic.
						</span>
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
						class="mb-2 flex w-fit flex-col gap-1 text-sm font-medium"
					>
						<span>Meter Value Sample Interval (seconds)</span>
						<span class="text-xs font-normal opacity-60">
							How often the charger sends energy/power readings during charging. Recommended: 60s.
							Lower values give more detailed graphs but increase database size.
						</span>
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
						class="mb-2 flex w-fit flex-col gap-1 text-sm font-medium"
					>
						<span>Clock Aligned Data Interval (seconds)</span>
						<span class="text-xs font-normal opacity-60">
							Sends meter values at fixed clock times (e.g., every 15 min at :00, :15, :30, :45).
							Useful for billing reports. Set to 0 to disable. Recommended: 0 or 900 (15 min).
						</span>
					</label>

					<input
						id="clockAlignedDataInterval"
						type="number"
						class="input input-bordered w-full"
						bind:value={clockAlignedDataInterval}
						placeholder="0"
						min="0"
						max="99999"
						required
						disabled={$mutationSettings.isPending}
					/>
				</div>

				<button
					type="submit"
					class="btn btn-primary btn-sm w-full"
					disabled={$mutationSettings.isPending}
				>
					{#if $mutationSettings.isPending}
						<span class="loading loading-spinner"></span>
					{/if} Save
				</button>
			</form>
		{/if}
	</div>
</BasePage>
