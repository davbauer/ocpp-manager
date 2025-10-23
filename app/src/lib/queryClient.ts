import { createMutation, createQuery, QueryClient } from '@tanstack/svelte-query';
import { hClient } from './hClient';
import toast from 'svelte-french-toast';

export const queryClient = new QueryClient();

export const queryKeys = {
	charger: ['charger'],
	log: ['log'],
	setting: ['setting'],
	connectorByidDetail: (connectorId: string) => ['connector-detail', connectorId],
	rfidTagDetail: ['rfid-tag-detail'],
	chargeAuthorization: ['charge-authorization'],
	chargeAuthorizationDetail: ['charge-authorization-detail'],
	transactionDetail: ['transaction-detail'],
	transactionByChargerDetail: (chargerId: number) => ['transaction-detail', 'charger', chargerId],
	transactionByConnectorDetail: (connectorId: number) => [
		'transaction-detail',
		'connector',
		connectorId
	],
	transactionByIdDetail: (id: number) => ['transaction-detail', 'id', id]
};

export const createQueryRfidTagDetail = (refetchInterval?: number) =>
	createQuery({
		refetchInterval,
		queryKey: queryKeys.rfidTagDetail,
		queryFn: () => hClient['rfid-tag'].detail.$get({query: {}}).then((x) => x.json())
	});

export const createMutationRfidTagDelete = () =>
	createMutation({
		throwOnError: true,
		mutationFn: ({ id }: { id: number }) =>
			toast.promise(
				hClient['rfid-tag'][':id']
					.$delete({
						param: { id: id.toString() }
					})
					.then((x) => x.json()),
				{
					loading: 'Deleting...',
					success: 'RFID Tag deleted',
					error: 'Error deleting RFID Tag'
				}
			),

		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: queryKeys.rfidTagDetail
			});
		}
	});

export const createMutationRfidTagCreate = () =>
	createMutation({
		throwOnError: true,
		mutationFn: ({ friendlyName, rfidTag }: { friendlyName: string; rfidTag: string }) =>
			toast.promise(
				hClient['rfid-tag']
					.$post({
						json: {
							friendlyName,
							rfidTag
						}
					})
					.then((x) => x.json()),
				{
					loading: 'Creating...',
					success: 'RFID Tag created',
					error: 'Error creating RFID Tag'
				}
			),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: queryKeys.rfidTagDetail
			});
		}
	});

export const createMutationRfidTagUpdate = () =>
	createMutation({
		throwOnError: true,
		mutationFn: ({
			id,
			friendlyName,
			rfidTag
		}: {
			id: number;
			friendlyName: string;
			rfidTag: string;
		}) =>
			toast.promise(
				hClient['rfid-tag'][':id']
					.$patch({
						param: { id: id.toString() },
						json: {
							friendlyName,
							rfidTag
						}
					})
					.then((x) => x.json()),
				{
					loading: 'Updating...',
					success: 'RFID Tag updated',
					error: 'Error updating RFID Tag'
				}
			),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: queryKeys.rfidTagDetail
			});
		}
	});

export const createQueryCharger = (refetchInterval?: number) =>
	createQuery({
		refetchInterval,
		queryKey: queryKeys.charger,
		queryFn: () => hClient.charger.$get({ query: {} }).then((x) => x.json())
	});

export const createQueryConnector = (chargerId: string, refetchInterval?: number) =>
	createQuery({
		refetchInterval,
		queryKey: queryKeys.connectorByidDetail(chargerId),
		queryFn: async () => {
			const response = await hClient.connector.charger[':id'].detail
				.$get({
					param: {
						id: chargerId
					}
				});
			return response.json() as Promise<any>;
		}
	});

export const createMutationConnectorUnlock = () =>
	createMutation({
		throwOnError: true,
		mutationFn: ({ id }: { id: string }) =>
			toast.promise(
				hClient.connector[':id']['unlock-connector']
					.$post({
						param: { id }
					})
					.then((x) => x.json()),
				{
					loading: 'Unlocking connector...',
					success: 'Connector unlocked',
					error: 'Error unlocking connector'
				}
			),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: queryKeys.charger
			});
		}
	});

export const createMutationChargerUpdate = () =>
	createMutation({
		throwOnError: true,
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
			toast.promise(
				hClient.charger[':id']
					.$patch({
						param: { id },
						json: { status, shortcode, friendlyName }
					})
					.then((x) => x.json()),
				{
					loading: 'Updating charger...',
					success: 'Charger updated',
					error: 'Error updating charger'
				}
			),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: queryKeys.charger
			});
		}
	});

export const createMutationChargerDelete = () =>
	createMutation({
		throwOnError: true,
		mutationFn: ({ id }: { id: string }) =>
			toast.promise(
				hClient.charger[':id']
					.$delete({
						param: { id }
					})
					.then((x) => x.json()),
				{
					loading: 'Deleting charger...',
					success: 'Charger deleted',
					error: 'Error deleting charger'
				}
			),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: queryKeys.charger
			});
		}
	});

export const createMutationChargerCreate = () =>
	createMutation({
		throwOnError: true,
		mutationFn: ({ friendlyName, shortcode }: { friendlyName: string; shortcode: string }) =>
			toast.promise(
				hClient.charger
					.$post({
						json: { friendlyName, shortcode }
					})
					.then((x) => x.json()),
				{
					loading: 'Creating charger...',
					success: 'Charger created',
					error: 'Error creating charger'
				}
			),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: queryKeys.charger
			});
		}
	});

export const createQueryLog = (refetchInterval: number, maxLines: number) =>
	createQuery({
		queryKey: [...queryKeys.log, maxLines],
		refetchInterval,
		queryFn: ({ queryKey }) => {
			const [, maxLines] = queryKey;
			return hClient.log.stream
				.$get({
					query: {
						maxLines: maxLines.toString()
					}
				})
				.then((x) => x.text())
				.then((x) => x.split('\n'));
		}
	});

export const createQuerySetting = () =>
	createQuery({
		queryKey: queryKeys.setting,
		queryFn: () => hClient.setting.$get().then((x) => x.json())
	});

export const createMutationSetting = () =>
	createMutation({
		throwOnError: true,
		mutationFn: ({
			heartbeatInterval,
			systemMaintenance,
			clockAlignedDataInterval,
			meterValueSampleInterval
		}: {
			heartbeatInterval?: number;
			systemMaintenance?: boolean;
			clockAlignedDataInterval?: number;
			meterValueSampleInterval?: number;
		}) =>
			toast.promise(
				hClient.setting
					.$patch({
						json: {
							heartbeatInterval,
							systemMaintenance,
							clockAlignedDataInterval,
							meterValueSampleInterval
						}
					})
					.then((x) => x.json()),
				{
					loading: 'Updating settings...',
					success: 'Settings updated',
					error: 'Error updating settings'
				}
			),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: queryKeys.charger
			});
		}
	});

export const createQueryChargeAuthorizationDetail = (refetchInterval?: number) =>
	createQuery({
		refetchInterval,
		queryKey: queryKeys.chargeAuthorizationDetail,
		queryFn: () => hClient['charge-authorization'].detail.$get({query: {}}).then((x) => x.json())
	});

export const createMutationChargeAuthorizationCreate = () =>
	createMutation({
		throwOnError: true,
		mutationFn: ({
			chargerId,
			expiryDate,
			rfidTagId
		}: {
			chargerId: number;
			expiryDate: Date | null;
			rfidTagId: number | null;
		}) =>
			toast.promise(
				hClient['charge-authorization']
					.$post({
						json: {
							chargerId,
							expiryDate,
							rfidTagId
						}
					})
					.then((x) => x.json()),
				{
					loading: 'Creating authorization...',
					success: 'Charge authorization created',
					error: 'Error creating charge authorization'
				}
			),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: queryKeys.chargeAuthorizationDetail
			});
		}
	});

export const createMutationChargeAuthorizationUpdate = () =>
	createMutation({
		throwOnError: true,
		mutationFn: ({
			id,
			chargerId,
			expiryDate,
			rfidTagId
		}: {
			id: number;
			chargerId: number;
			expiryDate: Date | null;
			rfidTagId: number | null;
		}) =>
			toast.promise(
				hClient['charge-authorization'][':id']
					.$patch({
						param: { id: id.toString() },
						json: {
							chargerId,
							expiryDate,
							rfidTagId
						}
					})
					.then((x) => x.json()),
				{
					loading: 'Updating authorization...',
					success: 'Charge authorization updated',
					error: 'Error updating charge authorization'
				}
			),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['charge-authorization']
			});
		}
	});

export const createMutationChargeAuthorizationDelete = () =>
	createMutation({
		throwOnError: true,
		mutationFn: ({ id }: { id: number }) =>
			toast.promise(
				hClient['charge-authorization'][':id']
					.$delete({
						param: { id: id.toString() }
					})
					.then((x) => x.json()),
				{
					loading: 'Deleting authorization...',
					success: 'Charge authorization deleted',
					error: 'Error deleting charge authorization'
				}
			),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['charge-authorization']
			});
		}
	});

export const createQueryTransactionsDetail = (refetchInterval?: number) =>
	createQuery({
		refetchInterval,
		queryKey: queryKeys.transactionDetail,
		queryFn: () => hClient.transaction.detail.$get({query: {}}).then((x) => x.json())
	});

export const createQueryTransactionByIdDetail = (id: number, refetchInterval?: number) =>
	createQuery({
		refetchInterval,
		queryKey: queryKeys.transactionByIdDetail(id),
		queryFn: () =>
			hClient.transaction[':id'].detail
				.$get({
					param: { id: id.toString() }
				})
				.then((x) => x.json())
	});

export const createQueryTransactionsByChargerDetail = (
	chargerId: number,
	refetchInterval?: number
) =>
	createQuery({
		refetchInterval,
		queryKey: queryKeys.transactionByChargerDetail(chargerId),
		queryFn: () =>
			hClient.transaction.charger[':chargerId'].detail
				.$get({
					param: { chargerId: chargerId.toString() }
				})
				.then((x) => x.json())
	});

export const createQueryTransactionsByConnectorDetail = (
	connectorId: number,
	refetchInterval?: number
) =>
	createQuery({
		refetchInterval,
		queryKey: queryKeys.transactionByConnectorDetail(connectorId),
		queryFn: () =>
			hClient.transaction.connector[':connectorId'].detail
				.$get({
					param: { connectorId: connectorId.toString() }
				})
				.then((x) => x.json())
	});

export const createMutationTransactionDelete = () =>
	createMutation({
		throwOnError: true,
		mutationFn: ({ id }: { id: number }) =>
			toast.promise(
				hClient.transaction[':id']
					.$delete({
						param: { id: id.toString() }
					})
					.then((x) => x.json()),
				{
					loading: 'Deleting transaction...',
					success: 'Transaction deleted',
					error: 'Error deleting transaction'
				}
			),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: queryKeys.transactionDetail
			});
		}
	});

export const createMutationChargerReset = () =>
	createMutation({
		throwOnError: true,
		mutationFn: ({ id, type }: { id: number; type: 'Hard' | 'Soft' }) =>
			toast.promise(
				hClient['charger'][':id']['reset']
					.$post({
						param: { id: id.toString() },
						json: { type }
					})
					.then((x) => x.json()),
				{
					loading: `Performing ${type.toLowerCase()} reset...`,
					success: `${type} reset completed`,
					error: `Error performing ${type.toLowerCase()} reset`
				}
			)
	});
