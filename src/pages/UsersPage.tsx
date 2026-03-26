import { useState, useEffect } from 'react'
import { Button, Box, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, TablePagination } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../features/users/hooks/useUsers'
import type { UserRole } from '../features/users/userTypes'
import { useLocation } from 'react-router-dom'
import CreateUserModal from '../features/users/components/CreateUserModal'
import EditUserModal from '../features/users/components/EditUserModal'
import UserDetailsModal from '../features/users/components/UserDetailsModal'
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal'
import FeedbackToast from '../components/ui/FeedbackToast'
import TableSkeleton from '../components/ui/TableSkeleton'
import { useFeedback } from '../hooks/useFeedback'
import { parseApiError } from '../utils/errorUtils'

interface EditUserState {
  id: string
  email: string
  name: string
  role: UserRole
}

interface SelectedUser {
  id: string
  email: string
  name: string
  role: UserRole
}

export default function UsersPage() {
  const location = useLocation()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const { data: users, isLoading: isLoadingUsers } = useUsers(page + 1, rowsPerPage, search)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const feedback = useFeedback()

  const [openModal, setOpenModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [detailsModal, setDetailsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null)
  const [userToDelete, setUserToDelete] = useState<SelectedUser | null>(null)
  const [editUser, setEditUser] = useState<EditUserState | null>(null)
  useEffect(() => {
    if (location.state?.openCreateModal) {
      setOpenModal(true)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleError = (error: unknown) => {
    feedback.showError(parseApiError(error))
  }

  const displayUsers = users?.data || []

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', minHeight: 0, padding: 1 }}>
        <div>
          <Typography variant="h4" gutterBottom>Usuarios</Typography>
          <Typography color='textDisabled' variant="subtitle1" gutterBottom>
            Gestiona la información de usuarios, roles y permisos para controlar el acceso a la plataforma
          </Typography>
          <TextField
            label="Buscar usuario"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            size="small"
            sx={{ mt: 1, mb: 2, width: 320 }}
            placeholder="Buscar por nombre, email o rol"
          />
        </div>

        <Card sx={{ mb: 3, backgroundColor: 'background.paper', boxShadow: 2, display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
          <TableContainer component={Box} sx={{ background: 'transparent', minHeight: 0, height: '80%', maxHeight: '80%', overflowY: 'auto', overflowX: 'auto' }}>
            <Table stickyHeader sx={{ minWidth: 600 }}>
              <TableHead sx={{ background: 'transparent', '& .MuiTableCell-head': { background: 'transparent', borderBottom: 'none' } }}>
                <TableRow sx={{ background: 'transparent' }}>
                  <TableCell sx={{ color: '#8000ff', fontWeight: 'bold', background: 'transparent' }}>Nombre completo</TableCell>
                  <TableCell sx={{ color: '#8000ff', fontWeight: 'bold', background: 'transparent' }}>Email</TableCell>
                  <TableCell sx={{ color: '#8000ff', fontWeight: 'bold', background: 'transparent' }}>Rol</TableCell>
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
              {isLoadingUsers ? <TableSkeleton rows={rowsPerPage} columns={4} /> : <TableBody>
                {displayUsers.map((user) => (
                  <TableRow key={user.id} sx={{ height: 56, cursor: 'pointer' }} onClick={() => { setSelectedUser({ id: user.id, email: user.email, name: user.name, role: user.role }); setDetailsModal(true) }}>
                    <TableCell sx={{ height: 56, py: 0 }}>{user.name}</TableCell>
                    <TableCell sx={{ height: 56, py: 0 }}>{user.email}</TableCell>
                    <TableCell sx={{ height: 56, py: 0 }}>{user.role}</TableCell>
                    <TableCell align="right" sx={{ p: 0, height: 56 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', alignItems: 'center', width: '100%', height: 56 }}>
                        <Button
                          color="primary"
                          onClick={(e) => { e.stopPropagation(); setEditUser({ id: user.id, email: user.email, name: user.name, role: user.role }); setEditModal(true) }}
                          size="small"
                          sx={{ minWidth: 32, width: 32, height: 32, p: 0 }}
                        >
                          <EditIcon fontSize="small" />
                        </Button>
                        <Button
                          color="error"
                          onClick={(e) => { e.stopPropagation(); setUserToDelete({ id: user.id, email: user.email, name: user.name, role: user.role }); setDeleteModal(true) }}
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
              count={users?.meta?.total || 0}
              page={page}
              onPageChange={(_e, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Filas por página"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </TableContainer>
        </Card>

        <CreateUserModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          isLoading={createUser.isPending}
          onSubmit={(data) => {
            createUser.mutate(data, {
              onSuccess: () => { setOpenModal(false); feedback.showSuccess('Usuario creado exitosamente') },
              onError: handleError,
            })
          }}
        />

        <EditUserModal
          open={editModal}
          user={editUser}
          onClose={() => { setEditModal(false); setEditUser(null) }}
          onChange={setEditUser}
          isLoading={updateUser.isPending}
          onSubmit={(id, values) => {
            updateUser.mutate({ id, values }, {
              onSuccess: () => { setEditModal(false); setEditUser(null); feedback.showSuccess('Usuario actualizado exitosamente') },
              onError: handleError,
            })
          }}
        />

        <DeleteConfirmModal
          open={deleteModal}
          entityName={userToDelete?.name}
          entityLabel="al usuario"
          onClose={() => { setDeleteModal(false); setUserToDelete(null) }}
          isLoading={deleteUser.isPending}
          onConfirm={() => {
            if (userToDelete) {
              deleteUser.mutate(userToDelete.id, {
                onSuccess: () => { setDeleteModal(false); setUserToDelete(null); feedback.showSuccess('Usuario eliminado exitosamente') },
                onError: (error) => { handleError(error); setDeleteModal(false); setUserToDelete(null) },
              })
            }
          }}
        />

        <UserDetailsModal
          open={detailsModal}
          user={selectedUser}
          onClose={() => { setDetailsModal(false); setSelectedUser(null) }}
        />
      </Box>

      <FeedbackToast open={feedback.open} message={feedback.message} severity={feedback.severity} onClose={feedback.close} />
    </>
  )
}
