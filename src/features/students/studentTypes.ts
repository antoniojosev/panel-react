export type StudentStatus = 'activo' | 'inactivo' | 'completado' | 'abandonado'

export interface Instructor {
  id: string
  name: string
  email: string
}

export interface Student {
  id: string
  name: string
  email: string
  institution: string
  course: string
  progress: number
  status: StudentStatus
  registeredAt: string
  instructorId: string
  instructor: Instructor
  instructorName: string | null
}

export interface StudentCreateDTO {
  name: string
  email: string
  institution: string
  course: string
  progress?: number
  status?: StudentStatus
  instructorId: string
}

export interface StudentUpdateDTO {
  name?: string
  email?: string
  institution?: string
  course?: string
  progress?: number
  status?: StudentStatus
  instructorId?: string
}
