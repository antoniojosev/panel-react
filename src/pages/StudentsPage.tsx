import { useMemo, useState, useEffect } from 'react'
import { Button, Box, Card, MenuItem, Select, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Modal from '../components/ui/Modal'
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from '../features/students/hooks/useStudents'
import { useUsers } from '../features/users/hooks/useUsers'
import { useProfile } from '../features/auth/hooks/useAuth'
import type { StudentCreateDTO, StudentStatus } from '../features/students/studentTypes'
import { useLocation } from 'react-router-dom'
import { useHasRole } from '../utils/roleUtils'

const statuses: StudentStatus[] = ['activo', 'inactivo', 'completado', 'abandonado']

export default function StudentsPage() {
  const location = useLocation();
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const { data: students } = useStudents(page + 1, rowsPerPage, search) // API usa 1-based indexing
  const { data: user } = useProfile()
  const isAdmin = useHasRole(['admin'])
  // Solo consultar todos los usuarios si es admin
  const { data: users } = isAdmin ? useUsers() : { data: null }
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()
  const deleteStudent = useDeleteStudent()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [institution, setInstitution] = useState('')
  const [assignedCourse, setAssignedCourse] = useState('VR Intro')
  const [assignedInstructorId, setAssignedInstructorId] = useState('')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<StudentStatus>('activo')
  const [openModal, setOpenModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<any>(null)
  const [editStudent, setEditStudent] = useState<any>(null)
  const [detailsStudent, setDetailsStudent] = useState<any>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  // Detectar si se debe abrir el modal de creación desde el dashboard
  useEffect(() => {
    if (location.state?.openCreateModal) {
      setOpenModal(true);
      // Limpiar el state para evitar que se abra en futuras navegaciones
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Filtrar instructores
  const instructors = useMemo(() => {
    if (isAdmin) {
      if (!users) return []
      return users.data.filter(user => user.role === 'instructor')
    } else if (user) {
      return [{ id: user.id, name: user.name }]
    }
    return []
  }, [users, user, isAdmin])

  // Si el usuario es instructor, autoseleccionar su ID para el nuevo estudiante
  useEffect(() => {
    if (!isAdmin && user?.id) {
      setAssignedInstructorId(user.id)
    }
  }, [isAdmin, user])

  // Funciones para cerrar modales y limpiar formularios
  const handleCloseCreateModal = () => {
    setOpenModal(false)
    setName('')
    setEmail('')
    setInstitution('')
    setAssignedCourse('VR Intro')
    setProgress(0)
    setStatus('activo')
    setAssignedInstructorId('')
  }

  const handleOpenDetailsModal = (student: any) => {
    setDetailsStudent(student)
    setDetailsModalOpen(true)
  }

  const handleCloseDetailsModal = () => {
    setDetailsStudent(null)
    setDetailsModalOpen(false)
  }

  const handleCloseEditModal = () => {
    setEditModal(false)
    setEditStudent(null)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModal(false)
    setStudentToDelete(null)
  }

  const newStudentInput: StudentCreateDTO = {
    name,
    email,
    institution,
    course: assignedCourse,
    progress,
    status,
    instructorId: assignedInstructorId,
  }

  // Los estudiantes ya vienen filtrados desde la API
  const displayStudents = students?.data || []

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(0) // Reset to first page when searching
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', minHeight: 0, padding: 1 }}>
      <div>
        <Typography variant="h4" gutterBottom>
          Estudiantes
        </Typography>
        <Typography color='textDisabled' variant="subtitle1" gutterBottom>
          Gestiona la información de estudiantes, cursos y progreso
        </Typography>
        <TextField
          label="Buscar estudiante"
          value={search}
          onChange={handleSearchChange}
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
                <TableCell sx={{ color: '#8000ff', fontWeight: 'bold', background: 'transparent', display: { xs: 'none', sm: 'table-cell' } }}>Institución</TableCell>
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

            <TableBody>
              {displayStudents.map((student) => (
                <TableRow key={student.id} sx={{ height: 56, cursor: 'pointer' }} onClick={() => handleOpenDetailsModal(student)}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{student.institution}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{student.progress}%</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{student.status}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{student.instructor.name}</TableCell>
                  <TableCell align="right" sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                      <Button 
                        color="primary" 
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditStudent(student)
                          setEditModal(true)
                        }}
                        size="small"
                        sx={{ minWidth: 32, width: 32, height: 32, p: 0 }}
                      >
                        <EditIcon fontSize="small" />
                      </Button>
                      <Button 
                        color="error" 
                        onClick={(e) => {
                          e.stopPropagation()
                          setStudentToDelete(student)
                          setDeleteModal(true)
                        }}
                        size="small"
                        sx={{ minWidth: 32, width: 32, height: 32, p: 0 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={students?.meta?.total || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por página"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </TableContainer>
      </Card>

      {/* Modal de crear estudiante */}
      <Modal open={openModal} onClose={handleCloseCreateModal}>
        <Typography variant="h6" sx={{ mb: 2 }}>Agregar estudiante</Typography>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Institución" value={institution} onChange={(e) => setInstitution(e.target.value)} fullWidth />
          <TextField label="Curso asignado" value={assignedCourse} onChange={(e) => setAssignedCourse(e.target.value)} fullWidth />
          <TextField type="number" label="Progreso" value={progress} onChange={(e) => setProgress(Number(e.target.value))} fullWidth />
          <Select value={status} onChange={(e) => setStatus(e.target.value as StudentStatus)} fullWidth>
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>

          <Select 
            value={assignedInstructorId} 
            onChange={(e) => setAssignedInstructorId(e.target.value)} 
            fullWidth
            displayEmpty
            disabled={!isAdmin}
          >
            <MenuItem value="" disabled>Seleccionar instructor</MenuItem>
            {instructors.map((instructor) => (
              <MenuItem key={instructor.id} value={instructor.id}>
                {instructor.name}
              </MenuItem>
            ))}
          </Select>

          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              createStudent.mutate(newStudentInput)
              handleCloseCreateModal()
            }}
            sx={{ background: '#8000ff', color: '#fff', '&:hover': { background: '#6a00cc' } }}
          >
            Crear
          </Button>
        </Box>
      </Modal>

      {/* Modal de edición */}
      <Modal open={editModal} onClose={handleCloseEditModal}>
        <Typography variant="h6" sx={{ mb: 2 }}>Editar estudiante</Typography>
        {editStudent && (
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <TextField label="Nombre" value={editStudent.name} onChange={e => setEditStudent({ ...editStudent, name: e.target.value })} fullWidth />
            <TextField label="Email" value={editStudent.email} onChange={e => setEditStudent({ ...editStudent, email: e.target.value })} fullWidth />
            <TextField label="Institución" value={editStudent.institution} onChange={e => setEditStudent({ ...editStudent, institution: e.target.value })} fullWidth />
            <TextField label="Curso asignado" value={editStudent.course} onChange={e => setEditStudent({ ...editStudent, course: e.target.value })} fullWidth />
            <TextField type="number" label="Progreso" value={editStudent.progress} onChange={e => setEditStudent({ ...editStudent, progress: Number(e.target.value) })} fullWidth />
            <Select value={editStudent.status} onChange={e => setEditStudent({ ...editStudent, status: e.target.value as StudentStatus })} fullWidth>
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>

            <Select 
              value={editStudent.instructorId} 
              onChange={e => setEditStudent({ ...editStudent, instructorId: e.target.value })} 
              fullWidth
              displayEmpty
              disabled={!isAdmin}
            >
              <MenuItem value="" disabled>Seleccionar instructor</MenuItem>
              {instructors.map((instructor) => (
                <MenuItem key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </MenuItem>
              ))}
            </Select>

            <Button
              fullWidth
              variant="contained"
              sx={{ background: '#8000ff', color: '#fff', '&:hover': { background: '#6a00cc' } }}
              onClick={() => {
                const id = editStudent.id;

                // Crear objeto de actualización con solo los campos permitidos
                const updateData: any = {
                  name: editStudent.name,
                  email: editStudent.email,
                  institution: editStudent.institution,
                  course: editStudent.course,
                  progress: editStudent.progress,
                  status: editStudent.status,
                };

                // Instructor no puede reasignar instructorId en edición
                if (isAdmin) {
                  updateData.instructorId = editStudent.instructorId
                }

                updateStudent.mutate({ 
                  id, 
                  values: updateData
                })
                
                handleCloseEditModal()
              }}
            >
              Guardar cambios
            </Button>
          </Box>
        )}
      </Modal>

      {/* Modal de detalle de estudiante */}
      <Modal open={detailsModalOpen} onClose={handleCloseDetailsModal}>
        <Typography variant="h6" sx={{ mb: 2 }}>Detalle de estudiante</Typography>
        {detailsStudent ? (
          <Box sx={{ display: 'grid', gap: 1 }}>
            <Typography><strong>Nombre:</strong> {detailsStudent.name}</Typography>
            <Typography><strong>Email:</strong> {detailsStudent.email}</Typography>
            <Typography><strong>Institución:</strong> {detailsStudent.institution}</Typography>
            <Typography><strong>Curso:</strong> {detailsStudent.course}</Typography>
            <Typography><strong>Progreso:</strong> {detailsStudent.progress}%</Typography>
            <Typography><strong>Estado:</strong> {detailsStudent.status}</Typography>
            <Typography><strong>Instructor:</strong> {detailsStudent.instructor?.name}</Typography>
            <Button variant="contained" onClick={handleCloseDetailsModal} sx={{ mt: 2 }}>
              Cerrar
            </Button>
          </Box>
        ) : (
          <Typography>No hay estudiante seleccionado</Typography>
        )}
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal open={deleteModal} onClose={handleCloseDeleteModal}>
        <Typography variant="h6" sx={{ mb: 2 }}>Confirmar eliminación</Typography>
        <Typography sx={{ mb: 3 }}>
          ¿Estás seguro de que quieres eliminar al estudiante "{studentToDelete?.name}"? Esta acción no se puede deshacer.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={handleCloseDeleteModal}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (studentToDelete) {
                deleteStudent.mutate(studentToDelete.id)
              }
              handleCloseDeleteModal()
            }}
          >
            Eliminar
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}
