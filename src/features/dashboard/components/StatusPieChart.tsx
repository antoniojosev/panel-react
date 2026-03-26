import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { StatusDistributionItem } from '../types'

const PIE_PALETTE = ['#8e44ad', '#7f8c8d', '#9b59b6', '#34495e', '#e67e22', '#16a085', '#c0392b', '#2980b9', '#f1c40f', '#27ae60']

interface StatusPieChartProps {
  data: StatusDistributionItem[]
}

export default function StatusPieChart({ data }: StatusPieChartProps) {
  const pieData = data.map((item, idx) => ({
    ...item,
    color: PIE_PALETTE[idx % PIE_PALETTE.length],
  }))

  return (
    <Card sx={{ backgroundColor: 'background.paper' }}>
      <CardContent className="flex flex-col justify-between h-full">
        <Typography variant="h6" gutterBottom>
          Distribución de estudiantes por estado
        </Typography>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Typography color="textSecondary" sx={{ pt: 2 }}>
            No hay estudiantes disponibles
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
