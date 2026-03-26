import { useState, useCallback } from 'react'

interface FeedbackState {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'info' | 'warning'
}

export function useFeedback() {
  const [state, setState] = useState<FeedbackState>({ open: false, message: '', severity: 'success' })

  const showSuccess = useCallback((message: string) => {
    setState({ open: true, message, severity: 'success' })
  }, [])

  const showError = useCallback((message: string) => {
    setState({ open: true, message, severity: 'error' })
  }, [])

  const close = useCallback(() => {
    setState(prev => ({ ...prev, open: false }))
  }, [])

  return { ...state, showSuccess, showError, close }
}
