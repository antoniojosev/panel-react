import { useState, useEffect } from 'react'
import { Box, TextField, Typography } from '@mui/material'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../features/users/hooks/useUsers'
import type { UserRole } from '../features/users/userTypes'
import { useLocation } from 'react-router-dom'
import UsersTable from '../features/users/components/UsersTable'
import CreateUserModal from '../features/users/components/CreateUserModal'
import EditUserModal from '../features/users/components/EditUserModal'
import UserDetailsModal from '../features/users/components/UserDetailsModal'
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal'
import FeedbackToast from '../components/ui/FeedbackToast'
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
  const { data: users, isLoading } = useUsers(page + 1, rowsPerPage, search)
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

        <UsersTable
          users={users?.data || []}
          isLoading={isLoading}
          total={users?.meta?.total || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(rpp) => { setRowsPerPage(rpp); setPage(0) }}
          onAdd={() => setOpenModal(true)}
          onEdit={(user) => { setEditUser(user); setEditModal(true) }}
          onDelete={(user) => { setUserToDelete(user); setDeleteModal(true) }}
          onSelect={(user) => { setSelectedUser(user); setDetailsModal(true) }}
        />

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
