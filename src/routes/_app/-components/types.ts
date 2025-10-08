export interface CustomTime {
  id: string
  time: string
}

export interface Schedule {
  id: string
  dates: string[]
  startTime: string
  endTime: string
  price?: string
  cancellationPolicy: number | ""
  observations: string
  isControlledByHours: boolean
  generatedTimes: string[]
  customTimes: CustomTime[]
  intervalMinutes: number
}