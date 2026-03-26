import { Box, Button, Typography } from '@mui/material'
import Modal from '../../../components/ui/Modal'
import type { Student } from '../studentTypes'

interface StudentDetailsModalProps {
  open: boolean
  student: Student | null
  onClose: () => void
}

export default function StudentDetailsModal({ open, student, onClose }: StudentDetailsModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Typography variant="h6" sx={{ mb: 2 }}>Detalle de estudiante</Typography>
      {student ? (
        <Box sx={{ display: 'grid', gap: 1 }}>
          <Typography><strong>Nombre:</strong> {student.name}</Typography>
          <Typography><strong>Email:</strong> {student.email}</Typography>
          <Typography><strong>Institucion:</strong> {student.institution}</Typography>
          <Typography><strong>Curso:</strong> {student.course}</Typography>
          <Typography><strong>Progreso:</strong> {student.progress}%</Typography>
          <Typography><strong>Estado:</strong> {student.status}</Typography>
          <Typography><strong>Instructor:</strong> {student.instructor?.name ?? student.instructorName}</Typography>
          <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>Cerrar</Button>
        </Box>
      ) : (
        <Typography>No hay estudiante seleccionado</Typography>
      )}
    </Modal>
  )
}
