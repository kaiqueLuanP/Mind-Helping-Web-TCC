import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateDonutChartData } from './report-utils'
import { useEffect, useState } from 'react'
import { useFeelingsData } from '@/hooks/useFeelingsData'

interface MoodDonutChartProps {
  userId: string | null
}

export function MoodDonutChart({ userId }: MoodDonutChartProps) {
  // Estado de datas independente para este gráfico
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30) // Últimos 30 dias por padrão
    return date.toISOString().split('T')[0]
  })
  
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })

  // Buscar dados da API com as datas locais
  const { feelings, isLoading, error } = useFeelingsData({
    userId,
    startDate,
    endDate
  })

  // Calcular dados do gráfico
  const [chartData, setChartData] = useState(calculateDonutChartData(feelings))

  useEffect(() => {
    console.log('📊 MoodDonutChart - Atualizando gráfico com', feelings.length, 'sentimentos')
    console.log('📊 MoodDonutChart - Dados completos:', feelings)
    const donutData = calculateDonutChartData(feelings)
    setChartData(donutData)
  }, [feelings])

  const total = chartData.reduce((acc, item) => acc + item.value, 0)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Relatório de humor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
              <p className="text-sm text-gray-500">Carregando dados...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center text-red-600">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && chartData.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center text-gray-400">
              <p className="text-sm">Nenhum dado de humor registrado para este período</p>
            </div>
          </div>
        )}

        {/* Chart */}
        {!isLoading && !error && chartData.length > 0 && (
          <>
            <div className="flex items-center justify-center py-8">
              <svg viewBox="0 0 200 200" className="w-48 h-48">
                <g transform="translate(100,100)">
                  {chartData.map((item, index) => {
                    const percentage = (item.value / total) * 100
                    const startAngle = index === 0 ? 0 : 
                      chartData
                        .slice(0, index)
                        .reduce((acc, curr) => acc + (curr.value / total) * 360, 0)
                    const endAngle = startAngle + (percentage * 360) / 100
                    
                    const startRad = (startAngle * Math.PI) / 180
                    const endRad = (endAngle * Math.PI) / 180
                    
                    const x1 = Math.cos(startRad) * 80
                    const y1 = Math.sin(startRad) * 80
                    const x2 = Math.cos(endRad) * 80
                    const y2 = Math.sin(endRad) * 80
                    
                    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
                    
                    const d = `M ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} L 0 0`
                    
                    const textAngle = startAngle + (endAngle - startAngle) / 2
                    const textRad = (textAngle * Math.PI) / 180
                    const textX = Math.cos(textRad) * 50
                    const textY = Math.sin(textRad) * 50
                    
                    return (
                      <g key={item.mood}>
                        <path
                          d={d}
                          fill={item.color}
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-semibold"
                        >
                          {Math.round(percentage)}%
                        </text>
                      </g>
                    )
                  })}
                </g>
              </svg>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {chartData.map(item => (
                <div key={item.mood} className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.mood} ({item.value})</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Date Range Inputs - Independente */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-4">Informar período</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="donut-start-date" className="text-xs text-gray-600">
                Data inicial
              </label>
              <input
                id="donut-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="donut-end-date" className="text-xs text-gray-600">
                Data final
              </label>
              <input
                id="donut-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}