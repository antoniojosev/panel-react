import { Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, TablePagination } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import TableSkeleton from '../../../components/ui/TableSkeleton'
import type { Student } from '../studentTypes'

interface StudentsTableProps {
  students: Student[]
  isLoading: boolean
  total: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  onAdd: () => void
  onEdit: (student: Student) => void
  onDelete: (student: Student) => void
  onSelect: (student: Student) => void
}

export default function StudentsTable({ students, isLoading, total, page, rowsPerPage, onPageChange, onRowsPerPageChange, onAdd, onEdit, onDelete, onSelect }: StudentsTableProps) {
  return (
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
                  onClick={onAdd}
                  sx={{ backgroundColor: 'background.paper', color: 'primary.main', minWidth: 0, p: 1, boxShadow: 1, border: '1px solid', borderColor: 'primary.main', '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <AddIcon />
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          {isLoading ? <TableSkeleton rows={rowsPerPage} columns={8} /> : (
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} sx={{ height: 56, cursor: 'pointer' }} onClick={() => onSelect(student)}>
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
                        onClick={(e) => { e.stopPropagation(); onEdit(student) }}
                        size="small"
                        sx={{ minWidth: 32, width: 32, height: 32, p: 0 }}
                      >
                        <EditIcon fontSize="small" />
                      </Button>
                      <Button
                        color="error"
                        onClick={(e) => { e.stopPropagation(); onDelete(student) }}
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
          )}
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_e, p) => onPageChange(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>
    </Card>
  )
}
