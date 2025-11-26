import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateMoodAverages } from './report-utils'
import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFeelingsData } from '@/hooks/useFeelingsData'

// Função helper para obter a cor hexadecimal do humor
function getMoodColorHex(mood: string): string {
  const colorMap: Record<string, string> = {
    'Feliz': '#1efa01ff',
    'Ansioso': '#F39C6B',
    'Triste': '#5B9BD5',
    'Raiva': '#E57373',
    'Tédio': '#A78BFA',
    'Não sei dizer': '#78909C'
  }
  return colorMap[mood] || '#6b7280'
}

interface MoodVariationChartProps {
  userId: string | null
}

export function MoodVariationChart({ userId }: MoodVariationChartProps) {
  // Estado de data para este gráfico (um único dia)
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })

  // Buscar dados da API para o dia selecionado
  const { feelings, isLoading, error } = useFeelingsData({
    userId,
    startDate: selectedDate,
    endDate: selectedDate
  })

  const [moodData, setMoodData] = useState(calculateMoodAverages([]))

  useEffect(() => {
    console.log('MoodVariationChart - Atualizando gráfico com', feelings.length, 'sentimentos')
    console.log('MoodVariationChart - Dados completos:', feelings)
    const averages = calculateMoodAverages(feelings)
    setMoodData(averages)
  }, [feelings])
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">Variação diária de sentimento</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
              <p className="text-sm text-gray-500">Carregando...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-red-600">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && feelings.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-sm">Nenhum sentimento registrado neste dia</p>
            </div>
          </div>
        )}

        {/* Chart */}
        {!isLoading && !error && feelings.length > 0 && (
          <div className="space-y-4 flex-1">
            {moodData.map((mood) => (
              <div key={mood.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{mood.label}</span>
                  <span className="text-gray-600">{mood.value}%</span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full transition-all duration-500"
                    style={{ 
                      width: `${mood.value}%`,
                      backgroundColor: getMoodColorHex(mood.label)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Date Filter - Um único dia */}
        <div className="space-y-4 border-t pt-4">
          <div className="space-y-2">
            <Label htmlFor="variation-date" className="text-sm text-gray-600">
              Dia
            </Label>
            <Input
              id="variation-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}