export interface StatusDistributionItem {
  name: string
  value: number
}

export interface Last7DaysItem {
  name: string
  complete: number
}

export interface InstructorRankingItem {
  ranking: number
  instructor: {
    id: string
    name: string
    email: string
  }
  completedStudents: number
  completionRate: number
}

export interface DashboardData {
  totalStudents: number
  statusDistribution: StatusDistributionItem[]
  avgProgress: number
  last7Days: Last7DaysItem[]
  instructorRanking: InstructorRankingItem[]
}
