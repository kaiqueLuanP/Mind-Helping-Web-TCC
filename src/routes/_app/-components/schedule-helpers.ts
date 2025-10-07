import { Schedule } from './types'

export function formatDate(dateString: string): string {
  return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR')
}

export function groupSchedulesByMonth(schedules: Schedule[]): { [key: string]: Schedule[] } {
  const groups: { [key: string]: Schedule[] } = {}

  schedules.forEach(schedule => {
    schedule.dates.forEach(date => {
      const monthKey = new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
      })

      if (!groups[monthKey]) {
        groups[monthKey] = []
      }

      if (!groups[monthKey].find(s => s.id === schedule.id)) {
        groups[monthKey].push(schedule)
      }
    })
  })

  return groups
}