import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import type { InstructorRankingItem } from '../types'

interface InstructorRankingTableProps {
  data: InstructorRankingItem[]
}

export default function InstructorRankingTable({ data }: InstructorRankingTableProps) {
  return (
    <Card sx={{ backgroundColor: 'background.paper' }}>
      <CardContent className="flex flex-col justify-between h-full">
        <Typography variant="h6" gutterBottom>
          Ranking de instructores por estudiantes completados
        </Typography>
        <div className="overflow-x-auto mt-2 h-64 overflow-y-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-transparent">
                <th className="px-3 py-2 text-purple-700">Puesto</th>
                <th className="px-3 py-2 text-purple-700">Instructor</th>
                <th className="px-3 py-2 text-purple-700">Estudiantes Completados</th>
                <th className="px-3 py-2 text-purple-700">Tasa de Finalización</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr className="border-b hover:bg-gray-50" key={row.ranking}>
                  <td className="px-3 py-2">{row.ranking}°</td>
                  <td className="px-3 py-2">{row.instructor?.name}</td>
                  <td className="px-3 py-2">{row.completedStudents}</td>
                  <td className="px-3 py-2">{row.completionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
