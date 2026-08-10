import { useEffect, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { X } from './Iconos'

export interface VisorImagenModalProps {
	isOpen: boolean
	src: string | null
	alt?: string
	onClose: () => void
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

export function VisorImagenModal({
	isOpen,
	src,
	alt = 'Imagen ampliada',
	onClose,
}: VisorImagenModalProps): ReactElement | null {
	useEffect(() => {
		if (!isOpen) {
			return undefined
		}

		const handleKeyDown = (event: KeyboardEvent): void => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, onClose])

	if (!isOpen || !src) {
		return null
	}

	const modalRoot = getModalRoot()
	if (!modalRoot) {
		return null
	}

	return createPortal(
		<div
			aria-label="Visor de imagen"
			aria-modal="true"
			onClick={(event) => {
				if (event.target === event.currentTarget) {
					onClose()
				}
			}}
			role="dialog"
			style={{
				alignItems: 'center',
				background: 'rgba(0, 0, 0, 0.82)',
				display: 'flex',
				inset: 0,
				justifyContent: 'center',
				padding: 24,
				position: 'fixed',
				zIndex: 1100,
			}}
		>
			<button
				aria-label="Cerrar visor de imagen"
				onClick={onClose}
				style={{
					alignItems: 'center',
					background: 'rgba(255, 255, 255, 0.14)',
					border: 0,
					borderRadius: '50%',
					color: '#FFFFFF',
					cursor: 'pointer',
					display: 'inline-flex',
					justifyContent: 'center',
					padding: 10,
					position: 'absolute',
					right: 24,
					top: 24,
				}}
				type="button"
			>
				<X aria-hidden="true" size={24} />
			</button>
			<img
				alt={alt}
				src={src}
				style={{ maxHeight: 'calc(100vh - 48px)', maxWidth: 'calc(100vw - 48px)', objectFit: 'contain' }}
			/>
		</div>,
		modalRoot,
	)
}
