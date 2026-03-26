import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  userId: string | null
  email: string | null
  token: string | null
  status: 'idle' | 'loading' | 'authenticated' | 'error'
  error: string | null
}

const initialState: AuthState = {
  userId: null,
  email: null,
  token: null,
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state) {
      state.status = 'loading'
      state.error = null
    },
    login(state, action: PayloadAction<{ userId: string; email: string; token: string }>) {
      state.userId = action.payload.userId
      state.email = action.payload.email
      state.token = action.payload.token
      state.status = 'authenticated'
      state.error = null
    },
    logout(state) {
      state.userId = null
      state.email = null
      state.token = null
      state.status = 'idle'
      state.error = null
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.status = 'error'
      state.error = action.payload
    },
  },
})

export const { setAuthLoading, login, logout, setAuthError } = authSlice.actions
export default authSlice.reducer
