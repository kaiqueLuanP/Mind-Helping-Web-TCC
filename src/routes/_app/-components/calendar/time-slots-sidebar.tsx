import { useEffect, useState } from 'react'
import { CustomTime } from '../types'
import scheduleService from '@/services/scheduleService'

interface TimeSlotsSidebarProps {
  isControlledByHours: boolean
  generatedTimes: string[]
  customTimes: CustomTime[]
  scheduleId?: string 
  isEditing?: boolean // Nova prop para controlar expansão
}

interface HourlySlot {
  scheduleId: string
  date: string
  id: string
  hour: string
  isOcuped: boolean
}

export function TimeSlotsSidebar({ 
  isControlledByHours, 
  generatedTimes, 
  customTimes,
  scheduleId,
  isEditing = false // Por padrão, não está editando
}: TimeSlotsSidebarProps) {
  const [apiHourlies, setApiHourlies] = useState<HourlySlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const PREVIEW_LIMIT = 6 // Mostrar apenas 6 horários inicialmente

  useEffect(() => {
    if (scheduleId && isControlledByHours) {
      fetchHourlies()
    }
  }, [scheduleId, isControlledByHours])

  // Quando estiver editando, expandir automaticamente
  useEffect(() => {
    if (isEditing) {
      setShowAll(true)
    }
  }, [isEditing])

  const fetchHourlies = async () => {
    if (!scheduleId) return

    setLoading(true)
    setError(null)

    try {
      const data = await scheduleService.getHourlies(scheduleId)
      setApiHourlies(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      console.error('❌ Erro ao buscar hourlies:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Decidir qual fonte de horários usar
  const allTimes = isControlledByHours
    ? (apiHourlies.length > 0 ? apiHourlies : generatedTimes.map((time, i) => ({ 
        id: `temp-${i}`, 
        hour: time, 
        isOcuped: false,
        scheduleId: scheduleId || '',
        date: ''
      })))
    : customTimes.map((ct, i) => ({ 
        id: `custom-${i}`, 
        hour: ct.time, 
        isOcuped: false,
        scheduleId: scheduleId || '',
        date: ''
      }))

  const displayedTimes = showAll || isEditing ? allTimes : allTimes.slice(0, PREVIEW_LIMIT)
  const remainingCount = allTimes.length - PREVIEW_LIMIT

  return (
    <div className="bg-white border rounded-lg shadow-sm p-3">
      <h4 className="font-medium text-sm mb-2 text-gray-700">
        {isControlledByHours ? 'Horários gerados' : 'Horários customizados'}
      </h4>

      {loading && (
        <div className="text-center text-gray-500 text-xs py-2">
          Carregando...
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 text-xs py-2">
          {error}
        </div>
      )}

      {!loading && !error && displayedTimes.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            {displayedTimes.map((hourly) => (
              <div 
                key={hourly.id} 
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  hourly.isOcuped 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}
              >
                {hourly.hour}
              </div>
            ))}
            
            {/* Botão "+X mais" */}
            {!showAll && !isEditing && remainingCount > 0 && (
              <button
                onClick={() => setShowAll(true)}
                className="px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 transition-colors"
              >
                +{remainingCount} mais
              </button>
            )}
          </div>

          {/* Botão "Ver menos" */}
          {showAll && !isEditing && allTimes.length > PREVIEW_LIMIT && (
            <button
              onClick={() => setShowAll(false)}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Ver menos
            </button>
          )}
        </>
      ) : (
        !loading && !error && (
          <div className="text-center text-gray-400 text-xs py-2">
            {isControlledByHours
              ? 'Nenhum horário disponível'
              : 'Adicione horários manualmente'
            }
          </div>
        )
      )}
    </div>
  )
}