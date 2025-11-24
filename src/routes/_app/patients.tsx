import { createFileRoute } from '@tanstack/react-router'
import Layout from '../../components/Layout' 
import { AppointmentsScheduler } from './-components/appointments/appointments-scheduler'  
export const Route = createFileRoute('/_app/patients')({
  component: PatientsComponent,
})

function PatientsComponent() {
  return (
    <Layout>
      <div className="p-3 sm:p-4 md:p-6 w-full mx-auto">
        <AppointmentsScheduler />  
      </div>
    </Layout>
  )
}