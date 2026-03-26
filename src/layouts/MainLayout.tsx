import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom'
import { Avatar, Button, Card, CardContent, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Snackbar, Typography, TextField, Box, Alert } from '@mui/material'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import LogoutIcon from '@mui/icons-material/Logout'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsIcon from '@mui/icons-material/Settings'
import Modal from '../components/ui/Modal'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import AuthDialog from '../features/auth/components/AuthDialog'
import { logout } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { queryClient } from '../services/queryClient'
import { useProfile } from '../features/auth/hooks/useAuth'
import { useThemeMode } from '../context/ThemeModeContext'
import { ShowForRole } from '../utils/roleUtils'
import { useChangePassword } from '../features/auth/hooks/useAuth'

export default function MainLayout() {
  const dispatch = useDispatch<AppDispatch>()
  const auth = useSelector((state: RootState) => state.auth)
  const location = useLocation()
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const { mode, toggleMode, setMode } = useThemeMode()

  // Cierre de sesión completo
  const handleLogout = () => {
    dispatch(logout())
    localStorage.clear()
    sessionStorage.clear()
    queryClient.clear()
    setMode('light') // Resetear modo oscuro al hacer logout
    setTimeout(() => {
      navigate('/login', { replace: true })
    }, 500)
  }

  // Obtener perfil del usuario autenticado
  const { data: user } = useProfile()
  const changePassword = useChangePassword()

  return (
    <div className="grid grid-cols-[300px_1fr] grid-rows-[auto_1fr] gap-4 p-4 h-screen">
      <Card className="row-start-1 col-start-1 col-span-2">
        <CardContent className="flex justify-between items-center">
          <Button color="inherit">
            <div className="flex items-center gap-2">
              <SportsEsportsIcon sx={{ color: '#9b59b6' }} fontSize="large" />
              
              <Typography variant="h6">
                VR Academy
              </Typography>
            </div>
          </Button>

          <div className="flex items-center gap-1">
            <IconButton onClick={() => setSettingsModalOpen(true)} color="inherit" sx={{ color: '#9b59b6' }}>
              <SettingsIcon />
            </IconButton>
            <IconButton onClick={toggleMode} color="inherit" sx={{ color: '#9b59b6' }}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            <Button color="inherit">
              <Avatar 
                sx={{background: "#9b59b6"}}
                alt={user?.fullName || 'Usuario'}
                className="mr-3"
              />
              <div className="flex flex-col items-start text-left">
                <Typography variant="h6">
                  {user?.fullName ?? 'Usuario'}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {user?.email ?? '---'}
                </Typography>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="row-start-2 col-start-1">
        <CardContent className="flex flex-col justify-between h-full">
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Menu
            </Typography>

            <List className="text-left">
              <ListItem disablePadding className="mb-2 last:mb-0">
                <ListItemButton
                  component={RouterLink}
                  to="/"
                  sx={{
                    position: 'relative',
                    color: location.pathname === '/' ? '#7f8c8d' : '#95a5a6',
                    px: 1,
                    py: 0.5,
                    '&::before': location.pathname === '/' ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      backgroundColor: '#8e44ad',
                      borderRadius: '0 4px 4px 0'
                    } : undefined,
                    '&:hover': {
                      color: '#7f8c8d',
                      backgroundColor: 'rgba(255,255,255,0.08)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 24, mr: 1, color: location.pathname === '/' ? '#8e44ad' : 'inherit' }}><HomeIcon /></ListItemIcon>
                  <ListItemText primary="Inicio" sx={{ m: 0, color: 'inherit' }} />
                </ListItemButton>
              </ListItem>
              <ShowForRole allowedRoles={["admin"]}>
                <ListItem disablePadding className="mb-2 last:mb-0">
                  <ListItemButton
                    component={RouterLink}
                    to="/users"
                    sx={{
                      position: 'relative',
                      color: location.pathname === '/users' ? '#7f8c8d' : '#95a5a6',
                      px: 1,
                      py: 0.5,
                      '&::before': location.pathname === '/users' ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        backgroundColor: '#8e44ad',
                        borderRadius: '0 4px 4px 0'
                      } : undefined,
                      '&:hover': {
                        color: '#7f8c8d',
                        backgroundColor: 'rgba(255,255,255,0.08)'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 24, mr: 1, color: location.pathname === '/users' ? '#8e44ad' : 'inherit' }}><PersonIcon /></ListItemIcon>
                    <ListItemText primary="Usuarios" sx={{ m: 0, color: 'inherit' }} />
                  </ListItemButton>
                </ListItem>
              </ShowForRole>
              <ListItem disablePadding className="mb-2 last:mb-0">
                <ListItemButton
                  component={RouterLink}
                  to="/students"
                  sx={{
                    position: 'relative',
                    color: location.pathname === '/students' ? '#7f8c8d' : '#95a5a6',
                    px: 1,
                    py: 0.5,
                    '&::before': location.pathname === '/students' ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      backgroundColor: '#8e44ad',
                      borderRadius: '0 4px 4px 0'
                    } : undefined,
                    '&:hover': {
                      color: '#7f8c8d',
                      backgroundColor: 'rgba(255,255,255,0.08)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 24, mr: 1, color: location.pathname === '/students' ? '#8e44ad' : 'inherit' }}><SchoolIcon /></ListItemIcon>
                  <ListItemText primary="Estudiantes" sx={{ m: 0, color: 'inherit' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </div>

          <div className="pt-2">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                width: '100%',
                backgroundColor: 'transparent',
                color: '#95a5a6',
                '&:hover': {
                  color: '#7f8c8d',
                }
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="row-start-2 col-start-2">
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>

      <Modal open={settingsModalOpen} onClose={() => {
        setSettingsModalOpen(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordError('')
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Configuración</Typography>
        <TextField
          label="Contraseña actual"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Nueva contraseña"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Confirmar nueva contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          sx={{ mb: 1 }}
        />
        {passwordError && <Typography color="error" sx={{ mb: 1 }}>{passwordError}</Typography>}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          <Button
            onClick={() => {
              setSettingsModalOpen(false)
              setCurrentPassword('')
              setNewPassword('')
              setConfirmPassword('')
              setPasswordError('')
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!currentPassword || !newPassword || !confirmPassword) {
                setPasswordError('Completa todos los campos.')
                return
              }
              if (newPassword !== confirmPassword) {
                setPasswordError('La nueva contraseña y la confirmación no coinciden.')
                return
              }

              changePassword.mutate(
                {
                  currentPassword,
                  newPassword,
                  confirmNewPassword: confirmPassword,
                },
                {
                  onSuccess: (data) => {
                    setSnackbarMessage(data?.message || 'Contraseña actualizada exitosamente')
                    setSnackbarSeverity('success')
                    setSnackbarOpen(true)
                    setSettingsModalOpen(false)
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setPasswordError('')
                  },
                  onError: (error: any) => {
                    const message = error?.message || error?.resp?.message || 'Error al cambiar la contraseña'
                    setSnackbarMessage(message)
                    setSnackbarSeverity('error')
                    setSnackbarOpen(true)
                  }
                }
              )
            }}
            sx={{ backgroundColor: '#8000ff', color: '#fff', '&:hover': { backgroundColor: '#6a00cc' } }}
          >
            Guardar
          </Button>
        </Box>
      </Modal>

      <AuthDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => {
          setSnackbarMessage(auth.status === 'authenticated' ? 'Sesión iniciada' : 'Sesión cerrada')
          setSnackbarSeverity('success')
          setSnackbarOpen(true)
        }}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}
