import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createStudent, deleteStudent, getStudentById, getStudents, updateStudent } from '../services/studentsApi'
import type { StudentCreateDTO, StudentUpdateDTO } from '../studentTypes'

export function useStudents(page?: number, limit?: number, search?: string) {
  return useQuery({
    queryKey: ['students', page, limit, search],
    queryFn: () => getStudents(page, limit, search),
    staleTime: 1000 * 60 * 3,
  })
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => getStudentById(id),
    enabled: Boolean(id),
  })
}

export function useCreateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: StudentCreateDTO) => createStudent(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  })
}

export function useUpdateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: StudentUpdateDTO }) => updateStudent(id, values),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  })
}

export function useDeleteStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  })
}
