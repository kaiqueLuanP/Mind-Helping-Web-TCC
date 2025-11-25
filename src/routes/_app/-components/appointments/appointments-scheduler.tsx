import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { SimpleCalendar } from '../calendar/simple-calendar'
import { FileText } from 'lucide-react'
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
import { useAppointmentConfirmation } from '@/hooks/useAppointmentConfirmation'
import { AppointmentConfirmationModal } from '../appointments/appointment-confirmation-modal'
import { PendingConfirmationBadge } from '../appointments/pending-confirmation-badge'
import { api } from '@/lib/axios'

type AppointmentStatus = 'Agendado' | 'cancelled' | 'available'

interface Appointment {
  id: string
  time: string
  patient: string | null
  status: AppointmentStatus
  schedulingId?: string
  pacientId?: string
  confirmed?: boolean
}

interface PatientScheduling {
  pacientId: string
  schedulingId: string
  namePacient: string
  hour: string
}

// ✅ Interface do paciente
interface Patient {
  patientId: string
  patientName: string
  patientAge: number
}

interface PatientsResponse {
  patients: Patient[]
}

export function AppointmentsScheduler() {
  const { user } = useAuth()
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [scheduleIds, setScheduleIds] = useState<string[]>([])
  
  // ✅ Estado para pacientes
  const [patients, setPatients] = useState<Patient[]>([])
  const [loadingPatients, setLoadingPatients] = useState(false)
  
  // Hook de confirmação
  const {
    pendingConfirmations,
    showModal,
    setShowModal,
    confirmAppointment,
    confirmMultiple,
    markAsNoShow,
    getConfirmationStatus,
  } = useAppointmentConfirmation(appointments, selectedDates[0] || null)
  
  useEffect(() => {
    const fetchScheduleIds = async () => {
      if (!user?.id) return
      
      try {
        const schedules = await scheduleService.getSchedules(user.id)
        
        if (schedules && schedules.length > 0) {
          const ids = schedules.map((s: { id: string }) => s.id)
          setScheduleIds(ids)
        } else {
          console.warn('⚠️ Profissional não possui agenda cadastrada')
        }
      } catch (error) {
        console.error('❌ Erro ao buscar scheduleIds:', error)
      }
    }
    
    fetchScheduleIds()
  }, [user?.id])

  // ✅ BUSCAR PACIENTES - Usando API diretamente
  useEffect(() => {
    const fetchPatients = async () => {
      if (!user?.id) {
        console.warn('⚠️ Usuário não autenticado, não buscando pacientes')
        return
      }
      
      console.log('🔍 Iniciando busca de pacientes...')
      console.log('🔍 ID do profissional:', user.id)
      
      setLoadingPatients(true)
      
      try {
        console.log('🔄 [API CALL] Buscando pacientes do profissional:', user.id)
        console.log('🔄 [API CALL] URL:', `/professionals/patients/${user.id}`)
        
        const response = await api.get<PatientsResponse>(
          `/professionals/patients/${user.id}`
        )
        
        console.log('✅ [API RESPONSE] Resposta completa:', response.data)
        console.log('✅ [API RESPONSE] Status:', response.status)
        
        const patientsData = response.data?.patients || []
        
        console.log('✅ Pacientes extraídos:', patientsData)
        console.log('✅ Total de pacientes:', patientsData.length)
        
        setPatients(patientsData)
        
      } catch (error: any) {
        console.error('❌ [API ERROR] Erro ao buscar pacientes:', error)
        console.error('❌ [API ERROR] Status:', error?.response?.status)
        console.error('❌ [API ERROR] Data:', error?.response?.data)
        console.error('❌ [API ERROR] Message:', error?.message)
        
        // Se for 404, não é erro crítico
        if (error?.response?.status === 404) {
          console.log('⚠️ [API] Nenhum paciente encontrado (404) - Isso é normal')
        }
        
        setPatients([])
      } finally {
        setLoadingPatients(false)
        console.log('🏁 Busca de pacientes finalizada')
      }
    }
    
    fetchPatients()
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
      
      const allSchedulings = await Promise.all(
        scheduleIds.map(scheduleId => 
          scheduleService.getSchedulingsByDateRange(startDate, endDate, scheduleId)
            .catch(err => {
              console.error(`Erro ao buscar agendamentos da agenda ${scheduleId}:`, err)
              return []
            })
        )
      )
      
      const schedulings = allSchedulings.flat()
      
      if (!Array.isArray(schedulings)) {
        console.warn('⚠️ Resposta não é um array:', schedulings)
        setAppointments([])
        return
      }
      
      if (schedulings.length === 0) {
        setAppointments([])
        return
      }
      
      const transformedAppointments: Appointment[] = schedulings.map((scheduling: PatientScheduling) => {
        return {
          id: scheduling.schedulingId,
          time: scheduling.hour,
          patient: scheduling.namePacient,
          status: 'Agendado' as AppointmentStatus,
          schedulingId: scheduling.schedulingId,
          pacientId: scheduling.pacientId,
          confirmed: false,
        }
      })
      
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

  const getConfirmationBadge = (appointmentId: string) => {
    const status = getConfirmationStatus(appointmentId)
    
    if (status === 'confirmed') {
      return (
        <span className="text-xs font-medium py-1 px-3 rounded-full border bg-blue-100 text-blue-800 border-blue-200">
          ✓ Confirmada
        </span>
      )
    }
    
    if (status === 'no-show') {
      return (
        <span className="text-xs font-medium py-1 px-3 rounded-full border bg-red-100 text-red-800 border-red-200">
          ✗ Faltou
        </span>
      )
    }
    
    return null
  }

  const isPending = (appointmentId: string) => {
    return pendingConfirmations.some(apt => apt.id === appointmentId)
  }

  const getPendingMinutes = (appointmentId: string) => {
    const pending = pendingConfirmations.find(apt => apt.id === appointmentId)
    return pending?.minutesPassed || 0
  }

  return (
    <div className="space-y-6 w-full">
      {/* Modal de Confirmação */}
      <AppointmentConfirmationModal
        open={showModal}
        onOpenChange={setShowModal}
        pendingAppointments={pendingConfirmations}
        onConfirm={confirmAppointment}
        onConfirmAll={confirmMultiple}
        onMarkAsNoShow={markAsNoShow}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Agendamentos Realizados
        </h1>
        
        {pendingConfirmations.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowModal(true)}
            className="gap-2 border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            {pendingConfirmations.length} pendente{pendingConfirmations.length > 1 ? 's' : ''}
          </Button>
        )}
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
              {!isLoading && appointments.map((appointment) => {
                const confirmationStatus = getConfirmationStatus(appointment.id)
                const hasConfirmationStatus = confirmationStatus !== null
                
                return (
                  <div key={appointment.id}>
                    <Card
                      className={`${
                        appointment.status === 'cancelled' ? 'opacity-60' : ''
                      } ${
                        appointment.status === 'available'
                          ? 'border-2 border-dashed hover:border-blue-500 cursor-pointer transition-colors'
                          : ''
                      } ${
                        isPending(appointment.id) ? 'border-l-4 border-l-orange-500' : ''
                      } ${
                        confirmationStatus === 'no-show' ? 'border-l-4 border-l-red-500' : ''
                      } ${
                        confirmationStatus === 'confirmed' ? 'border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <span className="font-medium text-gray-600 w-12 text-right shrink-0 text-sm">
                              {appointment.time}
                            </span>
                            <div className="w-px h-6 bg-gray-200" />
                            <span
                              className={`font-semibold truncate ${
                                appointment.status === 'cancelled' || confirmationStatus === 'no-show'
                                  ? 'text-gray-500 line-through'
                                  : appointment.status === 'available'
                                  ? 'text-gray-500 font-medium'
                                  : 'text-gray-900'
                              }`}
                            >
                              {appointment.patient || 'Sem agendamento'}
                            </span>
                          </div>
                          <div className="shrink-0">
                            {hasConfirmationStatus ? (
                              getConfirmationBadge(appointment.id)
                            ) : (
                              getStatusBadge(appointment.status)
                            )}
                          </div>
                        </div>

                        {isPending(appointment.id) && !hasConfirmationStatus && (
                          <PendingConfirmationBadge
                            minutesPassed={getPendingMinutes(appointment.id)}
                            onConfirm={() => confirmAppointment(appointment.id)}
                            onMarkAsNoShow={() => markAsNoShow(appointment.id)}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO DE PACIENTES */}
      <section className="w-full">
        <div className=" mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Todos os Pacientes</h2>
            {!loadingPatients && patients.length > 0 && (
              <span className="text-sm text-gray-500">
                {patients.length} paciente{patients.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Loading State */}
          {loadingPatients && (
            <div className="text-center py-8 text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2">Carregando pacientes...</p>
            </div>
          )}

          {/* Versão Desktop - Tabela */}
          {!loadingPatients && (
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
                      <TableRow key={patient.patientId}>
                        <TableCell className="font-medium">{patient.patientName}</TableCell>
                        <TableCell>{patient.patientAge} anos</TableCell>
                        <TableCell>
                          <Link 
                            to="/reports" 
                            search={{ patientId: patient.patientId }}
                          >
                            <Button variant="link" size="sm" className="gap-2 text-blue-600">
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
          )}

          {/* Versão Mobile - Cards */}
          {!loadingPatients && (
            <div className="md:hidden space-y-3">
              {patients.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  Nenhum paciente cadastrado
                </div>
              ) : (
                patients.map((patient) => (
                  <Card key={patient.patientId} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-base text-gray-900 truncate">
                            {patient.patientName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {patient.patientAge} anos
                          </p>
                          <Link
                            to="/reports"
                            search={{ patientId: patient.patientId }}
                            className="inline-block mt-2"
                          >
                            <Button variant="outline" size="sm" className="gap-2 text-xs">
                              <FileText className="w-3 h-3" />
                              Ver Relatórios
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}