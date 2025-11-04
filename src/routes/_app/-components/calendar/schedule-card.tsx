import { Schedule } from '../types'
import { TimeSlotsSidebar } from './time-slots-sidebar'
import { Pencil, Trash2 } from 'lucide-react'

interface ScheduleCardProps {
  schedule: Schedule
  onEdit: (schedule: Schedule) => void
  onDelete: (id: string) => void
  isEditing?: boolean // Nova prop
}

export function ScheduleCard({ schedule, onEdit, onDelete, isEditing = false }: ScheduleCardProps) {
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <div className={`bg-white border rounded-lg shadow-sm p-4 transition-all ${
      isEditing ? 'ring-2 ring-blue-400' : ''
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-medium text-base">
            {schedule.dates.map(formatDate).join(', ')}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            Horários: {schedule.startTime} - {schedule.endTime} 
            {schedule.isControlledByHours && ` (${schedule.intervalMinutes} slots)`}
          </p>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(schedule)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(schedule.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <TimeSlotsSidebar
        isControlledByHours={schedule.isControlledByHours}
        generatedTimes={schedule.generatedTimes}
        customTimes={schedule.customTimes}
        scheduleId={schedule.id}
        isEditing={isEditing}
      />

      {schedule.observations && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-600">
            <strong>Observações:</strong> {schedule.observations}
          </p>
        </div>
      )}
    </div>
  )
}