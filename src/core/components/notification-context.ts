import { createContext } from 'react'

export type NotificationVariant = 'success' | 'error' | 'warning' | 'info'

export interface NotificationItem {
  id: number
  message: string
  variant: NotificationVariant
}

export interface NotificationContextValue {
  notifications: NotificationItem[]
  notify: (message: string, variant?: NotificationVariant) => number
  dismiss: (id: number) => void
}

export const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
)
