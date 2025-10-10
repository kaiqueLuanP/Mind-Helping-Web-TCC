// report-utils.tsx

export interface MoodEntry {
  date: string
  mood: string
  intensity: number
}

export interface DonutChartItem {
  mood: string
  value: number
  color: string
}

export interface MoodAverage {
  label: string
  value: number
  color: string
}

// Mock de dados de humor
export const mockMoodData: MoodEntry[] = [
  { date: '2025-10-09', mood: 'Feliz', intensity: 80 },
  { date: '2025-10-09', mood: 'Ansioso', intensity: 40 },
  { date: '2025-10-09', mood: 'Triste', intensity: 20 },
  { date: '2025-10-09', mood: 'Calmo', intensity: 70 },
  { date: '2025-10-09', mood: 'Irritado', intensity: 30 },
  
  { date: '2025-03-15', mood: 'Feliz', intensity: 75 },
  { date: '2025-03-15', mood: 'Ansioso', intensity: 50 },
  { date: '2025-03-16', mood: 'Triste', intensity: 60 },
  { date: '2025-03-16', mood: 'Calmo', intensity: 40 },
  { date: '2025-03-17', mood: 'Feliz', intensity: 90 },
  { date: '2025-03-17', mood: 'Irritado', intensity: 20 },
  { date: '2025-03-18', mood: 'Ansioso', intensity: 70 },
  { date: '2025-03-18', mood: 'Calmo', intensity: 80 },
  { date: '2025-03-19', mood: 'Feliz', intensity: 85 },
  { date: '2025-03-19', mood: 'Triste', intensity: 30 },
  { date: '2025-03-20', mood: 'Calmo', intensity: 90 },
  { date: '2025-03-20', mood: 'Feliz', intensity: 95 },
]

// Cores para cada tipo de humor
const moodColors: Record<string, string> = {
  'Feliz': '#10b981',
  'Ansioso': '#f59e0b',
  'Triste': '#3b82f6',
  'Calmo': '#8b5cf6',
  'Irritado': '#ef4444',
}

// Filtra dados por data específica
export function filterMoodDataByDate(data: MoodEntry[], date: string): MoodEntry[] {
  return data.filter(entry => entry.date === date)
}

// Filtra dados por intervalo de datas
export function filterMoodDataByDateRange(
  data: MoodEntry[], 
  startDate: string, 
  endDate: string
): MoodEntry[] {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return data.filter(entry => {
    const entryDate = new Date(entry.date)
    return entryDate >= start && entryDate <= end
  })
}

// Calcula médias de humor para o gráfico de barras
export function calculateMoodAverages(data: MoodEntry[]): MoodAverage[] {
  if (data.length === 0) {
    // Retorna valores zerados se não houver dados
    return [
      { label: 'Feliz', value: 0, color: 'bg-green-500' },
      { label: 'Ansioso', value: 0, color: 'bg-amber-500' },
      { label: 'Triste', value: 0, color: 'bg-blue-500' },
      { label: 'Calmo', value: 0, color: 'bg-purple-500' },
      { label: 'Irritado', value: 0, color: 'bg-red-500' },
    ]
  }

  const moodGroups = data.reduce((acc, entry) => {
    if (!acc[entry.mood]) {
      acc[entry.mood] = []
    }
    acc[entry.mood].push(entry.intensity)
    return acc
  }, {} as Record<string, number[]>)

  const averages = Object.entries(moodGroups).map(([mood, intensities]) => {
    const avg = intensities.reduce((a, b) => a + b, 0) / intensities.length
    return {
      label: mood,
      value: Math.round(avg),
      color: getColorClass(mood)
    }
  })

  // Garantir que todos os humores apareçam, mesmo com valor 0
  const allMoods = ['Feliz', 'Ansioso', 'Triste', 'Calmo', 'Irritado']
  const result = allMoods.map(mood => {
    const existing = averages.find(a => a.label === mood)
    return existing || { label: mood, value: 0, color: getColorClass(mood) }
  })

  return result
}

// Calcula dados para o gráfico de donut
export function calculateDonutChartData(data: MoodEntry[]): DonutChartItem[] {
  if (data.length === 0) {
    return []
  }

  const moodCounts = data.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    value: count,
    color: moodColors[mood] || '#6b7280'
  }))
}

// Helper para obter classe de cor do Tailwind
function getColorClass(mood: string): string {
  const colorMap: Record<string, string> = {
    'Feliz': 'bg-green-500',
    'Ansioso': 'bg-amber-500',
    'Triste': 'bg-blue-500',
    'Calmo': 'bg-purple-500',
    'Irritado': 'bg-red-500',
  }
  return colorMap[mood] || 'bg-gray-500'
}