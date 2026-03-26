import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

interface StatsCardsProps {
  totalStudents: number | undefined
  avgProgress: number | undefined
}

export default function StatsCards({ totalStudents, avgProgress }: StatsCardsProps) {
  return (
    <>
      <Card sx={{ backgroundColor: 'background.paper' }}>
        <CardContent className="flex flex-col justify-center h-full ml-5">
          <Typography variant="h6" gutterBottom>
            Total de estudiantes
          </Typography>
          <Typography variant="h4" color="#8e44ad" sx={{ fontSize: '2.5rem', fontWeight: 700 }}>
            {totalStudents ?? '...'}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ backgroundColor: 'background.paper' }}>
        <CardContent className="flex flex-col justify-center h-full ml-5">
          <Typography variant="h6" gutterBottom>
            Progreso promedio de estudiantes
          </Typography>
          <Typography variant="h4" color="#8e44ad" sx={{ fontSize: '2.5rem', fontWeight: 700 }}>
            {avgProgress !== undefined ? `${avgProgress}%` : '...'}
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}
