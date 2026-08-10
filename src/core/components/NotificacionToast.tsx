import { AnimatePresence, motion } from 'framer-motion'
import { useNotifications } from './useNotifications'
import type { NotificationVariant } from './notification-context'
import { AlertTriangle, CheckCircle, Info, X } from './Iconos'

const variantStyles: Record<
	NotificationVariant,
	{ background: string; border: string; icon: typeof CheckCircle }
> = {
	success: {
		background: '#166534',
		border: '#22C55E',
		icon: CheckCircle,
	},
	error: {
		background: '#991B1B',
		border: '#EF4444',
		icon: AlertTriangle,
	},
	warning: {
		background: '#9A3412',
		border: '#F97316',
		icon: AlertTriangle,
	},
	info: {
		background: 'var(--color-primary, #0077D6)',
		border: 'var(--color-primary, #0077D6)',
		icon: Info,
	},
}

export function NotificacionToast(): React.JSX.Element {
	const { notifications, dismiss } = useNotifications()

	return (
		<div
			aria-live="polite"
			style={{
				bottom: 40,
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
				left: '50%',
				pointerEvents: 'none',
				position: 'fixed',
				transform: 'translateX(-50%)',
				width: 'min(420px, calc(100vw - 32px))',
				zIndex: 1000,
			}}
		>
			<AnimatePresence initial={false}>
				{notifications.map((notification) => {
					const style = variantStyles[notification.variant]
					const Icon = style.icon

					return (
						<motion.div
							key={notification.id}
							initial={{ opacity: 0, y: 20, scale: 0.96 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.96 }}
							transition={{ duration: 0.2 }}
							role="status"
							style={{
								alignItems: 'center',
								background: style.background,
								border: `1px solid ${style.border}`,
								borderRadius: 8,
								boxShadow: '0 12px 30px rgba(0, 0, 0, 0.22)',
								color: '#FFFFFF',
								display: 'flex',
								gap: 10,
								padding: '12px 14px',
								pointerEvents: 'auto',
							}}
						>
							<Icon aria-hidden="true" size={18} />
							<span style={{ flex: 1, fontSize: 14, lineHeight: 1.4 }}>
								{notification.message}
							</span>
							<button
								aria-label="Cerrar notificación"
								onClick={() => dismiss(notification.id)}
								style={{
									alignItems: 'center',
									background: 'transparent',
									border: 0,
									color: 'inherit',
									cursor: 'pointer',
									display: 'inline-flex',
									padding: 2,
								}}
								type="button"
							>
								<X aria-hidden="true" size={16} />
							</button>
						</motion.div>
					)
				})}
			</AnimatePresence>
		</div>
	)
}
