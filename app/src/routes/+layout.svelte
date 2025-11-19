<script lang="ts">
	import '../app.css';
	import Logo from '$lib/media/Logo.svelte';
	import { page } from '$app/stores';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/queryClient';
	import LayoutObjectDrawer from '$lib/components/LayoutObjectDrawer.svelte';
	import { Toaster } from 'svelte-french-toast';
	import { Dialog } from '@ark-ui/svelte/dialog';
	import { Settings, FileText, Activity, ScrollText, Lock, Tag, Zap, Menu, X } from 'lucide-svelte';

	let { children } = $props();
	let time = $state(new Date());
	let mobileMenuOpen = $state(false);

	$effect(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});

	function isActiveRoute(href: string): boolean {
		return $page.url.pathname === href;
	}

	const navItems = [
		{ href: '/monitoring', label: 'Monitoring', icon: Activity },
		{ href: '/transactions', label: 'Transactions', icon: Zap },
		{ href: '/rfid-tags', label: 'RFID Tags', icon: Tag },
		{ href: '/authorization', label: 'Authorization', icon: Lock },
		{ href: '/invoices', label: 'Invoices', icon: FileText, badge: 'Soon' },
		{ href: '/administration', label: 'Administration', icon: Settings },
		{ href: '/logs', label: 'Logs', icon: ScrollText }
	];
</script>

<svelte:head>
	<title>OCPP Manager</title>
</svelte:head>

<Toaster position="bottom-right" />
<QueryClientProvider client={queryClient}>
	<div class="bg-base-100 flex h-screen flex-col overflow-hidden">
		<!-- Top Navigation Bar -->
		<header class="navbar bg-base-200 border-base-300 z-50 border-b px-4 shadow-sm">
			<div class="navbar-start">
				<Dialog.Root open={mobileMenuOpen} onOpenChange={(e) => (mobileMenuOpen = e.open)}>
					<!-- Mobile menu button -->
					<Dialog.Trigger class="btn btn-ghost btn-circle lg:hidden">
						<Menu class="size-6" />
					</Dialog.Trigger>

					<Dialog.Backdrop class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
					<Dialog.Positioner class="fixed inset-0 z-50 lg:hidden">
						<Dialog.Content
							class="bg-base-200 fixed left-0 top-0 flex h-full w-80 flex-col shadow-xl"
						>
							<div class="border-base-300 flex items-center justify-between border-b p-4">
								<div class="flex items-center gap-3">
									<Logo class="size-8" />
									<h1 class="text-xl font-bold">OCPP Manager</h1>
								</div>
								<Dialog.CloseTrigger class="btn btn-ghost btn-sm btn-circle">
									<X class="size-5" />
								</Dialog.CloseTrigger>
							</div>

							<nav class="flex-1 overflow-y-auto p-4">
								<ul class="menu gap-2">
									{#each navItems as item}
										<li>
											<a
												href={item.href}
												class:active={isActiveRoute(item.href)}
												class="flex items-center gap-3 text-base"
												onclick={() => (mobileMenuOpen = false)}
											>
												<svelte:component this={item.icon} class="size-5" />
												<span>{item.label}</span>
												{#if item.badge}
													<span class="badge badge-sm badge-outline ml-auto">{item.badge}</span>
												{/if}
											</a>
										</li>
									{/each}
								</ul>
							</nav>

							<div class="border-base-300 border-t p-4">
								<div class="text-center text-sm opacity-60">
									{time.toLocaleTimeString()}
								</div>
							</div>
						</Dialog.Content>
					</Dialog.Positioner>
				</Dialog.Root>

				<!-- Logo and Title -->
				<a href="/" class="flex items-center gap-3 px-2">
					<Logo class="size-8" />
					<h1 class="hidden text-xl font-bold sm:block">OCPP Manager</h1>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="navbar-center hidden lg:flex">
				<ul class="menu menu-horizontal gap-1">
					{#each navItems as item}
						<li>
							<a
								href={item.href}
								class:active={isActiveRoute(item.href)}
								class="flex items-center gap-2"
							>
								<svelte:component this={item.icon} class="size-4" />
								<span>{item.label}</span>
								{#if item.badge}
									<span class="badge badge-xs badge-outline">{item.badge}</span>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div class="navbar-end">
				<div class="hidden text-sm opacity-60 sm:block">
					{time.toLocaleTimeString()}
				</div>
			</div>
		</header>

		<!-- Main Content Area -->
		<main class="flex-1 overflow-auto">
			{@render children()}
		</main>
	</div>
	<LayoutObjectDrawer />
</QueryClientProvider>
