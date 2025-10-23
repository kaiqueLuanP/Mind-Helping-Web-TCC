import { useEffect } from 'react'
import { Clock, Plus, Save, X, CheckSquare, Square } from 'lucide-react'
import { CustomTime } from '../types'
import { CustomTimesInput } from './custom-times-input'

interface ScheduleFormProps {
  startTime: string
  setStartTime: (value: string) => void
  endTime: string
  setEndTime: (value: string) => void
  price: string
  setPrice: (value: string) => void
  cancellationPolicy: number | ""
  setCancellationPolicy: (value: number | "") => void
  observations: string
  setObservations: (value: string) => void
  isControlledByHours: boolean
  setIsControlledByHours: (value: boolean) => void
  intervalMinutes: number
  setIntervalMinutes: (value: number) => void
  generatedTimes: string[]
  setGeneratedTimes: (value: string[]) => void
  customTimes: CustomTime[]
  setCustomTimes: (value: CustomTime[] | ((prev: CustomTime[]) => CustomTime[])) => void
  editingSchedule: string | null
  onCreateSchedule: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
}

export function ScheduleForm({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  price,
  setPrice,
  cancellationPolicy,
  setCancellationPolicy,
  observations,
  setObservations,
  isControlledByHours,
  setIsControlledByHours,
  intervalMinutes,
  setIntervalMinutes,
  setGeneratedTimes,
  customTimes,
  setCustomTimes,
  editingSchedule,
  onCreateSchedule,
  onSaveEdit,
  onCancelEdit,
}: ScheduleFormProps) {

  const generateTimeSlots = () => {
    if (!startTime || !endTime) return []

    const slots: string[] = []
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)

    let current = new Date(start)

    while (current < end) {
      slots.push(current.toTimeString().slice(0, 5))
      current.setMinutes(current.getMinutes() + intervalMinutes)
    }

    return slots
  }

  useEffect(() => {
    if (isControlledByHours && startTime && endTime) {
      const times = generateTimeSlots()
      setGeneratedTimes(times)
    } else {
      setGeneratedTimes([])
    }
  }, [startTime, endTime, intervalMinutes, isControlledByHours, setGeneratedTimes])

  return (
    <div className="bg-white border rounded-lg shadow p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        {editingSchedule ? 'Editar Agenda' : 'Criar Nova Agenda'}
      </h3>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsControlledByHours(!isControlledByHours)}
            className="text-blue-600 cursor-pointer flex-shrink-0"
          >
            {isControlledByHours ? <CheckSquare className="h-4 w-4"/> : <Square className="h-4 w-4" />}
          </button>
          <span className="text-sm text-gray-700 relative group">
            Agenda controlada por horários
            <span className="invisible group-hover:visible absolute left-0 top-full mt-1 w-max bg-gray-100 text-black text-xs rounded py-1 px-2 z-10 max-w-xs">
              Ao marcar esta opção o sistema irá gerar horários automáticos de acordo com o intervalo definido.
            </span>
          </span>
        </div>
      </div>

      {isControlledByHours ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Hora inicial</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Hora final</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Intervalo (minutos)</label>
            <select
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={60}>1 hora</option>
            </select>
          </div>
        </>
      ) : (
        <CustomTimesInput
          customTimes={customTimes}
          setCustomTimes={setCustomTimes}
        />
      )}

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Valor médio da consulta (opcional)</label>
        <input
          type="text"
          placeholder="R$ 100,00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full md:w-1/2 border rounded px-2 py-1 text-sm"
        />
      </div>

      <div className="mb-4">
      <span className="text-sm text-gray-700 relative group">
          <label className="block text-sm text-gray-600 mb-1">Política de cancelamento (dias antes)</label>
            <input
              type="number"
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Ex: 24"
              value={cancellationPolicy}
              onChange={(e) => setCancellationPolicy(Number(e.target.value))}
            />  
            <span className="invisible group-hover:visible absolute left-0 top-full mt-1 w-max bg-gray-100 text-black text-xs rounded py-1 px-2 z-10 max-w-xs">
              Defina o número de dias antes do horário agendado que o cliente pode cancelar a consulta sem custo.
            </span>
          </span>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-1">
          Deseja adicionar alguma observação?
        </label>
        <textarea
          className="w-full border rounded px-2 py-1 text-sm"
          rows={4}
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
        />
      </div>

      <div className="flex justify-center gap-3">
        {editingSchedule ? (
          <>
            <button
              onClick={onSaveEdit}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar Alterações
            </button>
            <button
              onClick={onCancelEdit}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={onCreateSchedule}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Criar Agenda
          </button>
        )}
      </div>
    </div>
  )
}