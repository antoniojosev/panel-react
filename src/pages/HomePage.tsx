import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import AddIcon from '@mui/icons-material/Add';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDashboardData } from '../services/dashboardApi';
import { ShowForRole, useHasRole } from '../utils/roleUtils';

export default function HomePage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    getDashboardData().then(data => {
      setDashboard(data);
    }).catch(e => {
      console.error('Error dashboard:', e);
    });
  }, []);

  const handleCreateUser = () => {
    navigate('/users', { state: { openCreateModal: true } });
  };

  const handleCreateStudent = () => {
    navigate('/students', { state: { openCreateModal: true } });
  };

  const isInstructor = useHasRole(['instructor'])
  const lineChartContainerClass = isInstructor ? 'col-span-2' : ''


  const piePalette = [
    '#8e44ad', // morado
    '#7f8c8d', // gris
    '#9b59b6', // lila
    '#34495e', // azul oscuro
    '#e67e22', // naranja
    '#16a085', // verde
    '#c0392b', // rojo
    '#2980b9', // azul
    '#f1c40f', // amarillo
    '#27ae60', // verde claro
  ];

  const pieData = dashboard?.statusDistribution
    ? dashboard.statusDistribution.map((item: any, idx: number) => ({
        ...item,
        color: piePalette[idx % piePalette.length],
      }))
    : [];

  return (
      <> 
        <div className="flex justify-between m-3">
          <div>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>

            <Typography color="textDisabled" variant="subtitle1" gutterBottom>
              Visualización y control detallado de registros, roles y actividad académica
            </Typography>
          </div>

          <div>
            <ShowForRole allowedRoles={["admin"]}>
              <Fab 
                sx={{ color: "#ffffff", marginRight: 2 }}
                variant="extended"
                className="bg-gradient-to-b from-[#7F8C8D] to-[#9B59B6] hover:from-[#7F8C8D] hover:to-[#8E44AD] text-white"
                onClick={handleCreateUser}
              >
                <AddIcon sx={{ mr: 1 }} />
                Crear nuevo usuario
              </Fab>
            </ShowForRole>
            <ShowForRole allowedRoles={["admin", "instructor"]}>
              <Fab 
                sx={{ color: "#ffffff" }}
                variant="extended"
                className="bg-gradient-to-b from-[#7F8C8D] to-[#9B59B6] hover:from-[#7F8C8D] hover:to-[#8E44AD] text-white"
                onClick={handleCreateStudent}
              >
                <AddIcon sx={{ mr: 1 }} />
                Crear nuevo estudiante
              </Fab>
            </ShowForRole>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card sx={{ backgroundColor: 'background.paper' }}>
            <CardContent className="flex flex-col justify-center h-full ml-5">
              <Typography variant="h6" gutterBottom>
                Total de estudiantes
              </Typography>

              <Typography variant="h4" color="#8e44ad" sx={{ fontSize: '2.5rem', fontWeight: 700 }}>
                {dashboard?.totalStudents ?? '...'}
              </Typography>
            </CardContent>
          </Card>
  
          <Card sx={{ backgroundColor: 'background.paper' }}>
            <CardContent className="flex flex-col justify-center h-full ml-5">
              <Typography variant="h6" gutterBottom>
                Progreso promedio de estudiantes
              </Typography>

              <Typography variant="h4" color="#8e44ad" sx={{ fontSize: '2.5rem', fontWeight: 700 }}>
                {dashboard?.avgProgress !== undefined ? `${dashboard.avgProgress}%` : '...'}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ backgroundColor: 'background.paper' }}>
            <CardContent className="flex flex-col justify-between h-full">
              <Typography variant="h6" gutterBottom>
                Distribución de estudiantes por estado
              </Typography>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry: any, index: number) => (
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
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Card className={lineChartContainerClass} sx={{ backgroundColor: 'background.paper' }}>
            <CardContent className="flex flex-col justify-between h-full">
              <Typography variant="h6" gutterBottom>
                Estudiantes registrados en los últimos 7 días
              </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dashboard?.last7Days ?? []}>
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

          <ShowForRole allowedRoles={["admin"]}>
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
                    {dashboard?.instructorRanking?.map((row: any) => (
                      <tr className="border-b hover:bg-gray-50" key={row.ranking}>
                        <td className="px-3 py-2">{row.ranking}°</td>
                        <td className="px-3 py-2">{row.instructor?.name} {row.instructor?.lastName}</td>
                        <td className="px-3 py-2">{row.completedStudents}</td>
                        <td className="px-3 py-2">{row.completionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          </ShowForRole>
        </div>
      </>
  )
}
