import { createMutation, createQuery, QueryClient } from '@tanstack/svelte-query';
import { hClient } from './hClient';

export const queryClient = new QueryClient();

export const queryKeys = {
	chargers: ['chargers'],
	logs: ['logs'],
	settings: ['settings'],
	connectors: (key: string) => ['connectors', key]
};

export const createQueryChargers = () =>
	createQuery({
		queryKey: queryKeys.chargers,
		queryFn: () => hClient.chargers.$get().then((x) => x.json())
	});

export const createQueryConnectorsOfCharger = (chargerId: string) =>
	createQuery({
		queryKey: queryKeys.connectors(chargerId),
		queryFn: () =>
			hClient.connectors.charger[':id']
				.$get({
					param: {
						id: chargerId
					}
				})
				.then((x) => x.json())
	});

export const createMutationChargerUpdate = () =>
	createMutation({
		mutationFn: ({
			id,
			friendlyName,
			status,
			shortcode
		}: {
			id: string;
			friendlyName: string;
			status: 'Accepted' | 'Rejected' | 'Pending';
			shortcode: string;
		}) =>
			hClient.chargers[':id']
				.$patch({
					param: { id },
					json: { status, shortcode, friendlyName }
				})
				.then((x) => x.json()),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: queryKeys.chargers
			});
		}
	});

export const createMutationChargerDelete = () =>
	createMutation({
		mutationFn: ({ id }: { id: string }) =>
			hClient.chargers[':id']
				.$delete({
					param: { id }
				})
				.then((x) => x.json()),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: queryKeys.chargers
			});
		}
	});

export const createMutationChargerCreate = () =>
	createMutation({
		mutationFn: ({ friendlyName, shortcode }: { friendlyName: string; shortcode: string }) =>
			hClient.chargers
				.$post({
					json: { friendlyName, shortcode }
				})
				.then((x) => x.json()),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: queryKeys.chargers
			});
		}
	});

export const createQueryLogs = (refetchInterval: number, maxLines: number) =>
	createQuery({
		queryKey: [...queryKeys.logs, maxLines],
		refetchInterval,
		queryFn: ({ queryKey }) => {
			const [, maxLines] = queryKey;
			return hClient.logs.stream
				.$get({
					query: {
						maxLines: maxLines.toString()
					}
				})
				.then((x) => x.text())
				.then((x) => x.split('\n'));
		}
	});

export const createQuerySettings = () =>
	createQuery({
		queryKey: queryKeys.settings,
		queryFn: () => hClient.settings.$get().then((x) => x.json())
	});

export const createMutationSettings = () =>
	createMutation({
		mutationFn: ({
			heartbeatInterval,
			systemMaintenance
		}: {
			heartbeatInterval?: number;
			systemMaintenance?: boolean;
		}) =>
			hClient.settings
				.$patch({
					json: { heartbeatInterval, systemMaintenance }
				})
				.then((x) => x.json()),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: queryKeys.chargers
			});
		}
	});
