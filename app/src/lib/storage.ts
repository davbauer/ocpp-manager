const STORAGE_PREFIX = 'ocpp_manager_' as const;

export const StorageKeys = {
	CSV_NUMBER_FORMAT: 'csv_number_format',
	CSV_COLUMNS: 'csv_columns'
} as const;

type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

export const storage = {
	save<T>(key: StorageKey, value: T): void {
		try {
			localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
		} catch (e) {
			console.error('Failed to save to localStorage:', e);
		}
	},

	retrieve<T>(key: StorageKey, defaultValue: T): T {
		try {
			const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
			return item ? JSON.parse(item) : defaultValue;
		} catch (e) {
			console.error('Failed to retrieve from localStorage:', e);
			return defaultValue;
		}
	},

	remove(key: StorageKey): void {
		try {
			localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
		} catch (e) {
			console.error('Failed to remove from localStorage:', e);
		}
	}
};
