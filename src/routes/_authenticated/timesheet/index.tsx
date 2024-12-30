import Timesheet from '@/features/timesheet'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/timesheet/')({
  component: Timesheet,
})

