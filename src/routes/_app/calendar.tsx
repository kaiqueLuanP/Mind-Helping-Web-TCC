import { createFileRoute } from '@tanstack/react-router'
import Layout from '../../components/Layout'
import { CalendarScheduler } from './-components/calendar/calendar-scheduler'

export const Route = createFileRoute('/_app/calendar')({
  component: CalendarComponent,
})

function CalendarComponent() {
  return (
    <Layout>
      <div className="p-3 sm:p-4 md:p-6 w-full mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
          Agenda
        </h2>
        <CalendarScheduler />
      </div>
    </Layout>
  )
}