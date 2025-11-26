import { useState, useEffect, useCallback } from 'react'
import feelingsService, { FeelingEntry } from '@/services/feelingsService'

interface UseFeelingsDataProps {
  userId: string | null
  startDate: string
  endDate: string
}

interface UseFeelingsDataReturn {
  feelings: FeelingEntry[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook para buscar e gerenciar dados de sentimentos da API
 */
export function useFeelingsData({
  userId,
  startDate,
  endDate
}: UseFeelingsDataProps): UseFeelingsDataReturn {
  const [feelings, setFeelings] = useState<FeelingEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFeelings = useCallback(async () => {
    if (!userId) {
      console.warn('userId não fornecido, não buscando sentimentos')
      setFeelings([])
      return
    }

    if (!startDate || !endDate) {
      console.warn('Datas não fornecidas, não buscando sentimentos')
      return
    }

    console.log('Iniciando busca de sentimentos:', { userId, startDate, endDate })
    
    setIsLoading(true)
    setError(null)

    try {
      const data = await feelingsService.getFeelingsByDateRange(
        userId,
        startDate,
        endDate
      )
      
      console.log('Sentimentos carregados:', data.length)
      console.log('Dados dos sentimentos:', data)
      setFeelings(data)
      
    } catch (err: any) {
      console.error('Erro ao carregar sentimentos:', err)
      setError(err.message || 'Erro ao carregar sentimentos')
      setFeelings([])
      
    } finally {
      setIsLoading(false)
    }
  }, [userId, startDate, endDate])

  // Buscar automaticamente quando userId ou datas mudarem
  useEffect(() => {
    fetchFeelings()
  }, [fetchFeelings])

  return {
    feelings,
    isLoading,
    error,
    refetch: fetchFeelings
  }
}