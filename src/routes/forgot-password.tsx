import { createFileRoute } from '@tanstack/react-router'
import { ForgotPasswordForm } from '@/components/ForgotPasswordForm' 

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ForgotPasswordForm className="max-w-md w-full" />
    </div>
  )
}