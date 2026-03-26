import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Student } from './studentTypes'

interface StudentsState {
  collection: Student[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: StudentsState = {
  collection: [],
  status: 'idle',
  error: null,
}

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setStudents(state, action: PayloadAction<Student[]>) {
      state.collection = action.payload
      state.status = 'succeeded'
      state.error = null
    },
    setLoading(state) {
      state.status = 'loading'
      state.error = null
    },
    setError(state, action: PayloadAction<string>) {
      state.status = 'failed'
      state.error = action.payload
    },
  },
})

export const { setStudents, setLoading, setError } = studentsSlice.actions
export default studentsSlice.reducer
