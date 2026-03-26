import { useState } from 'react'
import { Box, Button, CircularProgress, MenuItem, Select, TextField, Typography } from '@mui/material'
import Modal from '../../../components/ui/Modal'
import type { UserCreateDTO, UserRole } from '../userTypes'

interface CreateUserModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: UserCreateDTO) => void
  isLoading: boolean
}

export default function CreateUserModal({ open, onClose, onSubmit, isLoading }: CreateUserModalProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('instructor')

  const handleClose = () => {
    setEmail('')
    setName('')
    setPassword('')
    setRole('instructor')
    onClose()
  }

  const handleSubmit = () => {
    onSubmit({ email, password, name, role })
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Typography variant="h6" sx={{ mb: 2 }}>Crear nuevo usuario</Typography>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
        <TextField label="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
        <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)} fullWidth>
          <MenuItem value="admin">admin</MenuItem>
          <MenuItem value="instructor">instructor</MenuItem>
        </Select>
        <Button
          fullWidth
          variant="contained"
          disabled={isLoading}
          onClick={handleSubmit}
          sx={{ background: '#8000ff', color: '#fff', '&:hover': { background: '#6a00cc' } }}
        >
          {isLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Crear'}
        </Button>
      </Box>
    </Modal>
  )
}
