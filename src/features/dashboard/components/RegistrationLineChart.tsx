import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Last7DaysItem } from '../types'

interface RegistrationLineChartProps {
  data: Last7DaysItem[]
  fullWidth?: boolean
}

export default function RegistrationLineChart({ data, fullWidth }: RegistrationLineChartProps) {
  return (
    <Card className={fullWidth ? 'col-span-2' : ''} sx={{ backgroundColor: 'background.paper' }}>
      <CardContent className="flex flex-col justify-between h-full">
        <Typography variant="h6" gutterBottom>
          Estudiantes registrados en los últimos 7 días
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="complete" stroke="#8e44ad" strokeWidth={2} name="Estudiantes" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
