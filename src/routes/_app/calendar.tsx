// 📁 src/routes/_app/calendar.tsx

import { createFileRoute } from '@tanstack/react-router'
import Layout from '../../components/Layout'
import { CalendarScheduler } from './-components/calendar-scheduler'

export const Route = createFileRoute('/_app/calendar')({
  component: CalendarComponent,
})

function CalendarComponent() {
  return (
    <Layout>
      <div className="p-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Agenda</h2>
        <CalendarScheduler />
      </div>
    </Layout>
  )
}