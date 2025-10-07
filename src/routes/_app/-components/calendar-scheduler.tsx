import { useState } from 'react' 
import { SimpleCalendar } from './simple-calendar'
import { ScheduleForm } from './schedule-form'
import { TimeSlotsSidebar } from './time-slots-sidebar'
import { SchedulesList } from './schedules-list'
import { Schedule, CustomTime } from './types'

export function CalendarScheduler() {
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [price, setPrice] = useState('')
  const [cancellationPolicy, setCancellationPolicy] = useState<number | "">("")
  const [observations, setObservations] = useState('')
  const [isControlledByHours, setIsControlledByHours] = useState(false)
  const [intervalMinutes, setIntervalMinutes] = useState(30)
  const [generatedTimes, setGeneratedTimes] = useState<string[]>([])
  const [customTimes, setCustomTimes] = useState<CustomTime[]>([])
  const [createdSchedules, setCreatedSchedules] = useState<Schedule[]>([])
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null)

  const handleDateSelect = (date: string) => {
    setSelectedDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    )
  }

  const handleCreateSchedule = () => {
    if (selectedDates.length > 0 && title && ((isControlledByHours && startTime && endTime) || (!isControlledByHours && customTimes.length > 0))) {
      const newSchedule: Schedule = {
        id: `schedule-${Date.now()}`,
        title,
        dates: [...selectedDates],
        startTime,
        endTime,
        price,
        cancellationPolicy,
        observations,
        isControlledByHours,
        generatedTimes: isControlledByHours ? generatedTimes : [],
        customTimes: isControlledByHours ? [] : [...customTimes],
        intervalMinutes
      }

      setCreatedSchedules(prev => [...prev, newSchedule])
      clearForm()
    }
  }

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule.id)
    setSelectedDates([...schedule.dates])
    setTitle(schedule.title)
    setStartTime(schedule.startTime)
    setEndTime(schedule.endTime)
    setPrice(schedule.price || '')
    setCancellationPolicy(schedule.cancellationPolicy)
    setObservations(schedule.observations)
    setIsControlledByHours(schedule.isControlledByHours)
    setIntervalMinutes(schedule.intervalMinutes)
    setCustomTimes([...schedule.customTimes])
    setGeneratedTimes([...schedule.generatedTimes])
  }

  const handleSaveEdit = () => {
    if (editingSchedule && selectedDates.length > 0 && title) {
      setCreatedSchedules(prev =>
        prev.map(schedule =>
          schedule.id === editingSchedule
            ? {
              ...schedule,
              title,
              dates: [...selectedDates],
              startTime,
              endTime,
              price,
              cancellationPolicy,
              observations,
              isControlledByHours,
              generatedTimes: isControlledByHours ? generatedTimes : [],
              customTimes: isControlledByHours ? [] : [...customTimes],
              intervalMinutes
            }
            : schedule
        )
      )
      clearForm()
    }
  }

  const handleDeleteSchedule = (id: string) => {
    setCreatedSchedules(prev => prev.filter(s => s.id !== id))
    if (editingSchedule === id) {
      clearForm()
    }
  }

  const clearForm = () => {
    setEditingSchedule(null)
    setSelectedDates([])
    setTitle('')
    setStartTime('')
    setEndTime('')
    setPrice('')
    setCancellationPolicy('')
    setObservations('')
    setIsControlledByHours(false)
    setIntervalMinutes(30)
    setGeneratedTimes([])
    setCustomTimes([])
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <SimpleCalendar
            selectedDates={selectedDates}
            onDateSelect={handleDateSelect}
          />
          
          {(isControlledByHours ? generatedTimes.length > 0 : customTimes.length > 0) && (
            <TimeSlotsSidebar
              isControlledByHours={isControlledByHours}
              generatedTimes={generatedTimes}
              customTimes={customTimes}
            />
          )}
        </div>

        <div className="lg:col-span-2">
          <ScheduleForm
            title={title}
            setTitle={setTitle}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            price={price}
            setPrice={setPrice}
            cancellationPolicy={cancellationPolicy}
            setCancellationPolicy={setCancellationPolicy}
            observations={observations}
            setObservations={setObservations}
            isControlledByHours={isControlledByHours}
            setIsControlledByHours={setIsControlledByHours}
            intervalMinutes={intervalMinutes}
            setIntervalMinutes={setIntervalMinutes}
            generatedTimes={generatedTimes}
            setGeneratedTimes={setGeneratedTimes}
            customTimes={customTimes}
            setCustomTimes={setCustomTimes}
            editingSchedule={editingSchedule}
            onCreateSchedule={handleCreateSchedule}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={clearForm}
          />
        </div>
      </div>

      {createdSchedules.length > 0 && (
        <div className="mt-8">
          <SchedulesList
            schedules={createdSchedules}
            onEdit={handleEditSchedule}
            onDelete={handleDeleteSchedule}
          />
        </div>
      )}
    </>
  )
}