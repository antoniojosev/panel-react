import { Box, Button, CircularProgress, Typography } from '@mui/material'
import Modal from './Modal'

interface DeleteConfirmModalProps {
  open: boolean
  entityName: string | undefined
  entityLabel?: string
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export default function DeleteConfirmModal({ open, entityName, entityLabel = 'registro', onClose, onConfirm, isLoading }: DeleteConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Typography variant="h6" sx={{ mb: 2 }}>Confirmar eliminación</Typography>
      <Typography sx={{ mb: 3 }}>
        ¿Estás seguro de que quieres eliminar {entityLabel} "{entityName}"? Esta acción no se puede deshacer.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="error" disabled={isLoading} onClick={onConfirm}>
          {isLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Eliminar'}
        </Button>
      </Box>
    </Modal>
  )
}
