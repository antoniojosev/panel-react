import { useProfile } from '../features/auth/hooks/useAuth'

/**
 * Hook para saber si el usuario tiene uno de los roles permitidos
 * @param allowedRoles Array de roles permitidos (por ejemplo: ['admin', 'instructor'])
 * @returns boolean
 */
export function useHasRole(allowedRoles: string[] = []) {
  const { data: user } = useProfile()
  if (!user || !user.role) return false
  return allowedRoles.includes(user.role)
}

/**
 * Componente para mostrar children solo si el usuario tiene uno de los roles permitidos
 * @param allowedRoles Array de roles permitidos
 * @param children Elementos a renderizar
 */
export function ShowForRole({ allowedRoles, children }: { allowedRoles: string[], children: React.ReactNode }) {
  const hasRole = useHasRole(allowedRoles)
  if (!hasRole) return null
  return <>{children}</>
}
