import { useEffect, useState } from 'react'
import { CustomTime } from '../types'
import scheduleService from '@/services/scheduleService'

interface TimeSlotsSidebarProps {
  isControlledByHours: boolean
  generatedTimes: string[]
  customTimes: CustomTime[]
  scheduleId?: string 
  isEditing?: boolean
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
  isEditing = false
}: TimeSlotsSidebarProps) {
  const [apiHourlies, setApiHourlies] = useState<HourlySlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const PREVIEW_LIMIT = 6

  // ✅ CORREÇÃO: Buscar hourlies SEMPRE que houver scheduleId, independente do modo
  useEffect(() => {
    if (scheduleId) {
      console.log('🔍 [SIDEBAR] Buscando hourlies para schedule:', scheduleId);
      console.log('🔍 [SIDEBAR] Modo:', isControlledByHours ? 'CONTROLADO' : 'LIVRE');
      fetchHourlies()
    }
  }, [scheduleId]) // ✅ Removido isControlledByHours da dependência

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
      console.log('📤 [SIDEBAR] Chamando API /hourlies/' + scheduleId);
      const data = await scheduleService.getHourlies(scheduleId)
      console.log('📦 [SIDEBAR] Hourlies recebidos:', data);
      console.log('📦 [SIDEBAR] Quantidade:', data.length);
      setApiHourlies(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      console.error('❌ [SIDEBAR] Erro ao buscar hourlies:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Determinar quais horários exibir
  let allTimes: HourlySlot[] = [];

  if (apiHourlies.length > 0) {
    // ✅ Se tem hourlies da API, usar eles (SEMPRE - controlado ou livre)
    console.log('✅ [SIDEBAR] Usando hourlies da API:', apiHourlies.length);
    allTimes = apiHourlies;
  } else if (isControlledByHours && generatedTimes.length > 0) {
    // ✅ Fallback: horários gerados localmente (modo controlado)
    console.log('⚠️ [SIDEBAR] Usando horários gerados localmente:', generatedTimes.length);
    allTimes = generatedTimes.map((time, i) => ({ 
      id: `temp-${i}`, 
      hour: time, 
      isOcuped: false,
      scheduleId: scheduleId || '',
      date: ''
    }));
  } else if (!isControlledByHours && customTimes.length > 0) {
    // ✅ Fallback: horários customizados locais (modo livre)
    console.log('⚠️ [SIDEBAR] Usando horários customizados locais:', customTimes.length);
    allTimes = customTimes.map((ct, i) => ({ 
      id: `custom-${i}`, 
      hour: ct.time,
      isOcuped: false,
      scheduleId: scheduleId || '',
      date: ''
    }));
  }

  const displayedTimes = showAll || isEditing ? allTimes : allTimes.slice(0, PREVIEW_LIMIT)
  const remainingCount = allTimes.length - PREVIEW_LIMIT

  return (
    <div className="bg-white border rounded-lg shadow-sm p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm text-gray-700">
          {isControlledByHours ? 'Horários gerados' : 'Horários customizados'}
        </h4>
        
        {/* ✅ Botão de refresh manual */}
        {scheduleId && (
          <button
            onClick={fetchHourlies}
            disabled={loading}
            className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            title="Atualizar horários"
          >
            {loading ? '🔄' : '↻'}
          </button>
        )}
      </div>

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
                className={`px-2.5 py-1 rounded text-xs font-medium text-center ${
                  hourly.isOcuped 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}
              >
                {hourly.hour}
              </div>
            ))}
            
            {!showAll && !isEditing && remainingCount > 0 && (
              <button
                onClick={() => setShowAll(true)}
                className="px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 transition-colors"
              >
                +{remainingCount} mais
              </button>
            )}
          </div>

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
            {scheduleId 
              ? 'Nenhum horário disponível'
              : isControlledByHours
                ? 'Configure horário inicial e final'
                : 'Adicione horários manualmente'
            }
          </div>
        )
      )}
    </div>
  )
}