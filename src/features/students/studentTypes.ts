export type StudentStatus = 'activo' | 'inactivo' | 'completado' | 'abandonado'

export interface Instructor {
  email: "carlos@vracademy.lat"
  id: "4433e50b-7f7c-4807-a22e-a26cd51e6fea"
  name: "Carlos Méndez"
}

export interface Student {
  id: string
  name: string
  email: string
  institution: string
  course: string
  progress: number
  status: StudentStatus
  registrationDate: string
  instructorId: string,
  instructor: Instructor;

}

export interface StudentCreateDTO {
  name: string
  email: string
  institution: string
  course: string
  progress: number
  status: StudentStatus
  instructorId: string
  instructor?: Instructor;
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
