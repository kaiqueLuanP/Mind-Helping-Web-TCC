import { createFileRoute } from '@tanstack/react-router'
import Layout from '../../components/Layout'

export const Route = createFileRoute('/_app/principal')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <div className='text-center text-2xl font-bold '>Bem vindo ao MINDHELPING </div>
    </Layout>
  )
}

