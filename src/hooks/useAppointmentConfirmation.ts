import { useState, useEffect, useCallback } from 'react'
import scheduleService from '@/services/scheduleService'

interface Appointment {
  id: string
  time: string
  patient: string | null
  status: 'Agendado' | 'cancelled' | 'available'
  schedulingId?: string
  pacientId?: string
  confirmed?: boolean
  confirmedAt?: string
}

interface PendingAppointment extends Appointment {
  minutesPassed: number
}

// ✅ Tipos de ação para diferenciar confirmado de falta
type ConfirmationAction = 'confirmed' | 'no-show'

interface ConfirmationRecord {
  id: string
  action: ConfirmationAction
  timestamp: string
}

export function useAppointmentConfirmation(
  appointments: Appointment[],
  selectedDate: string | null
) {
  const [pendingConfirmations, setPendingConfirmations] = useState<PendingAppointment[]>([])
  const [showModal, setShowModal] = useState(false)
  const [confirmations, setConfirmations] = useState<Map<string, ConfirmationRecord>>(new Map())

  // Carregar confirmações do localStorage ao iniciar
  useEffect(() => {
    const savedConfirmations = localStorage.getItem('confirmed-appointments')
    if (savedConfirmations) {
      try {
        const parsed: ConfirmationRecord[] = JSON.parse(savedConfirmations)
        const map = new Map(parsed.map(record => [record.id, record]))
        setConfirmations(map)
      } catch (error) {
        console.error('Erro ao carregar confirmações:', error)
      }
    }
  }, [])

  // Salvar confirmações no localStorage sempre que mudar
  useEffect(() => {
    if (confirmations.size > 0) {
      const records = Array.from(confirmations.values())
      localStorage.setItem('confirmed-appointments', JSON.stringify(records))
    }
  }, [confirmations])

  // ✅ Formatar tempo em horas e minutos
  const formatTimePassed = useCallback((minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minuto${minutes !== 1 ? 's' : ''}`
    }
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (remainingMinutes === 0) {
      return `${hours} hora${hours !== 1 ? 's' : ''}`
    }
    
    return `${hours}h ${remainingMinutes}min`
  }, [])

  // Verificar consultas pendentes a cada 30 segundos
  const checkPendingAppointments = useCallback(() => {
    if (!selectedDate || appointments.length === 0) {
      setPendingConfirmations([])
      return
    }

    const now = new Date()
    const pending: PendingAppointment[] = []

    appointments.forEach((apt) => {
      // Pular se já foi processado (confirmado OU falta)
      if (confirmations.has(apt.id) || apt.confirmed) return
      
      // Apenas consultas agendadas
      if (apt.status !== 'Agendado' || !apt.patient) return

      const [hours, minutes] = apt.time.split(':').map(Number)
      const [year, month, day] = selectedDate.split('-').map(Number)
      
      const appointmentDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0)

      const timeDiff = now.getTime() - appointmentDateTime.getTime()
      const minutesPassed = Math.floor(timeDiff / (1000 * 60))

      // Consulta passou há mais de 5 minutos
      if (minutesPassed >= 5) {
        pending.push({
          ...apt,
          minutesPassed,
        })
      }
    })

    setPendingConfirmations(pending)

    // Mostrar modal se houver 3+ consultas não confirmadas
    if (pending.length >= 3 && !showModal) {
      setShowModal(true)
    }
  }, [appointments, selectedDate, confirmations, showModal])

  // Verificar a cada 30 segundos
  useEffect(() => {
    checkPendingAppointments()
    const interval = setInterval(checkPendingAppointments, 30000)
    return () => clearInterval(interval)
  }, [checkPendingAppointments])

  // Confirmar uma consulta
  const confirmAppointment = useCallback(async (appointmentId: string) => {
    console.log('🎯 [HOOK] Iniciando confirmação de consulta:', appointmentId)
    
    try {
      console.log('🎯 [HOOK] Chamando scheduleService.confirmAppointment...')
      const result = await scheduleService.confirmAppointment(appointmentId)
      console.log('🎯 [HOOK] Resposta recebida da API:', result)
      
      const newConfirmations = new Map(confirmations)
      newConfirmations.set(appointmentId, {
        id: appointmentId,
        action: 'confirmed',
        timestamp: new Date().toISOString()
      })
      setConfirmations(newConfirmations)
      
      setPendingConfirmations(prev => prev.filter(apt => apt.id !== appointmentId))
      
      console.log('✅ [HOOK] Consulta confirmada e salva no localStorage')
      return true
    } catch (error: any) {
      console.log('⚠️ [HOOK] Tratando resposta da API...')
      
      if (error?.response?.status === 204) {
        console.log('✅ [HOOK] API retornou 204 (No Content) - Considerando sucesso')
        
        const newConfirmations = new Map(confirmations)
        newConfirmations.set(appointmentId, {
          id: appointmentId,
          action: 'confirmed',
          timestamp: new Date().toISOString()
        })
        setConfirmations(newConfirmations)
        
        setPendingConfirmations(prev => prev.filter(apt => apt.id !== appointmentId))
        console.log('✅ [HOOK] Consulta confirmada e salva no localStorage')
        return true
      }
      
      console.error('❌ [HOOK] Erro não tratado ao confirmar consulta:', error)
      return false
    }
  }, [confirmations])

  // Confirmar múltiplas consultas
  const confirmMultiple = useCallback(async (appointmentIds: string[]) => {
    try {
      const results = await scheduleService.confirmMultipleAppointments(appointmentIds)
      
      const newConfirmations = new Map(confirmations)
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          newConfirmations.set(appointmentIds[index], {
            id: appointmentIds[index],
            action: 'confirmed',
            timestamp: new Date().toISOString()
          })
        }
      })
      
      setConfirmations(newConfirmations)
      setPendingConfirmations(prev => 
        prev.filter(apt => !newConfirmations.has(apt.id))
      )
      
      setShowModal(false)
      
      const successCount = results.filter(r => r.status === 'fulfilled').length
      console.log(`✅ ${successCount}/${appointmentIds.length} consultas confirmadas`)
      
      return true
    } catch (error: any) {
      console.error('❌ Erro ao confirmar consultas:', error)
      return false
    }
  }, [confirmations])

  // Marcar como não compareceu
  const markAsNoShow = useCallback(async (appointmentId: string) => {
    try {
      await scheduleService.markAsNoShow(appointmentId)
      
      // ✅ Marca como "no-show" ao invés de "confirmed"
      const newConfirmations = new Map(confirmations)
      newConfirmations.set(appointmentId, {
        id: appointmentId,
        action: 'no-show',
        timestamp: new Date().toISOString()
      })
      setConfirmations(newConfirmations)
      
      setPendingConfirmations(prev => prev.filter(apt => apt.id !== appointmentId))
      
      console.log('✅ Consulta marcada como falta:', appointmentId)
      return true
    } catch (error: any) {
      if (error?.response?.status === 204) {
        const newConfirmations = new Map(confirmations)
        newConfirmations.set(appointmentId, {
          id: appointmentId,
          action: 'no-show',
          timestamp: new Date().toISOString()
        })
        setConfirmations(newConfirmations)
        
        setPendingConfirmations(prev => prev.filter(apt => apt.id !== appointmentId))
        return true
      }
      
      console.error('❌ Erro ao marcar como falta:', error)
      return false
    }
  }, [confirmations])

  // Limpar confirmações antigas
  const clearOldConfirmations = useCallback(() => {
    localStorage.removeItem('confirmed-appointments')
    setConfirmations(new Map())
  }, [])

  // ✅ Verificar tipo de confirmação
  const getConfirmationStatus = useCallback((id: string): ConfirmationAction | null => {
    const record = confirmations.get(id)
    return record?.action || null
  }, [confirmations])

  return {
    pendingConfirmations,
    showModal,
    setShowModal,
    confirmAppointment,
    confirmMultiple,
    markAsNoShow,
    clearOldConfirmations,
    formatTimePassed,
    hasPending: pendingConfirmations.length > 0,
    isConfirmed: (id: string) => confirmations.get(id)?.action === 'confirmed',
    isNoShow: (id: string) => confirmations.get(id)?.action === 'no-show',
    getConfirmationStatus,
  }
}