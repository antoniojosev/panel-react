import { useState, useEffect } from 'react'
import { Box, Button, CircularProgress, MenuItem, Select, TextField, Typography } from '@mui/material'
import Modal from '../../../components/ui/Modal'
import type { StudentCreateDTO, StudentStatus } from '../studentTypes'

const statuses: StudentStatus[] = ['activo', 'inactivo', 'completado', 'abandonado']

interface InstructorOption {
  id: string
  name: string
}

interface CreateStudentModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: StudentCreateDTO) => void
  isLoading: boolean
  instructors: InstructorOption[]
  isAdmin: boolean
  defaultInstructorId: string
}

export default function CreateStudentModal({ open, onClose, onSubmit, isLoading, instructors, isAdmin, defaultInstructorId }: CreateStudentModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [institution, setInstitution] = useState('')
  const [course, setCourse] = useState('')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<StudentStatus>('activo')
  const [instructorId, setInstructorId] = useState(defaultInstructorId)

  useEffect(() => {
    if (!isAdmin && defaultInstructorId) {
      setInstructorId(defaultInstructorId)
    }
  }, [isAdmin, defaultInstructorId])

  const handleClose = () => {
    setName('')
    setEmail('')
    setInstitution('')
    setCourse('')
    setProgress(0)
    setStatus('activo')
    setInstructorId(defaultInstructorId)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Typography variant="h6" sx={{ mb: 2 }}>Agregar estudiante</Typography>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
        <TextField label="Institucion" value={institution} onChange={(e) => setInstitution(e.target.value)} fullWidth />
        <TextField label="Curso asignado" value={course} onChange={(e) => setCourse(e.target.value)} fullWidth />
        <TextField type="number" label="Progreso" value={progress} onChange={(e) => setProgress(Number(e.target.value))} fullWidth />
        <Select value={status} onChange={(e) => setStatus(e.target.value as StudentStatus)} fullWidth>
          {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </Select>
        <Select value={instructorId} onChange={(e) => setInstructorId(e.target.value)} fullWidth displayEmpty disabled={!isAdmin}>
          <MenuItem value="" disabled>Seleccionar instructor</MenuItem>
          {instructors.map((i) => <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>)}
        </Select>
        <Button
          fullWidth variant="contained" disabled={isLoading}
          onClick={() => onSubmit({ name, email, institution, course, progress, status, instructorId })}
          sx={{ background: '#8000ff', color: '#fff', '&:hover': { background: '#6a00cc' } }}
        >
          {isLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Crear'}
        </Button>
      </Box>
    </Modal>
  )
}
