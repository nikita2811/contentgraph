import { useEffect, useState } from 'react'
import '../../css/snackbar.css'

export type SnackbarVariant =
    | 'error' | 'success' | 'warning' | 'info'

export interface SnackbarProps {
    id: number
    message: string
    variant?: SnackbarVariant
    duration?: number
    onClose: (id: number) => void
}

const ICONS: Record<SnackbarVariant, string> = {
    error: '✕',
    success: '✓',
    warning: '!',
    info: 'i',
}

export function Snackbar({
    id, message, variant = 'error', duration = 4000, onClose,
}: SnackbarProps) {
    const [exiting, setExiting] = useState(false)

    const dismiss = () => {
        setExiting(true)
        setTimeout(() => onClose(id), 200)
    }

    useEffect(() => {
        const t = setTimeout(dismiss, duration)
        return () => clearTimeout(t)
    }, [])

    return (
        <div className={['snackbar', variant, exiting && 'snackbar--exit']
            .filter(Boolean).join(' ')}>
            <span className="snackbar__icon" aria-hidden>
                {ICONS[variant]}
            </span>
            <span className="snackbar__message" role="alert">
                {message}
            </span>
            <button
                className="snackbar__close"
                onClick={dismiss}
                aria-label="Dismiss"
            >✕</button>
        </div>
    )
}

// Container — place once near root
export function SnackbarContainer({
    snackbars, onClose,
}: {
    snackbars: SnackbarProps[]
    onClose: (id: number) => void
}) {
    return (
        <div className="snackbar-container" aria-live="polite">
            {snackbars.map(s => (
                <Snackbar key={s.id} {...s} onClose={onClose} />
            ))}
        </div>
    )
}