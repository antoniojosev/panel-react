import { useMutation, useQuery } from '@tanstack/react-query'
import { loginApi, getProfileApi, logoutApi, changePasswordApi, registerApi } from '../authApi'
import type { ChangePasswordDto, LoginDto } from '../authTypes'
import { useNavigate } from 'react-router-dom'

export function useLogin() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (data: LoginDto) => loginApi(data),
    onSuccess: () => {
      navigate('/')
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()
  return () => {
    logoutApi()
    navigate('/login')
  }
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfileApi,
    staleTime: 1000 * 60 * 5,
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => changePasswordApi(data),
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: { email: string; password: string; name: string; role: 'instructor' }) => registerApi(data),
  })
}
