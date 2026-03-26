import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from './userTypes'

interface UsersState {
  collection: User[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: UsersState = {
  collection: [],
  status: 'idle',
  error: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
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

export const { setUsers, setLoading, setError } = usersSlice.actions
export default usersSlice.reducer
