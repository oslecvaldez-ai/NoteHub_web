export interface DatabaseRow {
	[column: string]: unknown
}

export interface DatabaseRunResult {
	changes: number
	lastInsertRowid: number | bigint
}

export interface ElectronApi {
	db: {
		query<T extends DatabaseRow = DatabaseRow>(
			sql: string,
			params?: unknown[],
		): Promise<T[]>
		exec(sql: string, params?: unknown[]): Promise<DatabaseRunResult>
		getSetting(key: string): Promise<string | null>
		setSetting(key: string, value: string): Promise<string>
	}
	files: {
		copyImage(sourcePath: string): Promise<string>
	}
}

declare global {
	interface Window {
		electron?: ElectronApi
	}
}

const browserSettings = new Map<string, string>()

function getElectronApi(): ElectronApi | undefined {
	return typeof window !== 'undefined' ? window.electron : undefined
}

export const db = {
	query<T extends DatabaseRow = DatabaseRow>(
		sql: string,
		params: unknown[] = [],
	): Promise<T[]> {
		const api = getElectronApi()
		return api ? api.db.query<T>(sql, params) : Promise.resolve([])
	},
	exec(sql: string, params: unknown[] = []): Promise<DatabaseRunResult> {
		const api = getElectronApi()
		return api
			? api.db.exec(sql, params)
			: Promise.resolve({ changes: 0, lastInsertRowid: 0 })
	},
	getSetting(key: string): Promise<string | null> {
		const api = getElectronApi()
		return api
			? api.db.getSetting(key)
			: Promise.resolve(browserSettings.get(key) ?? null)
	},
	setSetting(key: string, value: string): Promise<string> {
		browserSettings.set(key, value)
		const api = getElectronApi()
		return api ? api.db.setSetting(key, value) : Promise.resolve(value)
	},
}

export const files = {
	copyImage(sourcePath: string): Promise<string> {
		const api = getElectronApi()
		return api ? api.files.copyImage(sourcePath) : Promise.resolve(sourcePath)
	},
}
