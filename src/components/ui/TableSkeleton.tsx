import { Skeleton, TableBody, TableCell, TableRow } from '@mui/material'

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export default function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={colIdx}>
              <Skeleton variant="text" animation="wave" sx={{ bgcolor: 'action.hover' }} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}
