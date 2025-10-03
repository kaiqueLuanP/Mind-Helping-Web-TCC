import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { Bell, BookAIcon, BrainCircuit, ChartLine, House, UsersIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import type React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Separator } from './ui/separator'

interface LayoutProps {
  children?: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }

    // Verifica na montagem do componente
    handleResize()

    // Adiciona listener para mudanças de tamanho
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const iconsAndLabelsAndLinks = [
    {
      id: 1,
      icon: <House className="w-5 h-5" />,
      label: 'Painel',
      link: '/principal'
    },
    {
      id: 2,
      icon: <UsersIcon className="w-5 h-5" />,
      label: 'Pacientes',
      link: '/patients'
    },
    {
      id: 3,
      icon: <ChartLine className="w-5 h-5" />,
      label: 'Relatórios',
      link: '/relatorios'
    },
    {
      id: 4,
      icon: <BookAIcon className="w-5 h-5" />,
      label: 'Agenda',
      link: '/calendar'
    },
  ]

  return (
    <div className="min-h-screen flex antialiased">
      {/* Sidebar */}
      <div 
        className={`
          sticky top-0 h-screen
          shadow bg-zinc-100 border-r border-zinc-200 
          py-5 space-y-4 
          flex flex-col justify-between
          transition-all duration-300 ease-in-out
          relative
          ${sidebarCollapsed ? 'w-[80px]' : 'w-[80px] lg:w-[320px]'}
        `}
      >
        {/* Header do sidebar */}
        <div className='flex text-lg gap-x-2 w-full justify-between flex-col px-2.5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 overflow-hidden'>
              <BrainCircuit className='w-8 h-8 flex-shrink-0' />
              {!sidebarCollapsed && (
                <span className='whitespace-nowrap transition-opacity duration-200 hidden lg:block'>
                  MindHelping
                </span>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className='bg-zinc-50 p-1 rounded-lg border-zinc-200 border flex-shrink-0 hidden lg:block'>
                <Bell className='w-6 h-6' />
              </div>
            )}
          </div>
          
          {/* Menu de navegação */}
          <div>
            <div className='flex flex-col gap-y-3 text-md'>
              <Separator orientation='horizontal' className='bg-zinc-200 my-3' />
              {iconsAndLabelsAndLinks.map(item => (
                <Link 
                  key={item.id} 
                  to={item.link}
                  title={item.label}
                >
                  <div
                    data-current={pathname === item.link ? 'true' : undefined}
                    className={`
                      flex items-center gap-x-3 text-zinc-600 
                      hover:text-zinc-950 hover:bg-zinc-300 
                      rounded-lg p-2 transition-colors 
                      data-[current=true]:bg-zinc-300 
                      data-[current=true]:text-zinc-950
                      ${sidebarCollapsed ? 'justify-center' : 'justify-center lg:justify-start'}
                    `}
                  >
                    {item.icon}
                    {!sidebarCollapsed && (
                      <span className='whitespace-nowrap hidden lg:block'>
                        {item.label}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer do sidebar */}
        <div className='px-2.5'>
          {!sidebarCollapsed ? (
            <div className='hidden lg:flex items-center gap-x-4'>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className='font-medium'>Profissional</span>
            </div>
          ) : (
            <div className='flex justify-center'>
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>

        {/* Botão de colapsar/expandir */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className='hidden lg:block absolute -right-3 top-8 bg-white border border-zinc-200 rounded-full p-1 shadow-md hover:bg-zinc-100 transition-colors z-10'
          title={sidebarCollapsed ? 'Expandir menu' : 'Colapsar menu'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className='w-4 h-4' />
          ) : (
            <ChevronLeft className='w-4 h-4' />
          )}
        </button>
      </div>

      {/* Conteúdo principal */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Conteúdo */}
        <div className='flex-1 p-4 overflow-x-hidden'>
          {children ?? <Outlet />}
        </div>
      </div>
    </div>
  )
}