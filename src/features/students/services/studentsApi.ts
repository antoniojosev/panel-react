import type { Student, StudentCreateDTO, StudentUpdateDTO } from '../studentTypes'

interface Meta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface StudentsResponse {
  data: Student[]
  meta: Meta
}
import { fetchWithAuth } from '../../../services/fetchWithAuth'

const BASE = import.meta.env.VITE_API_URL

export async function getStudents(page?: number, limit?: number, search?: string): Promise<StudentsResponse> {
  const params = new URLSearchParams()
  if (page !== undefined) params.append('page', page.toString())
  if (limit !== undefined) params.append('limit', limit.toString())
  if (search) params.append('search', search)
  
  const url = params.toString() ? `${BASE}/students?${params.toString()}` : `${BASE}/students`
  const res = await fetchWithAuth(url)
  if (!res.ok) throw new Error('Error al obtener estudiantes')
  return res.json()
}

export async function getStudentById(id: string): Promise<{ data: Student }> {
  const res = await fetchWithAuth(`${BASE}/students/${id}`)
  if (!res.ok) throw new Error('Estudiante no encontrado')
  return res.json()
}

export async function createStudent(dto: StudentCreateDTO): Promise<Student> {
  const res = await fetchWithAuth(`${BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  })
  if (!res.ok) throw new Error('Error al crear estudiante')
  return res.json()
}

export async function updateStudent(id: string, dto: StudentUpdateDTO): Promise<Student> {
  const res = await fetchWithAuth(`${BASE}/students/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  })
  if (!res.ok) throw new Error('Error al actualizar estudiante')
  return res.json()
}

export async function deleteStudent(id: string): Promise<void> {
  const res = await fetchWithAuth(`${BASE}/students/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Error al eliminar estudiante')
}
