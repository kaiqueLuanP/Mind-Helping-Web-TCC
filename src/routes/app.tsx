import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-sky-500 text-white shadow z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-bold text-lg">Mind Helping</div>
            <nav className="hidden sm:flex gap-6">
              <Link to="/app" className="opacity-90 hover:opacity-100">Início</Link>
              <Link to="/calendar" className="opacity-90 hover:opacity-100">Agenda</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm hidden sm:block">Profissional</div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">P</div>
          </div>
        </div>
      </header>

      <main className="pt-20 max-w-7xl mx-auto px-4 pb-12">
        <Outlet />
      </main>
    </div>
  )
}
