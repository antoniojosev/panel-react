import { useQuery } from '@tanstack/react-query'
import { getDashboardData } from '../../../services/dashboardApi'
import type { DashboardData } from '../types'

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
    staleTime: 1000 * 60 * 2,
  })
}
