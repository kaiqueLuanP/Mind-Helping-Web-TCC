// 🔥 src/routes/_app/relatorios.tsx

import { createFileRoute } from '@tanstack/react-router'
import Layout from '../../components/Layout'
import { MoodVariationChart } from './-components/reports/mood-variation-chart'
import { MoodDonutChart } from './-components/reports/mood-donut-chart'
import { AppointmentList } from './-components/reports/appointment-list'
import { useState } from 'react'


// Validação de parâmetros de busca
const reportSearchSchema = {
  patientId: (value: unknown) => {
    console.log('Validando patientId:', value, 'tipo:', typeof value)
    // Se for string UUID ou número, aceita
    const result = typeof value === 'string' && value.length > 0 ? value : undefined
    console.log('Resultado da validação:', result)
    return result
  }
}

export const Route = createFileRoute('/_app/reports')({
  component: ReportsComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      patientId: reportSearchSchema.patientId(search.patientId)
    }
  }
})

function ReportsComponent() {
  const { patientId } = Route.useSearch()
  const [moodStartDate, setMoodStartDate] = useState('2025-03-15')
  const [moodEndDate, setMoodEndDate] = useState('2025-03-20')

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          {patientId ? (
            <>
              <h1 className="font-medium text-xl md:text-2xl">
                Relatório do Paciente
              </h1>
            </>
          ) : (
            <>
              <h1 className="font-medium text-xl md:text-2xl">
                Relatórios
              </h1>
              <p className="text-sm text-gray-500">
                Selecione um paciente para visualizar os relatórios
              </p>
            </>
          )}
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Variação diária de sentimento */}
          <div className="rounded-lg">
            <MoodVariationChart 
              userId={patientId?.toString() || null}
              startDate={moodStartDate}
              endDate={moodEndDate}
              onStartDateChange={setMoodStartDate}
              onEndDateChange={setMoodEndDate}
            />
          </div>

          {/* Gráfico de Relatório de humor */}
          <div className="rounded-lg">
            <MoodDonutChart
              userId={patientId?.toString() || null}
              startDate={moodStartDate}
              endDate={moodEndDate}
              onStartDateChange={setMoodStartDate}
              onEndDateChange={setMoodEndDate}
            />
          </div>

          {/* Controle de chamada CVV */}
          <div className="lg:col-span-2 rounded-lg p-6">
            <AppointmentList userId={patientId?.toString() || null} />
          </div>
        </div>
      </div>
    </Layout>
  )
}