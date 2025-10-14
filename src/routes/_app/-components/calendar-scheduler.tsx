import { useState } from 'react' 
import { SimpleCalendar } from './simple-calendar'
import { ScheduleForm } from './schedule-form'
import { TimeSlotsSidebar } from './time-slots-sidebar'
import { SchedulesList } from './schedules-list'
import { Schedule, CustomTime } from './types'
import { Toast, ToastContainer } from '@/components/ui/toast'

export function CalendarScheduler() {
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [price, setPrice] = useState('')
  const [cancellationPolicy, setCancellationPolicy] = useState<number | "">("")
  const [observations, setObservations] = useState('')
  const [isControlledByHours, setIsControlledByHours] = useState(false)
  const [intervalMinutes, setIntervalMinutes] = useState(30)
  const [generatedTimes, setGeneratedTimes] = useState<string[]>([])
  const [customTimes, setCustomTimes] = useState<CustomTime[]>([])
  const [createdSchedules, setCreatedSchedules] = useState<Schedule[]>([])
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null)

  // Estado para toasts
  const [toasts, setToasts] = useState<Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'warning'
  }>>([])

  // Função para adicionar toast
  const addToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, message, type }])
  }

  // Função para remover toast
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // Validar formulário
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []


    if (selectedDates.length === 0) {
      errors.push('Selecione pelo menos uma data')
    }

    if (isControlledByHours) {
      if (!startTime) {
        errors.push('A hora inicial é obrigatória')
      }
      if (!endTime) {
        errors.push('A hora final é obrigatória')
      }
      if (startTime && endTime && startTime >= endTime) {
        errors.push('A hora final deve ser maior que a hora inicial')
      }
      if (startTime && endTime && generatedTimes.length === 0) {
        errors.push('Nenhum horário foi gerado. Verifique o intervalo.')
      }
    } else {
      if (customTimes.length === 0) {
        errors.push('Adicione pelo menos um horário de consulta')
      }
    }

    if (cancellationPolicy !== "" && cancellationPolicy < 0) {
      errors.push('A política de cancelamento não pode ser negativa')
    }

    return { isValid: errors.length === 0, errors }
  }

  const handleDateSelect = (date: string) => {
    setSelectedDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    )
  }

  const handleCreateSchedule = () => {
    const validation = validateForm()
    
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        addToast(error, 'error')
      })
      return
    }

    try {
      const newSchedule: Schedule = {
        id: `schedule-${Date.now()}`,
        dates: [...selectedDates],
        startTime,
        endTime,
        price,
        cancellationPolicy,
        observations,
        isControlledByHours,
        generatedTimes: isControlledByHours ? generatedTimes : [],
        customTimes: isControlledByHours ? [] : [...customTimes],
        intervalMinutes
      }

      setCreatedSchedules(prev => [...prev, newSchedule])
      clearForm()
      addToast('Agenda criada com sucesso!', 'success')
    } catch (error) {
      addToast('Erro ao criar agenda. Tente novamente.', 'error')
      console.error('Erro ao criar agenda:', error)
    }
  }

  const handleEditSchedule = (schedule: Schedule) => {
    try {
      setEditingSchedule(schedule.id)
      setSelectedDates([...schedule.dates])
      setStartTime(schedule.startTime)
      setEndTime(schedule.endTime)
      setPrice(schedule.price || '')
      setCancellationPolicy(schedule.cancellationPolicy)
      setObservations(schedule.observations)
      setIsControlledByHours(schedule.isControlledByHours)
      setIntervalMinutes(schedule.intervalMinutes)
      setCustomTimes([...schedule.customTimes])
      setGeneratedTimes([...schedule.generatedTimes])
      
      // Scroll suave para o formulário
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      addToast('Erro ao carregar agenda para edição.', 'error')
      console.error('Erro ao editar agenda:', error)
    }
  }

  const handleSaveEdit = () => {
    const validation = validateForm()
    
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        addToast(error, 'error')
      })
      return
    }

    try {
      if (editingSchedule) {
        setCreatedSchedules(prev =>
          prev.map(schedule =>
            schedule.id === editingSchedule
              ? {
                ...schedule,
                dates: [...selectedDates],
                startTime,
                endTime,
                price,
                cancellationPolicy,
                observations,
                isControlledByHours,
                generatedTimes: isControlledByHours ? generatedTimes : [],
                customTimes: isControlledByHours ? [] : [...customTimes],
                intervalMinutes
              }
              : schedule
          )
        )
        clearForm()
        addToast('Agenda atualizada com sucesso!', 'success')
      }
    } catch (error) {
      addToast('Erro ao atualizar agenda. Tente novamente.', 'error')
      console.error('Erro ao atualizar agenda:', error)
    }
  }

  const handleDeleteSchedule = (id: string) => {
    try {
      setCreatedSchedules(prev => prev.filter(s => s.id !== id))
      if (editingSchedule === id) {
        clearForm()
      }
      addToast('Agenda excluída com sucesso!', 'success')
    } catch (error) {
      addToast('Erro ao excluir agenda. Tente novamente.', 'error')
      console.error('Erro ao excluir agenda:', error)
    }
  }

  const clearForm = () => {
    setEditingSchedule(null)
    setSelectedDates([])
    setStartTime('')
    setEndTime('')
    setPrice('')
    setCancellationPolicy('')
    setObservations('')
    setIsControlledByHours(false)
    setIntervalMinutes(30)
    setGeneratedTimes([])
    setCustomTimes([])
  }

  return (
    <>
      {/* Container de Toasts */}
      <ToastContainer>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4 flex flex-col items-center w-full">
          <div className="w-full">
            <SimpleCalendar
              selectedDates={selectedDates}
              onDateSelect={handleDateSelect}
            />
          
            {(isControlledByHours ? generatedTimes.length > 0 : customTimes.length > 0) && (
              <TimeSlotsSidebar
                isControlledByHours={isControlledByHours}
                generatedTimes={generatedTimes}
                customTimes={customTimes}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <ScheduleForm 
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            price={price}
            setPrice={setPrice}
            cancellationPolicy={cancellationPolicy}
            setCancellationPolicy={setCancellationPolicy}
            observations={observations}
            setObservations={setObservations}
            isControlledByHours={isControlledByHours}
            setIsControlledByHours={setIsControlledByHours}
            intervalMinutes={intervalMinutes}
            setIntervalMinutes={setIntervalMinutes}
            generatedTimes={generatedTimes}
            setGeneratedTimes={setGeneratedTimes}
            customTimes={customTimes}
            setCustomTimes={setCustomTimes}
            editingSchedule={editingSchedule}
            onCreateSchedule={handleCreateSchedule}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={clearForm}
          />
        </div>
      </div>
      {createdSchedules.length > 0 && (
        <div className="mt-8">
          <SchedulesList
            schedules={createdSchedules}
            onEdit={handleEditSchedule}
            onDelete={handleDeleteSchedule}
          />
        </div>
      )}
    </>
  )
}