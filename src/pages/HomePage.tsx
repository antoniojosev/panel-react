import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { ShowForRole, useHasRole } from '../utils/roleUtils';
import PageLoader from '../components/ui/PageLoader';
import StatsCards from '../features/dashboard/components/StatsCards';
import StatusPieChart from '../features/dashboard/components/StatusPieChart';
import RegistrationLineChart from '../features/dashboard/components/RegistrationLineChart';
import InstructorRankingTable from '../features/dashboard/components/InstructorRankingTable';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: dashboard, isLoading } = useDashboard();
  const isInstructor = useHasRole(['instructor']);

  if (isLoading) return <PageLoader message="Cargando dashboard..." />;

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
              onClick={() => navigate('/users', { state: { openCreateModal: true } })}
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
              onClick={() => navigate('/students', { state: { openCreateModal: true } })}
            >
              <AddIcon sx={{ mr: 1 }} />
              Crear nuevo estudiante
            </Fab>
          </ShowForRole>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatsCards totalStudents={dashboard?.totalStudents} avgProgress={dashboard?.avgProgress} />
        <StatusPieChart data={dashboard?.statusDistribution ?? []} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <RegistrationLineChart data={dashboard?.last7Days ?? []} fullWidth={isInstructor} />
        <ShowForRole allowedRoles={["admin"]}>
          <InstructorRankingTable data={dashboard?.instructorRanking ?? []} />
        </ShowForRole>
      </div>
    </>
  )
}
