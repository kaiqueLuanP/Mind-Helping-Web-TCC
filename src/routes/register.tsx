import { createFileRoute } from '@tanstack/react-router'
import { GalleryVerticalEnd } from "lucide-react"
import { RegisterForm } from "@/components/RegisterForm" 

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span className="text-xl font-bold">MINDHELPING</span>
        </a>
        <RegisterForm />
      </div>
    </div>
  )
}