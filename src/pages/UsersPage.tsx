import { useState, useEffect } from 'react'
import { Button, Box, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, Select, MenuItem, TablePagination } from '@mui/material'
import ErrorToast from '../components/ui/ErrorToast'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Modal from '../components/ui/Modal'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../features/users/hooks/useUsers'
import type { UserCreateDTO, UserUpdateDTO } from '../features/users/userTypes'
import { useLocation } from 'react-router-dom'

export default function UsersPage() {
  const location = useLocation();
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const { data: users } = useUsers(page + 1, rowsPerPage, search)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'instructor'>('instructor')
  const [openModal, setOpenModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [detailsModal, setDetailsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<null | { id: string; email: string; name: string; role: 'admin' | 'instructor' }>(null)
  const [userToDelete, setUserToDelete] = useState<any>(null)
  const [editUser, setEditUser] = useState<UserUpdateDTO & { id?: string } | null>(null)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorDialogMessage, setErrorDialogMessage] = useState('')

  // Detectar si se debe abrir el modal de creación desde el dashboard
  useEffect(() => {
    if (location.state?.openCreateModal) {
      setOpenModal(true);
      // Limpiar el state para evitar que se abra en futuras navegaciones
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const newUserInput: UserCreateDTO = {
    email,
    password,
    name: fullName,
    role,
  }

  // Funciones para cerrar modales y limpiar formularios
  const handleCloseCreateModal = () => {
    setOpenModal(false)
    setEmail('')
    setFullName('')
    setPassword('')
    setRole('instructor')
  }

  const handleOpenDetailsModal = (user: { id: string; email: string; name: string; role: 'admin' | 'instructor' }) => {
    setSelectedUser(user)
    setDetailsModal(true)
  }

  const handleCloseDetailsModal = () => {
    setDetailsModal(false)
    setSelectedUser(null)
  }

  // Error dialog handler
  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false)
    setErrorDialogMessage('')
  }

  const handleCloseEditModal = () => {
    setEditModal(false)
    setEditUser(null)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModal(false)
    setUserToDelete(null)
  }

  // Handlers for pagination and search
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(0)
  }

  const displayUsers = users?.data || []

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', minHeight: 0, padding: 1 }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Usuarios
          </Typography>
          <Typography color='textDisabled' variant="subtitle1" gutterBottom>
            Gestiona la información de usuarios, roles y permisos para controlar el acceso a la plataforma
          </Typography>
          <TextField
            label="Buscar usuario"
            value={search}
            onChange={handleSearchChange}
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
              <TableBody>
                {displayUsers.map((user) => (
                  <TableRow key={user.id} sx={{ height: 56, cursor: 'pointer' }} onClick={() => handleOpenDetailsModal({ id: user.id, email: user.email, name: user.name, role: user.role })}>
                    <TableCell sx={{ height: 56, maxHeight: 56, minHeight: 56, py: 0 }}>{user.name}</TableCell>
                    <TableCell sx={{ height: 56, maxHeight: 56, minHeight: 56, py: 0 }}>{user.email}</TableCell>
                    <TableCell sx={{ height: 56, maxHeight: 56, minHeight: 56, py: 0 }}>{user.role}</TableCell>
                    <TableCell align="right" sx={{ p: 0, height: 56, maxHeight: 56, minHeight: 56 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', alignItems: 'center', width: '100%', height: 56 }}>
                        <Button 
                          color="primary" 
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditUser({
                              id: user.id,
                              email: user.email,
                              name: user.name,
                              role: user.role,
                            })
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
                            setUserToDelete(user)
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
              count={users?.meta?.total || 0}
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

        <Modal open={openModal} onClose={handleCloseCreateModal}>
          <Typography variant="h6" sx={{ mb: 2 }}>Crear nuevo usuario</Typography>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth />
            <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
            <Select value={role} onChange={(e) => setRole(e.target.value as 'admin' | 'instructor')} fullWidth>
              <MenuItem value="admin">admin</MenuItem>
              <MenuItem value="instructor">instructor</MenuItem>
            </Select>
            <Button
              fullWidth
              variant="contained"
              onClick={async () => {
                createUser.mutate(newUserInput, {
                  onSuccess: () => {
                    handleCloseCreateModal()
                  },
                  onError: (error: any) => {
                    let msg = 'Error desconocido'
                    if (error?.response?.data?.message) {
                      msg = error.response.data.message
                    } else if (error?.message) {
                      try {
                        const parsed = JSON.parse(error.message)
                        msg = parsed.message || error.message
                      } catch {
                        msg = error.message
                      }
                    }
                    setErrorDialogMessage(msg)
                    setErrorDialogOpen(true)
                  }
                })
              }}
              sx={{ background: '#8000ff', color: '#fff', '&:hover': { background: '#6a00cc' } }}
            >
              Crear
            </Button>
          </Box>
        </Modal>

        {/* Modal de edición */}
        <Modal open={editModal} onClose={handleCloseEditModal}>
          <Typography variant="h6" sx={{ mb: 2 }}>Editar usuario</Typography>
          {editUser && (
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <TextField
                label="Email"
                value={editUser.email}
                onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                fullWidth
              />
              <TextField
                label="Nombre completo"
                value={editUser.name}
                onChange={e => setEditUser({ ...editUser, name: e.target.value })}
                fullWidth
              />
              <Select
                value={editUser.role}
                onChange={e => setEditUser({ ...editUser, role: e.target.value as 'admin' | 'instructor' })}
                fullWidth
              >
                <MenuItem value="admin">admin</MenuItem>
                <MenuItem value="instructor">instructor</MenuItem>
              </Select>
              <Button
                fullWidth
                variant="contained"
                sx={{ background: '#8000ff', color: '#fff', '&:hover': { background: '#6a00cc' } }}
                onClick={async () => {
                  if (editUser?.id) {
                    const updateData = {
                      name: editUser.name,
                      email: editUser.email,
                      role: editUser.role,
                    };
                    updateUser.mutate({
                      id: editUser.id,
                      values: updateData
                    }, {
                      onSuccess: () => {
                        handleCloseEditModal()
                      },
                      onError: (error: any) => {
                        let msg = 'Error desconocido'
                        if (error?.response?.data?.message) {
                          msg = error.response.data.message
                        } else if (error?.message) {
                          try {
                            const parsed = JSON.parse(error.message)
                            msg = parsed.message || error.message
                          } catch {
                            msg = error.message
                          }
                        }
                        setErrorDialogMessage(msg)
                        setErrorDialogOpen(true)
                      }
                    })
                  }
                }}
              >
                Guardar cambios
              </Button>
            </Box>
          )}
        </Modal>

        {/* Modal de confirmación de eliminación */}
        <Modal open={deleteModal} onClose={handleCloseDeleteModal}>
          <Typography variant="h6" sx={{ mb: 2 }}>Confirmar eliminación</Typography>
          <Typography sx={{ mb: 3 }}>
            ¿Estás seguro de que quieres eliminar al usuario "{userToDelete?.name}"? Esta acción no se puede deshacer.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseDeleteModal}>Cancelar</Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                if (userToDelete) {
                  deleteUser.mutate(userToDelete.id, {
                    onSuccess: () => {
                      handleCloseDeleteModal()
                    },
                    onError: (error: any) => {
                      let msg = 'Error desconocido'
                      if (error?.message) {
                        msg = error.message
                      } else if (error?.response?.data?.message) {
                        msg = error.response.data.message
                      }
                      setErrorDialogMessage(msg)
                      setErrorDialogOpen(true)
                      handleCloseDeleteModal()
                    }
                  })
                } else {
                  handleCloseDeleteModal()
                }
              }}
            >
              Eliminar
            </Button>
          </Box>
        </Modal>
      </Box>
      <Modal open={detailsModal} onClose={handleCloseDetailsModal}>
        <Typography variant="h6" sx={{ mb: 2 }}>Detalle de usuario</Typography>
        {selectedUser ? (
          <Box sx={{ display: 'grid', gap: 1 }}>
            <Typography><strong>Nombre:</strong> {selectedUser.name}</Typography>
            <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
            <Typography><strong>Rol:</strong> {selectedUser.role}</Typography>
            <Button variant="contained" onClick={handleCloseDetailsModal} sx={{ mt: 2 }}>
              Cerrar
            </Button>
          </Box>
        ) : (
          <Typography>No hay usuario seleccionado</Typography>
        )}
      </Modal>
      <ErrorToast open={errorDialogOpen} message={errorDialogMessage} onClose={handleErrorDialogClose} />
    </>
  )
}
