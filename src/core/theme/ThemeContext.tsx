import {
	type PropsWithChildren,
	type ReactElement,
	useEffect,
	useState,
} from 'react'
import { db } from '../ipc'
import { ThemeContext, type ThemeMode } from './context'

const DEFAULT_MODE: ThemeMode = 'light'
const DEFAULT_ACCENT = '#8B5CF6'

function normalizeMode(value: string | null): ThemeMode {
	return value === 'dark' ? 'dark' : DEFAULT_MODE
}

function applyTheme(mode: ThemeMode, accentColor: string): void {
	const root = document.documentElement
	root.classList.toggle('dark', mode === 'dark')
	root.dataset.theme = mode
	root.style.setProperty('--color-primary', accentColor)
	root.style.setProperty('--bg-app', mode === 'dark' ? '#121212' : '#FFFFFF')
	root.style.setProperty('--bg-card', mode === 'dark' ? '#1E1E1E' : '#F4F5F7')
	root.style.setProperty('--text-primary', mode === 'dark' ? '#FFFFFF' : '#1C1C1E')
	root.style.setProperty('--text-secondary', mode === 'dark' ? '#B0B3B8' : '#8E8E93')
}

export function ThemeProvider({ children }: PropsWithChildren): ReactElement {
	const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE)
	const [accentColor, setAccentColorState] = useState(DEFAULT_ACCENT)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let active = true

		async function loadTheme(): Promise<void> {
			const [storedMode, storedAccent] = await Promise.all([
				db.getSetting('theme_mode'),
				db.getSetting('accent_color'),
			])

			if (active) {
				setModeState(normalizeMode(storedMode))
				setAccentColorState(storedAccent || DEFAULT_ACCENT)
				setIsLoading(false)
			}
		}

		void loadTheme()
		return () => {
			active = false
		}
	}, [])

	useEffect(() => {
		applyTheme(mode, accentColor)
	}, [mode, accentColor])

	async function setMode(nextMode: ThemeMode): Promise<void> {
		setModeState(nextMode)
		await db.setSetting('theme_mode', nextMode)
	}

	async function setAccentColor(nextColor: string): Promise<void> {
		setAccentColorState(nextColor)
		await db.setSetting('accent_color', nextColor)
	}

	return (
		<ThemeContext.Provider
			value={{ mode, accentColor, isLoading, setMode, setAccentColor }}
		>
			{children}
		</ThemeContext.Provider>
	)
}

