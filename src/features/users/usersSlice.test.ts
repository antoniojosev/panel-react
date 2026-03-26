import { describe, it, expect } from 'vitest'
import usersReducer, { setUsers, setLoading, setError } from './usersSlice'

describe('usersSlice', () => {
  it('sets users list', () => {
    const initial = { collection: [], status: 'idle' as const, error: null }
    const next = usersReducer(initial, setUsers([{ id: 'u1', email: 'x@a.com', passwordHash: 'h', fullName: 'X', role: 'admin' }]))
    expect(next.collection).toHaveLength(1)
    expect(next.status).toBe('succeeded')
  })

  it('sets loading state', () => {
    const state = usersReducer({ collection: [], status: 'idle', error: null }, setLoading())
    expect(state.status).toBe('loading')
  })

  it('sets error state', () => {
    const state = usersReducer({ collection: [], status: 'idle', error: null }, setError('oops'))
    expect(state.error).toBe('oops')
    expect(state.status).toBe('failed')
  })
})
