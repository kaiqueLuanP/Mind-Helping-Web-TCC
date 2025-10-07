import { X } from 'lucide-react'
import { useState } from 'react'
import { CustomTime } from './types'

interface CustomTimesInputProps {
  customTimes: CustomTime[]
  setCustomTimes: (value: CustomTime[] | ((prev: CustomTime[]) => CustomTime[])) => void
}

export function CustomTimesInput({ customTimes, setCustomTimes }: CustomTimesInputProps) {
  const [newCustomTime, setNewCustomTime] = useState('')

  const addCustomTime = () => {
    if (newCustomTime && !customTimes.some(ct => ct.time === newCustomTime)) {
      const newTime: CustomTime = {
        id: `custom-${Date.now()}`,
        time: newCustomTime
      }
      setCustomTimes(prev => [...prev, newTime].sort((a, b) => a.time.localeCompare(b.time)))
      setNewCustomTime('')
    }
  }

  const removeCustomTime = (id: string) => {
    setCustomTimes(prev => prev.filter(ct => ct.id !== id))
  }

  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-600 mb-1">Horários de consulta</label>
      <div className="flex gap-2 mb-2">
        <input
          type="time"
          value={newCustomTime}
          onChange={(e) => setNewCustomTime(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
          placeholder="Adicionar horário"
        />
        <button
          type="button"
          onClick={addCustomTime}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Adicionar
        </button>
      </div>

      {customTimes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customTimes.map((customTime) => (
            <div key={customTime.id} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
              <span className="text-sm">{customTime.time}</span>
              <button
                type="button"
                onClick={() => removeCustomTime(customTime.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}