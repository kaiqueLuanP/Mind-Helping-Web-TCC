// 🔥 src/routes/_app/relatorios.tsx

import { createFileRoute } from '@tanstack/react-router'
import Layout from '../../components/Layout'
import { MoodVariationChart } from './-components/reports/mood-variation-chart'
import { MoodDonutChart } from './-components/reports/mood-donut-chart'
import { AppointmentList } from './-components/reports/appointment-list'
import { useState, useMemo } from 'react'
import { DateValue } from "react-aria-components"
import { CalendarDate } from "@internationalized/date"

// Tipos
interface Patient {
  id: number
  name: string
  age: number
}

// Mock de dados dos pacientes
const patients: Patient[] = [
  { id: 1, name: 'Márcio Pessoa', age: 32 },
  { id: 2, name: 'Gabriel Lopes de Souza', age: 24 },
  { id: 3, name: 'Luiz Antonio de Oliveira', age: 18 },
  { id: 4, name: 'Ana Paula Fernandes', age: 19 },
  { id: 5, name: 'Elvira Alves da Silva', age: 38 },
]

// Validação de parâmetros de busca
const reportSearchSchema = {
  patientId: (value: unknown) => {
    const num = Number(value)
    return !isNaN(num) && num > 0 ? num : undefined
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
  const [selectedDate, setSelectedDate] = useState<DateValue>(new CalendarDate(2025, 10, 9))
  const [moodStartDate, setMoodStartDate] = useState('2025-03-15')
  const [moodEndDate, setMoodEndDate] = useState('2025-03-20')

  // Buscar paciente pelo ID
  const selectedPatient = useMemo(() => {
    if (!patientId) return null
    return patients.find(p => p.id === patientId) || null
  }, [patientId])

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          {selectedPatient ? (
            <>
              <h1 className="font-medium text-xl md:text-2xl">
                Paciente: {selectedPatient.name}
              </h1>
              <p className="text-sm text-gray-500">Idade: {selectedPatient.age}</p>
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
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          {/* Gráfico de Relatório de humor */}
          <div className="rounded-lg">
            <MoodDonutChart
              startDate={moodStartDate}
              endDate={moodEndDate}
              onStartDateChange={setMoodStartDate}
              onEndDateChange={setMoodEndDate}
            />
          </div>

          {/* Controle de chamada CVV */}
          <div className="lg:col-span-2 rounded-lg p-6">
            <AppointmentList />
          </div>
        </div>
      </div>
    </Layout>
  )
}