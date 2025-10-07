import { useState } from 'react'

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

  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-8"></div>)
  }

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
    )
  }

  return (
    <div className="space-y-6">
      <div>
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

        {selectedDates.length > 0 && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              {selectedDates.length} data(s) selecionada(s)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}