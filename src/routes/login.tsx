import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from "@/components/login-form"

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
 return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 ">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center">
            <img src="/mind_Prancheta 1 1.svg" alt="Mind Prancheta" className="size-6" />
          </div>
        </a>
        <LoginForm />
      </div>
    </div>
  )
}