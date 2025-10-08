import { createFileRoute } from '@tanstack/react-router'
import { RegisterForm } from "@/components/RegisterForm"

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        {/* Logo + Nome centralizados */}
        <div className="flex items-center justify-center gap-3">
          <img
            src="/mind_Prancheta 1 1.svg"
            alt="MindHelping logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
          <span className="text-2xl md:text-3xl font-bold text-gray-800 tracking-wide">
            MINDHELPING
          </span>
        </div>

        {/* Formulário */}
        <RegisterForm />
      </div>
    </div>
  )
}
