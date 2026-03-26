
import type { User, UserCreateDTO, UserUpdateDTO } from '../userTypes'
import { fetchWithAuth } from '../../../services/fetchWithAuth'

interface Meta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UsersResponse {
  data: User[]
  meta: Meta
}

const BASE = import.meta.env.VITE_API_URL

export async function getUsers(page?: number, limit?: number, search?: string): Promise<UsersResponse> {
  const params = new URLSearchParams()

  if (page !== undefined) params.append('page', page.toString())
  if (limit !== undefined) params.append('limit', limit.toString())
  if (search) params.append('search', search)

  const url = params.toString() ? `${BASE}/users?${params.toString()}` : `${BASE}/users`
  const res = await fetchWithAuth(url)
  
  if (!res.ok) throw new Error('Error al obtener usuarios')
  return res.json()
}

export async function getUserById(id: string): Promise<User | undefined> {
  const res = await fetchWithAuth(`${BASE}/users/${id}`)
  if (!res.ok) throw new Error('Usuario no encontrado')

  return res.json()
}

export async function createUser(dto: UserCreateDTO): Promise<User> {
  const res = await fetchWithAuth(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  })

  if (!res.ok) throw new Error('Error al crear usuario')
    
  return res.json()
}

export async function updateUser(id: string, dto: UserUpdateDTO): Promise<User> {
  const res = await fetchWithAuth(`${BASE}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  })

  if (!res.ok) throw new Error('Error al actualizar usuario')

  return res.json()
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetchWithAuth(`${BASE}/users/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const errorText = await res.text()
    let message = 'Error al eliminar usuario'
    if (errorText) {
      try {
        const parsed = JSON.parse(errorText)
        message = parsed.message || message
      } catch {
        message = errorText
      }
    }
    throw new Error(message)
  }
}

