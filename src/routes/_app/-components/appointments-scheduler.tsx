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
import { useAuth } from '@/hooks/useAuth'
import scheduleService from '@/services/scheduleService'

type AppointmentStatus = 'Agendado' | 'cancelled' | 'available'

interface Appointment {
  id: string
  time: string
  patient: string | null
  status: AppointmentStatus
  schedulingId?: string
  pacientId?: string
}

interface PatientScheduling {
  pacientId: string
  schedulingId: string
  namePacient: string
  hour: string
}

export function AppointmentsScheduler() {
  const { user } = useAuth()
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const patients: Array<{ id: string; name: string; age?: number }> = []
  
  const handleDateSelect = async (date: string) => {
    setSelectedDates([date])
    
    if (!user?.id) {
      console.warn('⚠️ Usuário não autenticado')
      return
    }
    
    setIsLoading(true)
    
    try {
      // ✅ CORREÇÃO: Formato correto sem conversão de timezone
      // A API espera YYYY-MM-DDTHH:mm:ss.sssZ
      const [year, month, day] = date.split('-').map(Number)
      
      // Criar datas locais e converter para ISO mantendo horário local
      const startDateTime = new Date(year, month - 1, day, 0, 0, 0, 0)
      const endDateTime = new Date(year, month - 1, day, 23, 59, 59, 999)
      
      // Formatar manualmente para evitar conversão de timezone
      const pad = (n: number) => String(n).padStart(2, '0')
      const pad3 = (n: number) => String(n).padStart(3, '0')
      
      // Formato: YYYY-MM-DDTHH:mm:ss.sssZ (mas com horário local)
      const startDate = `${year}-${pad(month)}-${pad(day)}T00:00:00.000Z`
      const endDate = `${year}-${pad(month)}-${pad(day)}T23:59:59.999Z`
      
      console.log(`🔍 Buscando agendamentos para: ${date}`)
      console.log(`   Start: ${startDate}`)
      console.log(`   End: ${endDate}`)
      console.log(`   Professional ID: ${user.id}`)
      
      const schedulings = await scheduleService.getSchedulingsByDateRange(
        startDate, 
        endDate, 
        user.id
      )
      
      console.log('📅 Resposta da API:', schedulings)
      
      // Verificar se há dados
      if (!schedulings || schedulings.length === 0) {
        console.log('ℹ️ Nenhum agendamento encontrado para esta data')
        setAppointments([])
        return
      }
      
      // Log para ver a estrutura do primeiro item
      console.log('🔍 Primeiro agendamento:', schedulings[0])
      console.log('   Chaves disponíveis:', Object.keys(schedulings[0]))
      
      // Transformar os dados da API em appointments
      const transformedAppointments: Appointment[] = schedulings.map((scheduling: PatientScheduling) => {
        console.log('🔄 Mapeando:', { scheduling })
        return {
          id: scheduling.schedulingId,
          time: scheduling.hour,
          patient: scheduling.namePacient,
          status: 'Agendado' as AppointmentStatus,
          schedulingId: scheduling.schedulingId,
          pacientId: scheduling.pacientId
        }
      })
      
      // Ordenar por horário
      transformedAppointments.sort((a, b) => a.time.localeCompare(b.time))
      
      console.log(`✅ ${transformedAppointments.length} agendamento(s) carregado(s)`)
      setAppointments(transformedAppointments)
      
    } catch (error: any) {
      console.error('❌ Erro ao buscar agendamentos:', error)
      console.error('   Mensagem:', error.message)
      console.error('   Response:', error.response?.data)
      
      // Mostrar erro mais específico
      if (error.response?.status === 404) {
        console.log('ℹ️ Nenhum agendamento encontrado (404)')
      } else if (error.response?.status === 400) {
        console.error('❌ Parâmetros inválidos (400)')
      }
      
      setAppointments([])
    } finally {
      setIsLoading(false)
    }
  }
  
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
            
            {isLoading && (
              <div className="text-center py-8 text-gray-500">
                <p>Carregando agendamentos...</p>
              </div>
            )}
            
            {!isLoading && selectedDates.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>Selecione uma data no calendário</p>
              </div>
            )}
            
            {!isLoading && selectedDates.length > 0 && appointments.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>Nenhum agendamento para esta data</p>
              </div>
            )}
            
            <div className="space-y-3">
              {!isLoading && appointments.map((appointment) => (
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
                {patients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-400 py-8">
                      Nenhum paciente cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age ? `${patient.age} anos` : '-'}</TableCell>
                      <TableCell>
                        <Link to="/reports" search={{ patientId: parseInt(patient.id) || 0 }}>
                          <Button variant="link" size="sm" className="gap-2">
                            <FileText className="w-4 h-4" />
                            Visualizar Relatórios
                          </Button>
                        </Link> 
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Versão Mobile - Cards */}
          <div className="md:hidden space-y-3">
            {patients.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                Nenhum paciente cadastrado
              </div>
            ) : (
              patients.map((patient) => (
                <Card key={patient.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base text-gray-900 truncate">
                          {patient.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {patient.age ? `${patient.age} anos` : '-'}
                        </p>
                        <Link
                          to="/reports"
                          search={{ patientId: parseInt(patient.id) || 0 }}
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
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}