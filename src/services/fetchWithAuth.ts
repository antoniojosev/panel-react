// fetchWithAuth.ts
// Wrapper for fetch that adds Authorization header with token from localStorage
import { getToken } from './api'

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const token = getToken()
  const headers = new Headers(init.headers || {})
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  // Always keep credentials: 'include' unless explicitly overridden
  if (!('credentials' in init)) {
    init.credentials = 'include'
  }
  return fetch(input, { ...init, headers })
}
