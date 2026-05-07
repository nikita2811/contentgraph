import { useState, useCallback } from 'react'
import type { SnackbarProps, SnackbarVariant } from './Snackbar'

type SnackbarItem = Omit<SnackbarProps, 'onClose'>

export function useSnackbar() {
    const [items, setItems] = useState<SnackbarItem[]>([])

    const show = useCallback((
        message: string,
        variant: SnackbarVariant = 'error',
        duration = 4000,
    ) => {
        setItems(prev => [
            ...prev,
            { id: Date.now(), message, variant, duration },
        ])
    }, [])

    const remove = useCallback((id: number) => {
        setItems(prev => prev.filter(s => s.id !== id))
    }, [])

    // Convenience helpers
    const error = (msg: string) => show(msg, 'error')
    const success = (msg: string) => show(msg, 'success')
    const warning = (msg: string) => show(msg, 'warning')
    const info = (msg: string) => show(msg, 'info')

    return { items, show, remove, error, success, warning, info }
}