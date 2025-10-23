import { createFileRoute } from '@tanstack/react-router'
import ProfilePage from './-components/profile/profilepage' 
import Layout from '@/components/Layout'

export const Route = createFileRoute('/_app/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <ProfilePage />
    </Layout>
  )
}