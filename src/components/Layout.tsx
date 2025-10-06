import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { Bell, BookAIcon, BrainCircuit, ChartLine, House, UsersIcon, Menu, X } from 'lucide-react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
      {/* Sidebar Desktop - Escondido no mobile */}
      <div 
        className={`
          hidden lg:flex
          sticky top-0 h-screen
          shadow bg-zinc-100 border-r border-zinc-200 
          py-5 space-y-4 
          flex-col justify-between
          transition-all duration-300 ease-in-out
          relative
          ${sidebarCollapsed ? 'w-[80px]' : 'w-[320px]'}
        `}
      >
        {/* Header do sidebar */}
        <div className='flex text-lg gap-x-2 w-full justify-between flex-col px-2.5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 overflow-hidden'>
              <BrainCircuit className='w-8 h-8 flex-shrink-0' />
              {!sidebarCollapsed && (
                <span className='whitespace-nowrap transition-opacity duration-200'>
                  MindHelping
                </span>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className='bg-zinc-50 p-1 rounded-lg border-zinc-200 border flex-shrink-0'>
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
                      ${sidebarCollapsed ? 'justify-center' : 'justify-start'}
                    `}
                  >
                    {item.icon}
                    {!sidebarCollapsed && (
                      <span className='whitespace-nowrap'>
                        {item.label}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Botão para colapsar sidebar - Desktop */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 bg-zinc-100 border border-zinc-200 rounded-full p-1 hover:bg-zinc-200 transition-colors"
          title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {sidebarCollapsed ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>

        {/* Footer do sidebar */}
        <div className='px-2.5'>
          {!sidebarCollapsed ? (
            <div className='flex items-center gap-x-4'>
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
      </div>

      {/* Conteúdo principal */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Header Mobile */}
        <div className='lg:hidden sticky top-0 z-50 bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <BrainCircuit className='w-8 h-8' />
            <span className='text-lg font-medium'>MindHelping</span>
          </div>
          
          {/* Botão do Menu Mobile */}
          <button 
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-zinc-600" />
            ) : (
              <Menu className="w-6 h-6 text-zinc-600" />
            )}
          </button>
        </div>

        {/* Menu Mobile Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Lateral Mobile */}
            <div className="lg:hidden fixed right-0 top-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col">
              {/* Header do Menu Mobile */}
              <div className='p-4 border-b border-zinc-200 flex items-center justify-between'>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navegação Mobile */}
              <div className='flex-1 p-4'>
                <div className='flex flex-col gap-y-2'>
                  {iconsAndLabelsAndLinks.map(item => (
                    <Link 
                      key={item.id} 
                      to={item.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div
                        data-current={pathname === item.link ? 'true' : undefined}
                        className={`
                          flex items-center gap-x-3 text-zinc-600 
                          hover:text-zinc-950 hover:bg-zinc-100 
                          rounded-lg p-3 transition-colors 
                          data-[current=true]:bg-zinc-200 
                          data-[current=true]:text-zinc-950
                        `}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Footer Mobile */}
              <div className='p-4 border-t border-zinc-200'>
                <div className='flex items-center gap-x-3'>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className='font-medium'>Profissional</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Conteúdo */}
        <div className='flex-1 p-4 overflow-x-hidden'>
          {children ?? <Outlet />}
        </div>
      </div>
    </div>
  )
}