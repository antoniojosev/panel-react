import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import usersReducer from '../features/users/usersSlice'
import studentsReducer from '../features/students/studentsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    students: studentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
