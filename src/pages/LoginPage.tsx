import { Box, Card, CardContent, Typography, TextField, Button, Alert, Link } from '@mui/material'
import { useState } from 'react'
import { useLogin } from '../features/auth/hooks/useAuth'
import { Link as RouterLink } from 'react-router-dom'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useLogin()

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

                <Typography variant="h6">Iniciar sesión</Typography>

                <form
                    onSubmit={e => {
                    e.preventDefault()
                    login.mutate({ email, password })
                    }}
                    style={{ display: 'grid', gap: 16, marginTop: 16 }}
                >
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

                    {login.isError && (
                    <Alert severity="error">{(login.error as Error)?.message || 'Error al iniciar sesión'}</Alert>
                    )}

                    <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ background: '#8000ff', color: '#fff', '&:hover': { background: '#6a00cc' } }}
                    disabled={login.isPending}
                    >
                    {login.isPending ? 'Ingresando...' : 'Ingresar'}
                    </Button>

                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                      ¿No tienes cuenta?{' '}
                      <Link component={RouterLink} to="/register" sx={{ color: '#8000ff' }}>
                        Regístrate
                      </Link>
                    </Typography>
                </form>
            </div>
        </CardContent>
      </Card>
    </Box>
  )
}
