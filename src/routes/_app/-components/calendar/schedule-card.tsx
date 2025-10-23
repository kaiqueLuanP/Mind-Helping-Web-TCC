import { Edit, Trash2 } from 'lucide-react'
import { Schedule } from '../types'
import { formatDate } from './schedule-helpers'

interface ScheduleCardProps {
  schedule: Schedule
  onEdit: () => void
  onDelete: () => void
}

export function ScheduleCard({ schedule, onEdit, onDelete }: ScheduleCardProps) {
  const displayTimes = schedule.isControlledByHours 
    ? schedule.generatedTimes 
    : schedule.customTimes.map(ct => ct.time)

  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-2">
        <h5 className="font-medium text-gray-800">
          {schedule.title}
        </h5>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-700 p-1"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Datas:</strong> {schedule.dates.length} dias selecionados</p>
        {schedule.isControlledByHours ? (
          <p><strong>Horários:</strong> {schedule.startTime} - {schedule.endTime} ({schedule.generatedTimes.length} slots)</p>
        ) : (
          <p><strong>Horários:</strong> {schedule.customTimes.length} horários customizados</p>
        )}
        {schedule.price && <p><strong>Valor:</strong> {schedule.price}</p>}
      </div>

      <div className="mt-3">
        <div className="text-xs text-gray-500 mb-1">Datas:</div>
        <div className="flex flex-wrap gap-1">
          {schedule.dates.slice(0, 4).map((date, index) => (
            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {formatDate(date)}
            </span>
          ))}
          {schedule.dates.length > 4 && (
            <span className="text-xs text-gray-500">
              +{schedule.dates.length - 4} mais
            </span>
          )}
        </div>
      </div>

      <div className="mt-2">
        <div className="text-xs text-gray-500 mb-1">
          {schedule.isControlledByHours ? 'Horários gerados:' : 'Horários customizados:'}
        </div>
        <div className="flex flex-wrap gap-1">
          {displayTimes.slice(0, 6).map((time, index) => (
            <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {time}
            </span>
          ))}
          {displayTimes.length > 6 && (
            <span className="text-xs text-gray-500">
              +{displayTimes.length - 6} mais
            </span>
          )}
        </div>
      </div>
    </div>
  )
}