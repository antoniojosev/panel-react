import { describe, it, expect } from 'vitest'
import studentsReducer, { setStudents, setLoading, setError } from './studentsSlice'

describe('studentsSlice', () => {
  it('sets students list', () => {
    const initial = { collection: [], status: 'idle' as const, error: null }
    const next = studentsReducer(initial, setStudents([{
      id: 's1', name: 'A', email: 'a@b.com', institution: 'X', course: 'Y',
      progress: 10, status: 'activo', registeredAt: '2025-10-25', instructorId: 'u2',
      instructor: { id: 'u2', name: 'Inst', email: 'i@b.com' }, instructorName: 'Inst'
    }]))
    expect(next.collection).toHaveLength(1)
    expect(next.status).toBe('succeeded')
  })

  it('sets loading state', () => {
    const state = studentsReducer({ collection: [], status: 'idle', error: null }, setLoading())
    expect(state.status).toBe('loading')
  })

  it('sets error state', () => {
    const state = studentsReducer({ collection: [], status: 'idle', error: null }, setError('fail'))
    expect(state.error).toBe('fail')
    expect(state.status).toBe('failed')
  })
})
