import { Box, CircularProgress, Typography } from '@mui/material'

interface PageLoaderProps {
  message?: string
}

export default function PageLoader({ message = 'Cargando...' }: PageLoaderProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
      <CircularProgress sx={{ color: '#8e44ad' }} size={48} />
      <Typography color="text.secondary" variant="body2">
        {message}
      </Typography>
    </Box>
  )
}
