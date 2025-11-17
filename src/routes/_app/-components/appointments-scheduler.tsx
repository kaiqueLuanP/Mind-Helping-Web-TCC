import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
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
  const [scheduleIds, setScheduleIds] = useState<string[]>([])
  const patients: Array<{ id: string; name: string; age?: number }> = []
  
  // ✅ Buscar os scheduleIds do profissional ao carregar o componente
  useEffect(() => {
    const fetchScheduleIds = async () => {
      if (!user?.id) return
      
      try {
        const schedules = await scheduleService.getSchedules(user.id)
        
        if (schedules && schedules.length > 0) {
          const ids = schedules.map((s: { id: string }) => s.id)
          setScheduleIds(ids)
          console.log('✅ ScheduleIds carregados:', ids)
        } else {
          console.warn('⚠️ Profissional não possui agenda cadastrada')
        }
      } catch (error) {
        console.error('❌ Erro ao buscar scheduleIds:', error)
      }
    }
    
    fetchScheduleIds()
  }, [user?.id])
  
  const handleDateSelect = async (date: string) => {
    setSelectedDates([date])
    
    if (!user?.id) {
      console.warn('⚠️ Usuário não autenticado')
      return
    }
    
    if (scheduleIds.length === 0) {
      console.warn('⚠️ Nenhuma agenda encontrada para este profissional')
      setAppointments([])
      return
    }
    
    setIsLoading(true)
    
    try {
      const [year, month, day] = date.split('-').map(Number)
      const pad = (n: number) => String(n).padStart(2, '0')
      
      const startDate = `${year}-${pad(month)}-${pad(day)}T00:00:00.000Z`
      const endDate = `${year}-${pad(month)}-${pad(day)}T23:59:59.999Z`
      
      // ✅ Buscar agendamentos de TODAS as agendas do profissional
      const allSchedulings = await Promise.all(
        scheduleIds.map(scheduleId => 
          scheduleService.getSchedulingsByDateRange(startDate, endDate, scheduleId)
            .catch(err => {
              console.error(`Erro ao buscar agendamentos da agenda ${scheduleId}:`, err)
              return [] // Retorna array vazio se falhar
            })
        )
      )
      
      // Juntar todos os agendamentos em um único array
      const schedulings = allSchedulings.flat()
      
      // ✅ PROTEÇÃO: Verificar se response é array antes de usar
      if (!Array.isArray(schedulings)) {
        console.warn('⚠️ Resposta não é um array:', schedulings)
        setAppointments([])
        return
      }
      
      // Verificar se há dados
      if (schedulings.length === 0) {
        setAppointments([])
        return
      }
      
      // ✅ Transformar os dados da API em appointments
      const transformedAppointments: Appointment[] = schedulings.map((scheduling: PatientScheduling) => {
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
      
      setAppointments(transformedAppointments)
      
    } catch (error: any) {
      console.error('❌ Erro ao buscar agendamentos:', error)
      setAppointments([])
    } finally {
      setIsLoading(false)
    }
  }
  
  const getStatusBadge = (status: AppointmentStatus) => {
    const badges: Record<AppointmentStatus, string> = {
      Agendado: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      available: 'bg-gray-100 text-gray-700 border-gray-200',
    }
    const labels: Record<AppointmentStatus, string> = {
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