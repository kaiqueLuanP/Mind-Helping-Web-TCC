import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { Bell, BookAIcon, BrainCircuit, ChartLine, House, UsersIcon } from 'lucide-react'
import type React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Separator } from './ui/separator'

interface LayoutProps {
  children?: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation()

  const iconsAndLabelsAndLinks = [
    {
      id: 1,
      icon: <House />,
      label: 'Painel',
      link: '/principal'
    },
    {
      id: 2,
      icon: <UsersIcon />,
      label: 'Pacientes',
      link: '/pacientes'
    },
    {
      id: 3,
      icon: <ChartLine />,
      label: 'Relatórios',
      link: '/relatorios'
    },
    {
      id: 4,
      icon: <BookAIcon />,
      label: 'Agenda',
      link: '/calendar'
    },
  ]

  return (
    <div className="min-h-screen flex antialiased">
      <div className='min-h-screen w-[320px] shadow bg-zinc-100 border-r border-zinc-200 py-5 px-2.5 space-y-4 flex flex-col justify-between'>
        <div className='flex text-lg gap-x-2 w-full justify-between flex-col'>
          <div className='flex items-center justify-between'>
            <BrainCircuit className='size-8' />
            <span>MindHelping Profissional</span>
            <div className='bg-zinc-50 p-1 rounded-lg border-zinc-200 border shad'>
              <Bell className='size-6' />
            </div>
          </div>
          <div>
            <div className='flex flex-col gap-y-3 text-md ml-3'>
              <Separator orientation='horizontal' className='bg-zinc-200 my-3' />
              {iconsAndLabelsAndLinks.map(item => (
                <Link key={item.id} to={item.link}>
                  <div
                    data-current={pathname === item.link ? 'true' : undefined}
                    className='flex items-center gap-x-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-300 rounded-lg p-2 transition-colors data-[current=true]:bg-zinc-300 data-[current=true]:text-zinc-950'>
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-x-4'>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className='font-medium'>Profissional</span>
        </div>
      </div>
      <div className='flex-1 p-4'>
        {children ?? <Outlet />}
      </div>
    </div>
  )
}