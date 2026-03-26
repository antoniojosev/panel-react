export function parseApiError(error: unknown): string {
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message)
      return parsed.message || error.message
    } catch {
      return error.message
    }
  }
  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>
    if (typeof err.message === 'string') return err.message
    if (err.response && typeof err.response === 'object') {
      const resp = err.response as Record<string, unknown>
      if (resp.data && typeof resp.data === 'object') {
        const data = resp.data as Record<string, unknown>
        if (typeof data.message === 'string') return data.message
      }
    }
  }
  return 'Error desconocido'
}
