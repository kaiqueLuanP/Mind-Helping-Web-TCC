import api from '@/api/api'

export interface FeelingEntry {
  id: string
  userPersonId?: string
  userId?: string
  description: string
  mood?: string
  intensity?: number
  motive?: string
  createdAt?: string
  updatedAt?: string
}

export interface FeelingsResponse {
  feelings: FeelingEntry[]
}

const FeelingsService = {
  /**
   * Busca sentimentos de um usuário por intervalo de datas
   * GET /feelings/{userId}?startDay={date}&endDay={date}
   * @param userId - ID do usuário/paciente
   * @param startDay - Data inicial (formato: YYYY-MM-DD)
   * @param endDay - Data final (formato: YYYY-MM-DD)
   * @returns Promise com lista de sentimentos
   */
  async getFeelingsByDateRange(
    userId: string,
    startDay: string,
    endDay: string
  ): Promise<FeelingEntry[]> {
    try {
      console.log('  [FEELINGS API] Buscando sentimentos:', { userId, startDay, endDay })
      console.log('  [FEELINGS API] URL:', `/feelings/${userId}`)
      console.log('  [FEELINGS API] Query params:', { startDay, endDay })
      
      const response = await api.get<FeelingsResponse>(
        `/feelings/${userId}`,
        {
          params: {
            startDay,
            endDay
          }
        }
      )
      
      console.log('[FEELINGS API] Resposta completa:', response.data)
      console.log('[FEELINGS API] Status:', response.status)
      
      const feelings = response.data?.feelings || []
      
      return feelings
      
    } catch (error: any) {
      console.error('[FEELINGS API ERROR] Erro ao buscar sentimentos:', error)
      console.error('[FEELINGS API ERROR] Status:', error?.response?.status)
      console.error('[FEELINGS API ERROR] Data:', error?.response?.data)

      // Se for 404, não é erro crítico
      if (error?.response?.status === 404) {
        console.log('[FEELINGS API] Nenhum sentimento encontrado (404)')
        return []
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao buscar sentimentos')
    }
  },

  /**
   * Busca sentimentos de uma data específica
   * @param userId - ID do usuário/paciente
   * @param date - Data específica (formato: YYYY-MM-DD)
   * @returns Promise com lista de sentimentos do dia
   */
  async getFeelingsByDate(userId: string, date: string): Promise<FeelingEntry[]> {
    try {
      console.log('  [FEELINGS API] Buscando sentimentos do dia:', { userId, date })
      
      // Usar o mesmo dia como início e fim
      return await this.getFeelingsByDateRange(userId, date, date)
      
    } catch (error: any) {
      console.error('[FEELINGS API ERROR] Erro ao buscar sentimentos do dia:', error)
      
      if (error?.response?.status === 404) {
        return []
      }
      
      throw error
    }
  }
}

export default FeelingsService