import { Snackbar, Alert } from '@mui/material'

interface FeedbackToastProps {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'info' | 'warning'
  onClose: () => void
  autoHideDuration?: number
}

export default function FeedbackToast({ open, message, severity, onClose, autoHideDuration = 4000 }: FeedbackToastProps) {
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
