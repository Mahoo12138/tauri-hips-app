import { createLazyFileRoute } from '@tanstack/react-router'
import Login from '@/features/auth/sign-in/log-in'

export const Route = createLazyFileRoute('/(auth)/log-in')({
  component: Login,
})
