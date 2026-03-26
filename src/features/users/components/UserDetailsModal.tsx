import { Box, Button, Typography } from '@mui/material'
import Modal from '../../../components/ui/Modal'

interface UserDetailsModalProps {
  open: boolean
  user: { id: string; email: string; name: string; role: string } | null
  onClose: () => void
}

export default function UserDetailsModal({ open, user, onClose }: UserDetailsModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Typography variant="h6" sx={{ mb: 2 }}>Detalle de usuario</Typography>
      {user ? (
        <Box sx={{ display: 'grid', gap: 1 }}>
          <Typography><strong>Nombre:</strong> {user.name}</Typography>
          <Typography><strong>Email:</strong> {user.email}</Typography>
          <Typography><strong>Rol:</strong> {user.role}</Typography>
          <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>Cerrar</Button>
        </Box>
      ) : (
        <Typography>No hay usuario seleccionado</Typography>
      )}
    </Modal>
  )
}
