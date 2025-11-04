import { createFileRoute } from '@tanstack/react-router'
import { Book, Check, Users, X } from 'lucide-react'
import Layout from '../../components/Layout'
import { CardIndicatorDashboard } from './-components/card-indicator-dashboard'
import { ChartSchedulingPreviousSixMonths } from './-components/calendar/chart-scheduling-previous-six-month'
import { useDadosDashboard } from '@/hooks/useDadosDashboard'

export const Route = createFileRoute('/_app/principal')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useDadosDashboard()
  
  // Se estiver carregando retora zero
  const dashboardData = {
    totalPacientes: data?.profissional.numberPatients ?? 0,
    cancelamentos: data?.cancelamentos ?? 0,
    taxaPresenca: data?.taxaPresenca ?? 0,
    clientesAgendados: data?.clientesAgendados ?? 0,
  }

  return (
    <Layout>
      <div className="space-y-5">
        <h1 className='font-medium text-xl md:text-2xl'>Painel</h1>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5'>
          <CardIndicatorDashboard 
            title="Pacientes" 
            indicator={String(dashboardData.totalPacientes)} 
            description="Número total de pacientes" 
            icon={Users} 
          />
          <CardIndicatorDashboard 
            title="Agendamentos" 
            indicator={dashboardData.clientesAgendados.toString()} 
            description="Número de agendamentos da semana" 
            icon={Book} 
          />
          <CardIndicatorDashboard 
            title="Cancelamentos" 
            indicator={String(dashboardData.cancelamentos)} 
            description="Agendamentos que foram cancelados nos próximos dias" 
            icon={X} 
          />
          <CardIndicatorDashboard 
            title="Comparecimento" 
            indicator={`${dashboardData.taxaPresenca}%`} 
            description="Taxa de comparecimento dos pacientes" 
            icon={Check} 
          />
        </div>
        
        {/* Gráfico */}
        <div className='w-full overflow-x-auto'>
          <ChartSchedulingPreviousSixMonths />
        </div>
      </div>
    </Layout>
  )
}