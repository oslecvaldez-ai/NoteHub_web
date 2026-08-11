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
			className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 p-6"
		>
			<section
				aria-labelledby="confirmacion-eliminacion-titulo"
				className="relative w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_45px_rgba(0,0,0,0.22)] dark:border-slate-700 dark:bg-slate-800"
			>
				<button
					aria-label="Cerrar modal"
					onClick={onCancel}
					type="button"
					className="absolute right-4 top-4 rounded-full p-2 text-text-secondary transition hover:bg-black/5 hover:text-text-primary dark:hover:bg-white/10"
				>
					<X aria-hidden="true" size={20} />
				</button>
				<div className="flex items-center gap-3">
					<div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
						<AlertTriangle aria-hidden="true" size={24} />
					</div>
					<div>
						<h2 id="confirmacion-eliminacion-titulo" className="text-lg font-semibold text-text-primary">
							{title}
						</h2>
						<p className="mt-1 text-sm leading-6 text-text-secondary">
							{message}
						</p>
					</div>
				</div>
				<div className="mt-6 flex justify-end gap-3">
					<button
						onClick={onCancel}
						type="button"
						className="min-w-[110px] rounded-xl border border-black/10 bg-secondary px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-black/5 dark:border-white/10 dark:bg-secondary dark:hover:bg-white/10"
					>
						{cancelLabel}
					</button>
					<button
						onClick={onConfirm}
						type="button"
						className="min-w-[110px] rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
					>
						{confirmLabel}
					</button>
				</div>
			</section>
		</div>,
		modalRoot,
	)
}
