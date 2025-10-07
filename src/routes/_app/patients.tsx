import { createFileRoute } from '@tanstack/react-router'
import Layout from '../../components/Layout'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Download } from 'lucide-react'

export const Route = createFileRoute('/_app/patients')({
  component: RouteComponent,
})

function RouteComponent() {
  const patients = [
    { id: 1, name: 'Márcio Pessoa', age: 32 },
    { id: 2, name: 'Gabriel Lopes de Souza', age: 24 },
    { id: 3, name: 'Luiz Antonio de Oliveira', age: 18 },
    { id: 4, name: 'Ana Paula Fernandes', age: 19 },
    { id: 5, name: 'Elvira Alves da Silva', age: 38 },
  ]

  return (
    <Layout>
      <div className="space-y-5">
        <h1 className='font-medium text-xl md:text-2xl'>Meus Pacientes</h1>
        
        {/* Versão Desktop - Tabela */}
        <div className="hidden md:block bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className=''>Paciente</TableHead>
                <TableHead className=''>Idade</TableHead>
                <TableHead className=''>Relatórios</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age} anos</TableCell>
                  <TableCell>
                    <Button variant="link" size="sm">
                      Visualizar Relatórios
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Versão Mobile  */}
        <div className="md:hidden space-y-3">
          {patients.map((patient) => (
            <Card key={patient.id} className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-base text-gray-900">
                      {patient.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {patient.age} anos
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-blue-600 shrink-0">
                    <Download className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}