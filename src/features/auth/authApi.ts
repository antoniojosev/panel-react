import type { LoginDto, LoginResponse, ChangePasswordDto } from './authTypes'
import { setToken, removeToken } from '../../services/api'
import { fetchWithAuth } from '../../services/fetchWithAuth'

const BASE = import.meta.env.VITE_API_URL

export async function loginApi(data: LoginDto): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al iniciar sesión')
  const json = await res.json()
  setToken(json.access_token)
  return json
}

export interface RegisterDto {
  email: string
  password: string
  name: string
  role: 'instructor'
}

export async function registerApi(data: RegisterDto): Promise<any> {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message || 'Error al registrar usuario')
  }

  return res.json()
}

export async function getProfileApi(): Promise<LoginResponse['user']> {
  const res = await fetchWithAuth(`${BASE}/auth/me`)
  if (!res.ok) throw new Error('No autenticado')
  return res.json()
}

export async function changePasswordApi(data: ChangePasswordDto): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${BASE}/auth/change-password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    const message = errorBody?.message || 'Error al cambiar la contraseña'
    throw new Error(message)
  }

  return res.json()
}

export function logoutApi() {
  removeToken()
}
