import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SimpleCalendarProps {
  selectedDates: string[]
  onDateSelect: (date: string) => void
}

export function SimpleCalendar({ selectedDates, onDateSelect }: SimpleCalendarProps) {
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
  }

  // Verificar se pode navegar para o mês anterior
  const canNavigatePrev = () => {
    const prevMonth = new Date(currentYear, currentMonth - 1, 1)
    const todayMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    return prevMonth >= todayMonth
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && !canNavigatePrev()) {
      return // Não permitir navegar para meses passados
    }

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

  // Dias vazios antes do primeiro dia do mês
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-8"></div>)
  }

  // Dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    const isPast = isPastDate(day)
    const selected = isSelected(day)
    const todayDate = isToday(day)

    calendarDays.push(
      <button
        key={day}
        disabled={isPast}
        className={`h-8 w-8 text-sm rounded transition-all ${
          isPast
            ? "text-gray-400 cursor-not-allowed"
            : selected
              ? "bg-blue-600 text-white hover:bg-blue-700 font-medium"
              : todayDate
                ? "bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300"
                : "text-gray-900 hover:bg-gray-100"
        }`}
        onClick={() => !isPast && onDateSelect(formatDateString(day))}
        title={isPast ? 'Data passada' : selected ? 'Remover seleção' : 'Selecionar data'}
      >
        {day}
      </button>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="w-full">
        <div className="bg-white border rounded-lg shadow p-4 w-full">
          {/* Cabeçalho do calendário */}
          <div className="flex items-center justify-between mb-4 w-full">
            <button
              onClick={() => navigateMonth('prev')}
              disabled={!canNavigatePrev()}
              className={`p-1 rounded transition-colors ${
                canNavigatePrev() 
                  ? 'hover:bg-gray-100 text-gray-700' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title={canNavigatePrev() ? 'Mês anterior' : 'Não é possível voltar para meses passados'}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <h3 className="font-medium text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded text-gray-700 transition-colors"
              title="Próximo mês"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2 w-full">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
              <div 
                key={index} 
                className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grade do calendário */}
          <div className="grid grid-cols-7 gap-1 w-full">
            {calendarDays}
          </div>
        </div>

        {/* Indicador de datas selecionadas */}
        {selectedDates.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800 font-medium">
              {selectedDates.length} data{selectedDates.length !== 1 ? 's' : ''} selecionada{selectedDates.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Clique nas datas para adicionar ou remover
            </p>
          </div>
        )}

        {/* Dica quando não há datas selecionadas */}
        {selectedDates.length === 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-600">
              Selecione as datas desejadas para criar a agenda
            </p>
          </div>
        )}
      </div>
    </div>
  )
}