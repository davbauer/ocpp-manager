<script lang="ts">
	import '../app.css';
	import IconAdjustments from '$lib/icons/tabler/IconAdjustments.svelte';
	import IconInvoice from '$lib/icons/tabler/IconInvoice.svelte';
	import IconUniverse from '$lib/icons/tabler/IconUniverse.svelte';
	import Logo from '$lib/media/Logo.svelte';
	import IconChevronLeft from '$lib/icons/tabler/IconChevronLeft.svelte';
	import IconChevronRight from '$lib/icons/tabler/IconChevronRight.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import IconLogs from '$lib/icons/tabler/IconLogs.svelte';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/queryClient';
	import IconLockPin from '$lib/icons/tabler/IconLockPin.svelte';
	import LayoutObjectDrawer from '$lib/components/LayoutObjectDrawer.svelte';
	import IconDeviceAirtag from '$lib/icons/tabler/IconDeviceAirtag.svelte';
	import IconBolt from '$lib/icons/tabler/IconBolt.svelte';
	import { Toaster } from 'svelte-french-toast';

	let { children } = $props();
	let time = $state(new Date());
	let isSidebarMinimized = $state(false);
	let loaded = $state(false);
	let isScrolled = $state(false);
	const isSidebarMinimizedLocalStorageKey = 'isSidebarMinimized';

	$effect(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});

	onMount(() => {
		const savedState = localStorage.getItem(isSidebarMinimizedLocalStorageKey);
		if (savedState !== null) {
			isSidebarMinimized = JSON.parse(savedState);
		}
		loaded = true;
	});

	$effect(() => {
		localStorage.setItem(isSidebarMinimizedLocalStorageKey, JSON.stringify(isSidebarMinimized));
	});

	function isActiveRoute(href: string): boolean {
		return $page.url.pathname === href;
	}

	function toggleSidebar() {
		isSidebarMinimized = !isSidebarMinimized;
	}

	function handleScroll(e: Event) {
		const target = e.target as HTMLElement;
		isScrolled = target.scrollTop > 10;
	}
</script>

<svelte:head>
	<title>OCPP Manager</title>
</svelte:head>

<Toaster position="bottom-right" />
<QueryClientProvider client={queryClient}>
	<div class="bg-base-100 flex h-screen overflow-hidden">
		<!-- Sidebar -->
		{#if loaded}
			<aside
				class={`${
					isSidebarMinimized ? 'w-24' : 'w-72'
				} bg-base-200 text-base-content transition-width relative flex shrink-0 flex-col duration-300`}
			>
				<div class="flex h-full flex-col overflow-hidden p-4">
					<div class="relative mb-4">
						<button
							onclick={toggleSidebar}
							class="bg-base-200 border-base-content absolute -right-7 top-2 z-50 flex items-center justify-center rounded-full border-2 p-1 shadow-lg"
						>
							{#if isSidebarMinimized}
								<IconChevronRight class="text-base-content size-6" />
							{:else}
								<IconChevronLeft class="text-base-content size-6" />
							{/if}
						</button>
					</div>

					<ul class="menu flex flex-col space-y-4">
						<li class="mb-10">
							<a
								href="/"
								class:btn-active={isActiveRoute('/')}
								class:justify-center={isSidebarMinimized}
								class="item flex items-center text-lg font-bold"
							>
								<Logo class="size-6" />

								<p class:hidden={isSidebarMinimized} class="ml-4 text-nowrap">OCPP Manager</p>
							</a>
						</li>
						<li>
							<a
								href="/monitoring"
								class:btn-active={isActiveRoute('/monitoring')}
								class:justify-center={isSidebarMinimized}
								class="item flex items-center text-lg font-bold"
							>
								<IconUniverse class=" size-6" />

								<p class:hidden={isSidebarMinimized} class="ml-4 text-nowrap">Monitoring</p>
							</a>
						</li>
						<li>
							<a
								href="/transactions"
								class:btn-active={isActiveRoute('/transactions')}
								class:justify-center={isSidebarMinimized}
								class="item flex items-center text-lg font-bold"
							>
								<IconBolt class=" size-6" />

								<p class:hidden={isSidebarMinimized} class="ml-4 text-nowrap">Transactions</p>
							</a>
						</li>
						<li>
							<a
								href="/rfid-tags"
								class:btn-active={isActiveRoute('/rfid-tags')}
								class:justify-center={isSidebarMinimized}
								class="item flex items-center text-lg font-bold"
							>
								<IconDeviceAirtag class=" size-6" />

								<p class:hidden={isSidebarMinimized} class="ml-4 text-nowrap">RFID Tags</p>
							</a>
						</li>
						<li>
							<a
								href="/authorization"
								class:btn-active={isActiveRoute('/authorization')}
								class:justify-center={isSidebarMinimized}
								class="item flex items-center text-lg font-bold"
							>
								<IconLockPin class=" size-6" />

								<p class:hidden={isSidebarMinimized} class="ml-4 text-nowrap">Authorization</p>
							</a>
						</li>
						<li>
							<a
								href="/invoices"
								class:btn-active={isActiveRoute('/invoices')}
								class:justify-center={isSidebarMinimized}
								class="item indicator flex w-full items-center text-lg font-bold"
							>
								<IconInvoice class="size-6" />

								<span
									class:hidden={isSidebarMinimized}
									class="indicator-item badge badge-outline right-10 mt-2 opacity-45"
									>Coming Soon</span
								>
								<p class:hidden={isSidebarMinimized} class="ml-4 text-nowrap">Invoices</p>
							</a>
						</li>
						<li>
							<a
								href="/administration"
								class:btn-active={isActiveRoute('/administration')}
								class:justify-center={isSidebarMinimized}
								class="item flex items-center text-lg font-bold"
							>
								<IconAdjustments class="size-6" />
								<p class:hidden={isSidebarMinimized} class="ml-4 text-nowrap">Administration</p>
							</a>
						</li>
						<li>
							<a
								href="/logs"
								class:btn-active={isActiveRoute('/logs')}
								class:justify-center={isSidebarMinimized}
								class="item flex items-center text-lg font-bold"
							>
								<IconLogs class="size-6" />
								<p class:hidden={isSidebarMinimized} class="ml-4 text-nowrap">Logs</p>
							</a>
						</li>
					</ul>
				</div>
			</aside>

			<!-- Main Content -->
			<div class="flex flex-1 flex-col overflow-hidden">
				<main 
					class="bg-base-100 flex-1 overflow-auto p-8 transition-shadow duration-300"
					class:shadow-inner={isScrolled}
					onscroll={handleScroll}
				>
					{@render children()}
				</main>

				<footer class="bg-base-200 p-4 text-center text-sm">
					<p>{time.toLocaleTimeString()}</p>
				</footer>
			</div>
		{/if}
	</div>
	<LayoutObjectDrawer />
</QueryClientProvider>
