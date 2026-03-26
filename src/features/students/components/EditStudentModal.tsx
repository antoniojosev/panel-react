import { Box, Button, CircularProgress, MenuItem, Select, TextField, Typography } from '@mui/material'
import Modal from '../../../components/ui/Modal'
import type { Student, StudentStatus, StudentUpdateDTO } from '../studentTypes'

const statuses: StudentStatus[] = ['activo', 'inactivo', 'completado', 'abandonado']

interface InstructorOption {
  id: string
  name: string
}

interface EditStudentModalProps {
  open: boolean
  student: Student | null
  onClose: () => void
  onChange: (student: Student) => void
  onSubmit: (id: string, values: StudentUpdateDTO) => void
  isLoading: boolean
  instructors: InstructorOption[]
  isAdmin: boolean
}

export default function EditStudentModal({ open, student, onClose, onChange, onSubmit, isLoading, instructors, isAdmin }: EditStudentModalProps) {
  if (!student) return null

  const handleSubmit = () => {
    const updateData: StudentUpdateDTO = {
      name: student.name,
      email: student.email,
      institution: student.institution,
      course: student.course,
      progress: student.progress,
      status: student.status,
    }
    if (isAdmin) {
      updateData.instructorId = student.instructorId
    }
    onSubmit(student.id, updateData)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Typography variant="h6" sx={{ mb: 2 }}>Editar estudiante</Typography>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <TextField label="Nombre" value={student.name} onChange={e => onChange({ ...student, name: e.target.value })} fullWidth />
        <TextField label="Email" value={student.email} onChange={e => onChange({ ...student, email: e.target.value })} fullWidth />
        <TextField label="Institucion" value={student.institution} onChange={e => onChange({ ...student, institution: e.target.value })} fullWidth />
        <TextField label="Curso asignado" value={student.course} onChange={e => onChange({ ...student, course: e.target.value })} fullWidth />
        <TextField type="number" label="Progreso" value={student.progress} onChange={e => onChange({ ...student, progress: Number(e.target.value) })} fullWidth />
        <Select value={student.status} onChange={e => onChange({ ...student, status: e.target.value as StudentStatus })} fullWidth>
          {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </Select>
        <Select value={student.instructorId} onChange={e => onChange({ ...student, instructorId: e.target.value })} fullWidth displayEmpty disabled={!isAdmin}>
          <MenuItem value="" disabled>Seleccionar instructor</MenuItem>
          {instructors.map((i) => <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>)}
        </Select>
        <Button
          fullWidth variant="contained" disabled={isLoading}
          onClick={handleSubmit}
          sx={{ background: '#8000ff', color: '#fff', '&:hover': { background: '#6a00cc' } }}
        >
          {isLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Guardar cambios'}
        </Button>
      </Box>
    </Modal>
  )
}
