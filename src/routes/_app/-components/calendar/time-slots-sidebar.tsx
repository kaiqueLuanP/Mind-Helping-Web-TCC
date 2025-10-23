import { CustomTime } from '../types'

interface TimeSlotsSidebarProps {
  isControlledByHours: boolean
  generatedTimes: string[]
  customTimes: CustomTime[]
}

export function TimeSlotsSidebar({ isControlledByHours, generatedTimes, customTimes }: TimeSlotsSidebarProps) {
  const displayTimes = isControlledByHours ? generatedTimes : customTimes.map(ct => ct.time)

  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <h4 className="font-medium mb-3">
        {isControlledByHours ? 'Horários gerados' : 'Horários customizados'}
      </h4>
      {displayTimes.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {displayTimes.map((time, index) => (
            <div key={index} className="p-2 border rounded-md text-sm text-center bg-gray-50">
              {time}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-sm py-4">
          {isControlledByHours
            ? 'Configure os horários acima'
            : 'Adicione horários manualmente'
          }
        </div>
      )}
    </div>
  )
}