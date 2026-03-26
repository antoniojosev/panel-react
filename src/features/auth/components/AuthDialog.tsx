import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import type { AppDispatch } from '../../../store'
import { login, logout, setAuthError, setAuthLoading } from '../authSlice'

interface AuthDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AuthDialog({ open, onClose, onSuccess }: AuthDialogProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async () => {
    dispatch(setAuthLoading())
    try {
      await new Promise((resolve) => setTimeout(resolve, 650))

      if (email && password.length >= 5) {
        dispatch(login({ userId: 'user-1', email, token: 'mock-jwt-token' }))
        onSuccess()
        onClose()
      } else {
        dispatch(setAuthError('Credenciales inválidas. Usa email y contraseña (>=5 chars).'))
      }
    } catch (error) {
      dispatch(setAuthError(String(error)))
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    onClose()
    onSuccess()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Iniciar sesión</DialogTitle>
      <DialogContent>
        <DialogContentText>Ingresa tus datos para continuar en todo el portal.</DialogContentText>
        <TextField
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          label="Correo electrónico"
          type="email"
          fullWidth
          margin="normal"
        />
        <TextField
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Entrar
        </Button>
        <Button onClick={handleLogout} color="error">
          Cerrar sesión
        </Button>
      </DialogActions>
    </Dialog>
  )
}
