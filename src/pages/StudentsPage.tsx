import { useMemo, useState, useEffect } from 'react'
import { Button, Box, Card, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from '../features/students/hooks/useStudents'
import { useUsers } from '../features/users/hooks/useUsers'
import { useProfile } from '../features/auth/hooks/useAuth'
import type { Student } from '../features/students/studentTypes'
import { useLocation } from 'react-router-dom'
import { useHasRole } from '../utils/roleUtils'
import CreateStudentModal from '../features/students/components/CreateStudentModal'
import EditStudentModal from '../features/students/components/EditStudentModal'
import StudentDetailsModal from '../features/students/components/StudentDetailsModal'
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal'
import FeedbackToast from '../components/ui/FeedbackToast'
import TableSkeleton from '../components/ui/TableSkeleton'
import { useFeedback } from '../hooks/useFeedback'
import { parseApiError } from '../utils/errorUtils'

export default function StudentsPage() {
  const location = useLocation()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const { data: students, isLoading: isLoadingStudents } = useStudents(page + 1, rowsPerPage, search)
  const { data: user } = useProfile()
  const isAdmin = useHasRole(['admin'])
  const { data: usersData } = isAdmin ? useUsers() : { data: null }
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()
  const deleteStudent = useDeleteStudent()
  const feedback = useFeedback()

  const [openModal, setOpenModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [editStudent, setEditStudent] = useState<Student | null>(null)
  const [detailsStudent, setDetailsStudent] = useState<Student | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  useEffect(() => {
    if (location.state?.openCreateModal) {
      setOpenModal(true)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const instructors = useMemo(() => {
    if (isAdmin && usersData) {
      return usersData.data.filter(u => u.role === 'instructor').map(u => ({ id: u.id, name: u.name }))
    }
    if (user) {
      return [{ id: user.id, name: user.name }]
    }
    return []
  }, [usersData, user, isAdmin])

  const displayStudents = students?.data || []

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', minHeight: 0, padding: 1 }}>
      <div>
        <Typography variant="h4" gutterBottom>Estudiantes</Typography>
        <Typography color='textDisabled' variant="subtitle1" gutterBottom>
          Gestiona la informacion de estudiantes, cursos y progreso
        </Typography>
        <TextField
          label="Buscar estudiante"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          size="small"
          sx={{ mt: 1, mb: 2, width: 320 }}
          placeholder="Buscar por nombre, email, curso, status..."
        />
      </div>

      <Card sx={{ mb: 3, backgroundColor: 'background.paper', boxShadow: 2, display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
        <TableContainer component={Box} sx={{ background: 'transparent', minHeight: 0, height: '80%', maxHeight: '80%', overflowY: 'auto', overflowX: 'auto' }}>
          <Table stickyHeader sx={{ minWidth: 600 }}>
            <TableHead sx={{ background: 'transparent', '& .MuiTableCell-head': { background: 'transparent', borderBottom: 'none' } }}>
              <TableRow sx={{ background: 'transparent' }}>
                <TableCell sx={{ color: '#8000ff', fontWeight: 'bold', background: 'transparent' }}>Nombre</TableCell>
                <TableCell sx={{ color: '#8000ff', fontWeight: 'bold', background: 'transparent' }}>Email</TableCell>
                <TableCell sx={{ color: '#8000ff', fontWeight: 'bold', background: 'transparent', display: { xs: 'none', sm: 'table-cell' } }}>Institucion</TableCell>
                <TableCell sx={{ color: '#8000ff', fontWeight: 'bold', background: 'transparent' }}>Curso</TableCell>
                <TableCell sx={{ color: '#8000ff', fontWeight: 'bold', background: 'transparent' }}>Progreso</TableCell>
                <TableCell sx={{ color: '#8000ff', fontWeight: 'bold', background: 'transparent', display: { xs: 'none', md: 'table-cell' } }}>Status</TableCell>
                <TableCell sx={{ color: '#8000ff', fontWeight: 'bold', background: 'transparent', display: { xs: 'none', lg: 'table-cell' } }}>Instructor</TableCell>
                <TableCell align="right" sx={{ background: 'transparent' }}>
                  <Button
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                    sx={{ backgroundColor: 'background.paper', color: 'primary.main', minWidth: 0, p: 1, boxShadow: 1, border: '1px solid', borderColor: 'primary.main', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <AddIcon />
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            {isLoadingStudents ? <TableSkeleton rows={rowsPerPage} columns={8} /> : <TableBody>
              {displayStudents.map((student) => (
                <TableRow key={student.id} sx={{ height: 56, cursor: 'pointer' }} onClick={() => { setDetailsStudent(student); setDetailsModalOpen(true) }}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{student.institution}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{student.progress}%</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{student.status}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{student.instructor?.name ?? student.instructorName}</TableCell>
                  <TableCell align="right" sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                      <Button
                        color="primary"
                        onClick={(e) => { e.stopPropagation(); setEditStudent(student); setEditModal(true) }}
                        size="small"
                        sx={{ minWidth: 32, width: 32, height: 32, p: 0 }}
                      >
                        <EditIcon fontSize="small" />
                      </Button>
                      <Button
                        color="error"
                        onClick={(e) => { e.stopPropagation(); setStudentToDelete(student); setDeleteModal(true) }}
                        size="small"
                        sx={{ minWidth: 32, width: 32, height: 32, p: 0 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>}
          </Table>
          <TablePagination
            component="div"
            count={students?.meta?.total || 0}
            page={page}
            onPageChange={(_e, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por pagina"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </TableContainer>
      </Card>

      <CreateStudentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        isLoading={createStudent.isPending}
        instructors={instructors}
        isAdmin={isAdmin}
        defaultInstructorId={user?.id ?? ''}
        onSubmit={(data) => {
          createStudent.mutate(data, {
            onSuccess: () => { setOpenModal(false); feedback.showSuccess('Estudiante creado exitosamente') },
            onError: (error: unknown) => feedback.showError(parseApiError(error)),
          })
        }}
      />

      <EditStudentModal
        open={editModal}
        student={editStudent}
        onClose={() => { setEditModal(false); setEditStudent(null) }}
        onChange={setEditStudent}
        isLoading={updateStudent.isPending}
        instructors={instructors}
        isAdmin={isAdmin}
        onSubmit={(id, values) => {
          updateStudent.mutate({ id, values }, {
            onSuccess: () => { setEditModal(false); setEditStudent(null); feedback.showSuccess('Estudiante actualizado exitosamente') },
            onError: (error: unknown) => feedback.showError(parseApiError(error)),
          })
        }}
      />

      <StudentDetailsModal
        open={detailsModalOpen}
        student={detailsStudent}
        onClose={() => { setDetailsStudent(null); setDetailsModalOpen(false) }}
      />

      <DeleteConfirmModal
        open={deleteModal}
        entityName={studentToDelete?.name}
        entityLabel="al estudiante"
        onClose={() => { setDeleteModal(false); setStudentToDelete(null) }}
        isLoading={deleteStudent.isPending}
        onConfirm={() => {
          if (studentToDelete) {
            deleteStudent.mutate(studentToDelete.id, {
              onSuccess: () => { setDeleteModal(false); setStudentToDelete(null); feedback.showSuccess('Estudiante eliminado exitosamente') },
              onError: (error: unknown) => { feedback.showError(parseApiError(error)); setDeleteModal(false); setStudentToDelete(null) },
            })
          }
        }}
      />
      <FeedbackToast open={feedback.open} message={feedback.message} severity={feedback.severity} onClose={feedback.close} />
    </Box>
  )
}
