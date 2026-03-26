export type UserRole = 'admin' | 'instructor'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface UserCreateDTO {
  email: string
  password: string
  name: string
  role: UserRole
}

export interface UserUpdateDTO {
  email?: string
  password?: string
  name?: string
  role?: UserRole
}
