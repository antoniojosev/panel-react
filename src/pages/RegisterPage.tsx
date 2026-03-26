import { Box, Card, CardContent, Typography, TextField, Button, Alert, Link } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useRegister } from '../features/auth/hooks/useAuth'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const register = useRegister()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      await register.mutateAsync({
        email,
        password,
        name: fullName,
        role: 'instructor'
      })
      navigate('/login')
    } catch (err: any) {
      setError(err?.message || err?.response?.data?.message || 'Error al crear la cuenta')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7' }}>
      <Card sx={{ backgroundColor: '#ffffff', padding: 4, width: '100%', maxWidth: 400 }}>
        <CardContent>
            <div className='flex flex-col justify-center items-center'>
                <Button color="inherit" sx={{marginBottom: 1}}>
                    <div className="flex items-center gap-2">
                    <SportsEsportsIcon sx={{ color: '#9b59b6' }} fontSize="large" />

                    <Typography variant="h6">
                        VR Academy
                    </Typography>
                    </div>
                </Button>

                <Typography variant="h6">Crear cuenta</Typography>

                <form
                    onSubmit={handleSubmit}
                    style={{ display: 'grid', gap: 16, marginTop: 16 }}
                >
                    <TextField
                    label="Nombre completo"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    fullWidth
                    required
                    />

                    <TextField
                    label="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    fullWidth
                    required
                    />

                    <TextField
                    label="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    fullWidth
                    required
                    />

                    <TextField
                    label="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    type="password"
                    fullWidth
                    required
                    />

                    {error && (
                    <Alert severity="error">{error}</Alert>
                    )}

                    <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ background: '#8000ff', color: '#fff', '&:hover': { background: '#6a00cc' } }}
                    disabled={register.isPending}
                    >
                    {register.isPending ? 'Creando cuenta...' : 'Crear cuenta'}
                    </Button>

                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                      ¿Ya tienes cuenta?{' '}
                      <Link component={RouterLink} to="/login" sx={{ color: '#8000ff' }}>
                        Inicia sesión
                      </Link>
                    </Typography>
                </form>
            </div>
        </CardContent>
      </Card>
    </Box>
  )
}