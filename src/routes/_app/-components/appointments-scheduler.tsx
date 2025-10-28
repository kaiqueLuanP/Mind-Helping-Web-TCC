import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { SimpleCalendar } from './calendar/simple-calendar'
import { FileText, Download, User } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Link } from '@tanstack/react-router'

type AppointmentStatus = 'Agendado' | 'cancelled' | 'available'

interface Appointment {
  id: number
  time: string
  patient: string | null
  status: AppointmentStatus
}

export function AppointmentsScheduler() {
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  
  const handleDateSelect = (date: string) => {
    setSelectedDates([date])
  }
  
  const appointments: Appointment[] = [
    { id: 1, time: '08:00', patient: 'Juliana Pereira', status: 'Agendado' },
    { id: 2, time: '09:00', patient: 'Gabriel Lopes', status: 'Agendado' },
    { id: 3, time: '10:00', patient: 'Luiz Antonio', status: 'cancelled' },
    { id: 4, time: '11:00', patient: null, status: 'available' },
    { id: 5, time: '14:00', patient: 'Ana Paula Fernandes', status: 'Agendado' },
  ]

  const patients = [
    { id: 1, name: 'Juliana Pereira', age: 34 },
    { id: 2, name: 'Gabriel Lopes', age: 28 },
    { id: 3, name: 'Luiz Antonio', age: 52 },
    { id: 4, name: 'Ana Paula Fernandes', age: 45 },
  ]

  const getStatusBadge = (status: 'Agendado' | 'cancelled' | 'available') => {
    const badges: Record<string, string> = {
      Agendado: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      available: 'bg-gray-100 text-gray-700 border-gray-200',
    }
    const labels: Record<string, string> = {
      Agendado: 'Agendada',
      cancelled: 'Cancelada',
      available: 'Disponível',
    }
    return (
      <span className={`text-xs font-medium py-1 px-3 rounded-full border ${badges[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Agendamentos Realizados
        </h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="w-5 h-5" />
        </Button>
      </div>

      {/* GRID: Calendar + Agendamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <div>
          <SimpleCalendar selectedDates={selectedDates} onDateSelect={handleDateSelect} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="font-semibold text-lg mb-4">Agendamentos do Dia</h2>
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className={`${
                    appointment.status === 'cancelled' ? 'opacity-60' : ''
                  } ${
                    appointment.status === 'available'
                      ? 'border-2 border-dashed hover:border-blue-500 cursor-pointer transition-colors'
                      : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <span className="font-medium text-gray-600 w-12 text-right shrink-0 text-sm">
                          {appointment.time}
                        </span>
                        <div className="w-px h-6 bg-gray-200" />
                        <span
                          className={`font-semibold truncate ${
                            appointment.status === 'cancelled'
                              ? 'text-gray-500 line-through'
                              : appointment.status === 'available'
                              ? 'text-gray-500 font-medium'
                              : 'text-gray-900'
                          }`}
                        >
                          {appointment.patient || 'Sem agendamento'}
                        </span>
                      </div>
                      <div className="shrink-0">{getStatusBadge(appointment.status)}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-semibold text-lg mb-4">Todos os Pacientes</h2>

          {/* Versão Desktop - Tabela */}
          <div className="hidden md:block bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Relatórios</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age} anos</TableCell>
                    <TableCell>
                      <Link to="/reports" search={{ patientId: patient.id }}>
                        <Button variant="link" size="sm" className="gap-2">
                          <FileText className="w-4 h-4" />
                          Visualizar Relatórios
                        </Button>
                      </Link> 
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Versão Mobile - Cards */}
          <div className="md:hidden space-y-3">
            {patients.map((patient) => (
              <Card key={patient.id} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base text-gray-900 truncate">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {patient.age} anos
                      </p>
                      <Link
                        to="/reports"
                        search={{ patientId: patient.id }}
                        className="inline-block mt-2"
                      >
                        <Button variant="outline" size="sm" className="gap-2 text-xs">
                          <FileText className="w-3 h-3" />
                          Ver Relatórios
                        </Button>
                      </Link>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-600 shrink-0"
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}