import { useMemo, useState, useEffect } from 'react'
import { Box, TextField, Typography } from '@mui/material'
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from '../features/students/hooks/useStudents'
import { useUsers } from '../features/users/hooks/useUsers'
import { useProfile } from '../features/auth/hooks/useAuth'
import type { Student } from '../features/students/studentTypes'
import { useLocation } from 'react-router-dom'
import { useHasRole } from '../utils/roleUtils'
import StudentsTable from '../features/students/components/StudentsTable'
import CreateStudentModal from '../features/students/components/CreateStudentModal'
import EditStudentModal from '../features/students/components/EditStudentModal'
import StudentDetailsModal from '../features/students/components/StudentDetailsModal'
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal'
import FeedbackToast from '../components/ui/FeedbackToast'
import { useFeedback } from '../hooks/useFeedback'
import { parseApiError } from '../utils/errorUtils'

export default function StudentsPage() {
  const location = useLocation()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const { data: students, isLoading } = useStudents(page + 1, rowsPerPage, search)
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

  const handleError = (error: unknown) => {
    feedback.showError(parseApiError(error))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', minHeight: 0, padding: 1 }}>
      <div>
        <Typography variant="h4" gutterBottom>Estudiantes</Typography>
        <Typography color='textDisabled' variant="subtitle1" gutterBottom>
          Gestiona la información de estudiantes, cursos y progreso
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

      <StudentsTable
        students={students?.data || []}
        isLoading={isLoading}
        total={students?.meta?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(rpp) => { setRowsPerPage(rpp); setPage(0) }}
        onAdd={() => setOpenModal(true)}
        onEdit={(student) => { setEditStudent(student); setEditModal(true) }}
        onDelete={(student) => { setStudentToDelete(student); setDeleteModal(true) }}
        onSelect={(student) => { setDetailsStudent(student); setDetailsModalOpen(true) }}
      />

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
            onError: handleError,
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
            onError: handleError,
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
              onError: (error) => { handleError(error); setDeleteModal(false); setStudentToDelete(null) },
            })
          }
        }}
      />

      <FeedbackToast open={feedback.open} message={feedback.message} severity={feedback.severity} onClose={feedback.close} />
    </Box>
  )
}
