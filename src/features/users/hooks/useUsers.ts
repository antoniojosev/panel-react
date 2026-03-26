import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../services/usersApi'
import type { UserCreateDTO, UserUpdateDTO } from '../userTypes'

export function useUsers(page?: number, limit?: number, search?: string) {
  return useQuery({
    queryKey: ['users', page, limit, search],
    queryFn: () => getUsers(page, limit, search),
    staleTime: 1000 * 60 * 3,
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: Boolean(id),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UserCreateDTO) => createUser(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: UserUpdateDTO }) => updateUser(id, values),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}
