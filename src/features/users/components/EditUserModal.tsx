import { Box, Button, CircularProgress, MenuItem, Select, TextField, Typography } from '@mui/material'
import Modal from '../../../components/ui/Modal'
import type { UserRole, UserUpdateDTO } from '../userTypes'

interface EditUserState {
  id: string
  email: string
  name: string
  role: UserRole
}

interface EditUserModalProps {
  open: boolean
  user: EditUserState | null
  onClose: () => void
  onChange: (user: EditUserState) => void
  onSubmit: (id: string, values: UserUpdateDTO) => void
  isLoading: boolean
}

export default function EditUserModal({ open, user, onClose, onChange, onSubmit, isLoading }: EditUserModalProps) {
  if (!user) return null

  return (
    <Modal open={open} onClose={onClose}>
      <Typography variant="h6" sx={{ mb: 2 }}>Editar usuario</Typography>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <TextField label="Email" value={user.email} onChange={e => onChange({ ...user, email: e.target.value })} fullWidth />
        <TextField label="Nombre completo" value={user.name} onChange={e => onChange({ ...user, name: e.target.value })} fullWidth />
        <Select value={user.role} onChange={e => onChange({ ...user, role: e.target.value as UserRole })} fullWidth>
          <MenuItem value="admin">admin</MenuItem>
          <MenuItem value="instructor">instructor</MenuItem>
        </Select>
        <Button
          fullWidth
          variant="contained"
          disabled={isLoading}
          onClick={() => onSubmit(user.id, { name: user.name, email: user.email, role: user.role })}
          sx={{ background: '#8000ff', color: '#fff', '&:hover': { background: '#6a00cc' } }}
        >
          {isLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Guardar cambios'}
        </Button>
      </Box>
    </Modal>
  )
}
