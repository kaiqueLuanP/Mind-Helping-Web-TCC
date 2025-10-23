import { X, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { CustomTime } from '../types'

interface CustomTimesInputProps {
  customTimes: CustomTime[]
  setCustomTimes: (value: CustomTime[] | ((prev: CustomTime[]) => CustomTime[])) => void
}

export function CustomTimesInput({ customTimes, setCustomTimes }: CustomTimesInputProps) {
  const [newCustomTime, setNewCustomTime] = useState('')
  const [error, setError] = useState('')

  const addCustomTime = () => {
    // Limpar erro anterior
    setError('')

    // Validar se o campo está vazio
    if (!newCustomTime) {
      setError('Selecione um horário')
      return
    }

    // Validar se o horário já existe
    if (customTimes.some(ct => ct.time === newCustomTime)) {
      setError('Este horário já foi adicionado')
      return
    }

    try {
      const newTime: CustomTime = {
        id: `custom-${Date.now()}`,
        time: newCustomTime
      }
      setCustomTimes(prev => [...prev, newTime].sort((a, b) => a.time.localeCompare(b.time)))
      setNewCustomTime('')
      setError('')
    } catch (err) {
      setError('Erro ao adicionar horário')
      console.error('Erro ao adicionar horário:', err)
    }
  }

  const removeCustomTime = (id: string) => {
    try {
      setCustomTimes(prev => prev.filter(ct => ct.id !== id))
    } catch (err) {
      console.error('Erro ao remover horário:', err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCustomTime()
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-600 mb-1">Horários de consulta</label>
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <input
            type="time"
            value={newCustomTime}
            onChange={(e) => {
              setNewCustomTime(e.target.value)
              setError('') // Limpar erro ao digitar
            }}
            onKeyPress={handleKeyPress}
            className={`w-full border rounded px-2 py-1 text-sm ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Adicionar horário"
          />
        </div>
        <button
          type="button"
          onClick={addCustomTime}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          Adicionar
        </button>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-xs mb-2">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}

      {/* Lista de horários adicionados */}
      {customTimes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customTimes.map((customTime) => (
            <div 
              key={customTime.id} 
              className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
            >
              <span className="text-sm">{customTime.time}</span>
              <button
                type="button"
                onClick={() => removeCustomTime(customTime.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Remover horário"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Indicador de quantidade */}
      {customTimes.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          {customTimes.length} horário{customTimes.length !== 1 ? 's' : ''} adicionado{customTimes.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}