import { type PropsWithChildren, type ReactElement } from 'react'
import { ThemeProvider } from '../theme/ThemeContext'
import { NotificationProvider } from './NotificationContext'
import { NotificacionToast } from './NotificacionToast'

export function AppWrapper({ children }: PropsWithChildren): ReactElement {
	return (
		<ThemeProvider>
			<NotificationProvider>
				{children}
				<NotificacionToast />
			</NotificationProvider>
		</ThemeProvider>
	)
}
