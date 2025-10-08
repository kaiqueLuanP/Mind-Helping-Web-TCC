import { Edit3 } from 'lucide-react'
import { Schedule } from './types'
import { ScheduleCard } from './schedule-card'
import { groupSchedulesByMonth } from './schedule-helpers'

interface SchedulesListProps {
  schedules: Schedule[]
  onEdit: (schedule: Schedule) => void
  onDelete: (id: string) => void
}

export function SchedulesList({ schedules, onEdit, onDelete }: SchedulesListProps) {
  const schedulesGrouped = groupSchedulesByMonth(schedules)

  return (
    <>
      <h3 className="font-semibold mb-6 flex items-center gap-2">
        <Edit3 className="h-4 w-4" />
        Agendas Criadas
      </h3>

      {Object.entries(schedulesGrouped).map(([monthYear, monthSchedules]) => (
        <div key={monthYear} className="mb-8">
          <h4 className="font-medium text-lg mb-4 text-gray-700 capitalize">
            {monthYear}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthSchedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onEdit={() => onEdit(schedule)}
                onDelete={() => onDelete(schedule.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}