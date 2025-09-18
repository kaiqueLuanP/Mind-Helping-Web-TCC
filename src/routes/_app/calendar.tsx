import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Layout from '../../components/Layout'
import { Calendar, Clock, Edit3, Trash2, Plus, CheckSquare, Square } from 'lucide-react'

export const Route = createFileRoute('/_app/calendar')({
  component: CalendarComponent,
})

interface Schedule {
  id: string
  date: string
  startTime: string
  endTime: string
  price?: string
  cancellationPolicy: string
  observations: string
  isControlledByHours: boolean
  generatedTimes: string[]
}

// Componente simples de calendário
function SimpleCalendar({ selectedDates, onDateSelect }: { 
  selectedDates: string[], 
  onDateSelect: (date: string) => void 
}) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  const isPastDate = (day: number) => {
  const date = new Date(currentYear, currentMonth, day)
  return date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
} //se o dia for anterior ao atual nao pode ser selecionado
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }
  
  const formatDateString = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }
  
  const isSelected = (day: number) => {
    return selectedDates.includes(formatDateString(day))
  }
  
  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === currentMonth && 
           today.getFullYear() === currentYear
  }
  
  const calendarDays = []
  
  // Dias vazios no início
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-8"></div>)
  }
  
  // Dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
     <button
  key={day}
  disabled={isPastDate(day)}
  className={`h-8 w-8 text-sm rounded transition-colors ${
    isPastDate(day)
      ? "text-gray-400 cursor-not-allowed"
      : isSelected(day)
      ? "bg-blue-600 text-white"
      : isToday(day)
      ? "bg-gray-200 text-gray-900 font-semibold"
      : "text-gray-900 hover:bg-gray-100"
  }`}
  onClick={() => !isPastDate(day) && onDateSelect(formatDateString(day))}
>
  {day}
</button>
//validar se vai deixar assim 
    )
  }
  
  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-1 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h3 className="font-medium">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={() => navigateMonth('next')}
          className="p-1 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
          <div key={index} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays}
      </div>
    </div>
  )
}

function CalendarComponent() {
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [price, setPrice] = useState('')
  const [cancellationPolicy, setCancellationPolicy] = useState('')
  const [observations, setObservations] = useState('')
  const [isControlledByHours, setIsControlledByHours] = useState(false)
  const [intervalMinutes, setIntervalMinutes] = useState(30)
  const [generatedTimes, setGeneratedTimes] = useState<string[]>([])
  const [createdSchedules, setCreatedSchedules] = useState<Schedule[]>([])

  const handleDateSelect = (date: string) => {
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    )
  }

  const generateTimeSlots = () => {
    if (!startTime || !endTime) return []
    
    const slots: string[] = []
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    
    let current = new Date(start)
    
    while (current < end) {
      slots.push(current.toTimeString().slice(0, 5))
      current.setMinutes(current.getMinutes() + intervalMinutes)
    }
    
    return slots
  }

  const handleGenerateTimes = () => {
    if (isControlledByHours && startTime && endTime) {
      const times = generateTimeSlots()
      setGeneratedTimes(times)
    }
  }

  React.useEffect(() => {
    handleGenerateTimes()
  }, [startTime, endTime, intervalMinutes, isControlledByHours])

  const handleCreateSchedule = () => {
    if ((selectedDates.length > 0 || (startDate && endDate)) && startTime && endTime) {
      const datesToUse = selectedDates.length > 0 ? selectedDates : [startDate, endDate]
      
      datesToUse.forEach(date => {
        if (date) {
          const newSchedule: Schedule = {
            id: `schedule-${Date.now()}-${Math.random()}`,
            date,
            startTime,
            endTime,
            price,
            cancellationPolicy,
            observations,
            isControlledByHours,
            generatedTimes: isControlledByHours ? generatedTimes : []
          }
          
          setCreatedSchedules(prev => [...prev, newSchedule])
        }
      })
      
      // Limpar formulário
      setSelectedDates([])
      setStartDate('')
      setEndDate('')
      setStartTime('')
      setEndTime('')
      setPrice('')
      setCancellationPolicy('')
      setObservations('')
      setGeneratedTimes([])
    }
  }

  const handleDeleteSchedule = (id: string) => {
    setCreatedSchedules(prev => prev.filter(s => s.id !== id))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR')
  }

  return (
    <Layout>
      <div className="p-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Agenda</h2>

        {/* Layout responsivo */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Coluna esquerda - Calendário */}
          <div className="xl:col-span-3 space-y-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendário
              </h3>
              <SimpleCalendar 
                selectedDates={selectedDates}
                onDateSelect={handleDateSelect}
              />
              
              {selectedDates.length > 0 && (
                <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {selectedDates.length} data(s) selecionada(s)
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Coluna central - Formulário */}
          <div className="xl:col-span-7">
            <div className="bg-white border rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Informe os horários
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Hora inicial</label>
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Hora final</label>
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* Checkbox para agenda controlada por horários */}
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setIsControlledByHours(!isControlledByHours)}
                    className="text-blue-600"
                  >
                    {isControlledByHours ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                  </button>
                  <span className="text-sm text-gray-700">Agenda controlada por horários</span>
                </label>
                
                {isControlledByHours && (
                  <div className="mt-2">
                    <label className="block text-sm text-gray-600 mb-1">Intervalo (minutos)</label>
                    <select 
                      value={intervalMinutes}
                      onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value={15}>15 minutos</option>
                      <option value={30}>30 minutos</option>
                      <option value={45}>45 minutos</option>
                      <option value={60}>1 hora</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">Valor médio da consulta (opcional)</label>
                <input 
                  type="text" 
                  placeholder="R$ 100,00" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full md:w-1/2 border rounded px-2 py-1 text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Informar a política de cancelamento da consulta
                </label>
                <textarea 
                  className="w-full border rounded px-2 py-1 text-sm" 
                  rows={3} 
                  placeholder="Ex: o paciente poderá cancelar..."
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-1">
                  Deseja adicionar alguma observação?
                </label>
                <textarea 
                  className="w-full border rounded px-2 py-1 text-sm" 
                  rows={4}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                />
              </div>

              <div className="text-center">
                <button 
                  onClick={handleCreateSchedule}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Criar Agenda
                </button>
              </div>
            </div>
          </div>

          {/* Coluna direita - Horários gerados */}
          <div className="xl:col-span-2">
            <div className="bg-white border rounded-lg shadow p-4">
              <h4 className="font-medium mb-3">Horários gerados</h4>
              {generatedTimes.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {generatedTimes.map((time, index) => (
                    <div key={index} className="p-2 border rounded-md text-sm text-center bg-gray-50">
                      {time}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm py-4">
                  {isControlledByHours ? 'Configure os horários acima' : 'Ative a agenda controlada por horários'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agendas criadas */}
    
        {createdSchedules.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Agendas Criadas ({createdSchedules.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdSchedules.map((schedule) => (
                <div key={schedule.id} className="bg-white border rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">
                      {formatDate(schedule.date)}
                    </h4>
                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Horário:</strong> {schedule.startTime} - {schedule.endTime}</p>
                    {schedule.price && <p><strong>Valor:</strong> {schedule.price}</p>}
                    {schedule.isControlledByHours && (
                      <p><strong>Horários:</strong> {schedule.generatedTimes.length} slots</p>
                    )}
                    {schedule.cancellationPolicy && (
                      <p><strong>Cancelamento:</strong> {schedule.cancellationPolicy.slice(0, 50)}...</p>
                    )}
                  </div>
                  
                  {schedule.isControlledByHours && schedule.generatedTimes.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">Horários disponíveis:</div>
                      <div className="flex flex-wrap gap-1">
                        {schedule.generatedTimes.slice(0, 6).map((time, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {time}
                          </span>
                        ))}
                        {schedule.generatedTimes.length > 6 && (
                          <span className="text-xs text-gray-500">
                            +{schedule.generatedTimes.length - 6} mais
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}