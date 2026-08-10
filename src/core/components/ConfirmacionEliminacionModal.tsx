import { useEffect, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, X } from './Iconos'

export interface ConfirmacionEliminacionModalProps {
	isOpen: boolean
	title?: string
	message: string
	onCancel: () => void
	onConfirm: () => void
	confirmLabel?: string
	cancelLabel?: string
}

function getModalRoot(): HTMLElement | null {
	if (typeof document === 'undefined') {
		return null
	}

	let root = document.getElementById('modal-root')
	if (!root) {
		root = document.createElement('div')
		root.id = 'modal-root'
		document.body.appendChild(root)
	}
	return root
}

export function ConfirmacionEliminacionModal({
	isOpen,
	title = 'Confirmar eliminación',
	message,
	onCancel,
	onConfirm,
	confirmLabel = 'Confirmar',
	cancelLabel = 'Cancelar',
}: ConfirmacionEliminacionModalProps): ReactElement | null {
	useEffect(() => {
		if (!isOpen) {
			return undefined
		}

		const handleKeyDown = (event: KeyboardEvent): void => {
			if (event.key === 'Escape') {
				onCancel()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, onCancel])

	if (!isOpen) {
		return null
	}

	const modalRoot = getModalRoot()
	if (!modalRoot) {
		return null
	}

	return createPortal(
		<div
			aria-modal="true"
			onClick={(event) => {
				if (event.target === event.currentTarget) {
					onCancel()
				}
			}}
			role="dialog"
			style={{
				alignItems: 'center',
				background: 'rgba(0, 0, 0, 0.5)',
				display: 'flex',
				inset: 0,
				justifyContent: 'center',
				padding: 24,
				position: 'fixed',
				zIndex: 1100,
			}}
		>
			<section
				aria-labelledby="confirmacion-eliminacion-titulo"
				style={{
					background: 'var(--bg-card, #F4F5F7)',
					borderRadius: 8,
					boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
					color: 'var(--text-primary, #1C1C1E)',
					maxWidth: 440,
					padding: 24,
					position: 'relative',
					width: '100%',
				}}
			>
				<button
					aria-label="Cerrar modal"
					onClick={onCancel}
					style={{
						background: 'transparent',
						border: 0,
						color: 'var(--text-secondary, #8E8E93)',
						cursor: 'pointer',
						padding: 4,
						position: 'absolute',
						right: 16,
						top: 16,
					}}
					type="button"
				>
					<X aria-hidden="true" size={20} />
				</button>
				<AlertTriangle aria-hidden="true" color="#F97316" size={28} />
				<h2 id="confirmacion-eliminacion-titulo" style={{ fontSize: 20, margin: '16px 0 8px' }}>
					{title}
				</h2>
				<p style={{ color: 'var(--text-secondary, #8E8E93)', lineHeight: 1.5, margin: 0 }}>
					{message}
				</p>
				<div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
					<button onClick={onCancel} type="button">
						{cancelLabel}
					</button>
					<button
						onClick={onConfirm}
						style={{ background: '#DC2626', border: 0, color: '#FFFFFF' }}
						type="button"
					>
						{confirmLabel}
					</button>
				</div>
			</section>
		</div>,
		modalRoot,
	)
}
