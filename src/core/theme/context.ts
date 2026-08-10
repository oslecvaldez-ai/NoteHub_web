import { createContext } from 'react'

export type ThemeMode = 'light' | 'dark'

export interface ThemeContextValue {
  mode: ThemeMode
  accentColor: string
  isLoading: boolean
  setMode: (mode: ThemeMode) => Promise<void>
  setAccentColor: (color: string) => Promise<void>
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
