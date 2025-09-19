import { createFileRoute } from '@tanstack/react-router'
import { Book, Check, Users, X } from 'lucide-react'
import Layout from '../../components/Layout'
import { CardIndicatorDashboard } from './-components/card-indicator-dashboard'
import { ChartSchedulingPreviousSixMonths } from './-components/chart-scheduling-previous-six-month'

export const Route = createFileRoute('/_app/principal')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <div className="space-y-5">
        <span className='font-medium text-xl'>Painel</span>
        <div className='grid grid-cols-4 gap-x-4 mt-5'>
          <CardIndicatorDashboard title="Pacientes" indicator={'15'} description="Número total de pacientes" icon={Users} />
          <CardIndicatorDashboard title="Agendamentos" indicator={'4'} description="Número de agendamentos da semana" icon={Book} />
          <CardIndicatorDashboard title="Cancelamentos" indicator={'1'} description="Agendamentos que foram cancelados nos próximos dias" icon={X} />
          <CardIndicatorDashboard title="Comparecimento" indicator={'85 %'} description="Taxa de comparecimento dos pacientes" icon={Check} />
        </div>
        <ChartSchedulingPreviousSixMonths />
      </div>
    </Layout>
  )
}

