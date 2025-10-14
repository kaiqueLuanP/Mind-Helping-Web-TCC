import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateMoodAverages, filterMoodDataByDate, mockMoodData } from './report-utils'
import { useEffect, useState } from 'react'
import { DateValue } from "react-aria-components"
import { CalendarDate } from "@internationalized/date"
import { DatePicker } from "@/components/ui/calendar-rac"

interface MoodVariationChartProps {
  selectedDate: DateValue
  onDateChange: (date: DateValue) => void
}

export function MoodVariationChart({ selectedDate}: MoodVariationChartProps) {
  const [moodData, setMoodData] = useState(calculateMoodAverages(mockMoodData))

  useEffect(() => {
    if (selectedDate instanceof CalendarDate) {
      const dateStr = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`
      const filteredData = filterMoodDataByDate(mockMoodData, dateStr)
      const averages = calculateMoodAverages(filteredData)
      setMoodData(averages)
    }
  }, [selectedDate])
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">Variação diária de sentimento</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-4 flex-1">
          {moodData.map((mood) => (
            <div key={mood.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{mood.label}</span>
                <span>{mood.value}%</span>
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`absolute h-full ${mood.color} transition-all duration-500`}
                  style={{ width: `${mood.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <DatePicker
            label="Informar dia"
            value={selectedDate}
          />
        </div>
      </CardContent>
    </Card>
  )
}