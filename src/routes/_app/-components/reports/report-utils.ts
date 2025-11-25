// report-utils.tsx

import type { FeelingEntry } from '@/services/feelingsService'

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

// Transforma FeelingEntry da API para MoodEntry
export function transformFeelingToMoodEntry(feeling: FeelingEntry): MoodEntry {
  // Capitalizar corretamente o sentimento (FELIZ -> Feliz)
  const mood = (feeling.description || feeling.mood || 'Desconhecido')
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  // Usar intensidade fornecida ou calcular com base na ordem de registro
  // Se não houver intensidade, usar 100 (valor cheio) por padrão ao invés de 50
  const intensity = feeling.intensity ?? 100
  
  console.log('📊 transformFeelingToMoodEntry - Feeling:', { description: feeling.description, intensity: feeling.intensity, resultantIntensity: intensity })
  
  return {
    date: feeling.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    mood,
    intensity
  }
}

// Formata data para o formato da API (YYYY-MM-DD)
export function formatDateForAPI(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 🎨 Cores para cada tipo de humor - ATUALIZADAS PARA CORRESPONDER AO APP
const moodColors: Record<string, string> = {
  'Feliz': '#1efa01ff',       // Verde
  'Ansioso': '#F39C6B',       // Laranja claro
  'Triste': '#5B9BD5',        // Azul
  'Raiva': '#E57373',         // Vermelho
  'Tédio': '#A78BFA',         // Roxo
  'Não sei dizer': '#78909C'  // Cinza escuro
}

// Mapeamento de nomes alternativos para normalização
const moodNameMapping: Record<string, string> = {
  'feliz': 'Feliz',
  'ansioso': 'Ansioso',
  'triste': 'Triste',
  'raiva': 'Raiva',
  'irritado': 'Raiva',
  'tedio': 'Tédio',
  'tedioso': 'Tédio',
  'tédio': 'Tédio',
  'calmo': 'Tédio',  // Calmo mapeia para Tédio conforme o app
  'não_sei_dizer': 'Não sei dizer',
  'nao_sei_dizer': 'Não sei dizer',
  'não sei dizer': 'Não sei dizer'
}

// Normaliza o nome do humor
function normalizeMoodName(mood: string): string {
  const normalized = mood.toLowerCase().trim()
  return moodNameMapping[normalized] || mood
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

// Calcula proporção percentual de cada humor para um dia específico
// Lógica: (contagem do sentimento / total de sentimentos do dia) * 100
export function calculateMoodAverages(data: MoodEntry[] | FeelingEntry[]): MoodAverage[] {
  // Usar dados diretamente da API
  let feelingsData: any[] = []
  
  if (Array.isArray(data) && data.length > 0) {
    feelingsData = data as any[]
  }
  
  console.log('📊 calculateMoodAverages - Dados do dia:', feelingsData)
  console.log('📊 calculateMoodAverages - Descriptions encontrados:', feelingsData.map(f => f.description))
  
  if (feelingsData.length === 0) {
    // Retorna valores zerados se não houver dados
    return [
      { label: 'Feliz', value: 0, color: 'bg-[#1efa01ff]' },
      { label: 'Triste', value: 0, color: 'bg-[#5B9BD5]' },
      { label: 'Raiva', value: 0, color: 'bg-[#E57373]' },
      { label: 'Ansioso', value: 0, color: 'bg-[#F39C6B]' },
      { label: 'Tédio', value: 0, color: 'bg-[#A78BFA]' },
      { label: 'Não sei dizer', value: 0, color: 'bg-[#78909C]' },
    ]
  }

  // Contar ocorrências de cada sentimento
  const counts: Record<string, number> = {
    'Feliz': 0,
    'Triste': 0,
    'Raiva': 0,
    'Ansioso': 0,
    'Tédio': 0,
    'Não sei dizer': 0
  }

  feelingsData.forEach((feeling: any) => {
    // Pegar a description e normalizar
    let description = feeling.description || ''
    
    // Normalizar para formato padrão
    const normalized = description
      .toLowerCase()
      .trim()
    
    console.log('📊 Processando sentiment:', { original: description, normalized })
    
    // Mapear variações para o nome padrão
    if (normalized.includes('feliz')) {
      counts['Feliz']++
    } else if (normalized.includes('triste')) {
      counts['Triste']++
    } else if (normalized.includes('raiva') || normalized.includes('irritado')) {
      counts['Raiva']++
    } else if (normalized.includes('ansioso')) {
      counts['Ansioso']++
    } else if (normalized.includes('tédio') || normalized.includes('tedioso') || normalized.includes('calmo') || normalized.includes('tedio')) {
      counts['Tédio']++
    } else if (normalized.includes('não sei') || normalized.includes('nao sei') || normalized.includes('neutro') || normalized.includes('não_sei_dizer') || normalized.includes('nao_sei_dizer')) {
      counts['Não sei dizer']++
    } else {
      console.warn('⚠️ Sentiment não reconhecido:', description)
    }
  })

  // Calcular proporção percentual: (contagem / total) * 100
  const total = feelingsData.length
  const result = Object.entries(counts).map(([mood, count]) => ({
    label: mood,
    value: total > 0 ? Math.round((count / total) * 100) : 0,
    color: getColorClass(mood)
  }))

  console.log('📊 calculateMoodAverages - Contagem:', counts)
  console.log('📊 calculateMoodAverages - Total:', total)
  console.log('📊 calculateMoodAverages - Proporção percentual:', result)
  return result
}

// Calcula dados para o gráfico de donut
export function calculateDonutChartData(data: MoodEntry[] | FeelingEntry[]): DonutChartItem[] {
  // Transformar FeelingEntry para MoodEntry se necessário
  let moodData: MoodEntry[]
  
  if (Array.isArray(data) && data.length > 0) {
    // Verificar se é FeelingEntry (tem 'userPersonId' ou 'description') ou MoodEntry (tem 'mood')
    const firstItem = data[0] as any
    if (firstItem.description !== undefined || (firstItem.userPersonId !== undefined && firstItem.mood === undefined)) {
      // É FeelingEntry
      console.log('📊 calculateDonutChartData - Detectado FeelingEntry, transformando...')
      moodData = (data as FeelingEntry[]).map(transformFeelingToMoodEntry)
    } else {
      // É MoodEntry
      console.log('📊 calculateDonutChartData - Detectado MoodEntry')
      moodData = data as MoodEntry[]
    }
  } else {
    moodData = []
  }
  
  console.log('📊 calculateDonutChartData - Dados transformados:', moodData)
  
  if (moodData.length === 0) {
    console.log('📊 calculateDonutChartData - Sem dados, retornando array vazio')
    return []
  }

  const moodCounts = moodData.reduce((acc, entry) => {
    const normalizedMood = normalizeMoodName(entry.mood)
    acc[normalizedMood] = (acc[normalizedMood] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const result = Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    value: count,
    color: moodColors[mood] || '#6b7280'
  }))
  
  console.log('📊 calculateDonutChartData - Resultado final:', result)
  return result
}

// Helper para obter classe de cor do Tailwind (usando cores customizadas)
function getColorClass(mood: string): string {
  const colorMap: Record<string, string> = {
    'Feliz': 'bg-[#1efa01ff]',     // Verde
    'Ansioso': 'bg-[#F39C6B]',     // Laranja claro
    'Triste': 'bg-[#5B9BD5]',      // Azul
    'Raiva': 'bg-[#E57373]',       // Vermelho
    'Tédio': 'bg-[#A78BFA]',       // Roxo
    'Neutro': 'bg-[#9E9E9E]',      // Cinza
    'Não sei dizer': 'bg-[#78909C]' // Cinza escuro
  }
  return colorMap[mood] || 'bg-gray-500'
}