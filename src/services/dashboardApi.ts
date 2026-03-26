import { fetchWithAuth } from './fetchWithAuth';

const BASE = import.meta.env.VITE_API_URL

export async function getDashboardData() {
  const res = await fetchWithAuth(`${BASE}/dashboard`)
  if (!res.ok) throw new Error('Error al obtener dashboard')
  return res.json()
}
