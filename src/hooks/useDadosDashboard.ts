import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { startOfDay, subDays, format } from 'date-fns'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

interface DadosDashboard {
  profissional: {
    id: string
    totalPacientes: number
  }
  taxaPresenca: number
  cancelamentos: number
  clientesAgendados: number
}

export function useDadosDashboard() {
  const { user } = useAuth()
  const dataFim = format(new Date(), 'yyyy-MM-dd')
  const dataInicio = format(subDays(startOfDay(new Date()), 7), 'yyyy-MM-dd')

console.log('Período da consulta:', {
    dataInicio,
    dataFim,
    userId: user?.id
  })

  return useQuery<DadosDashboard>({
    queryKey: ['dashboard', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      try {
         // Log das URLs antes de fazer as chamadas
        console.log('URLs das requisições:', {
          profissionalUrl: `/professional/${user.id}`,
          taxaPresencaUrl: `/professionals/attendance-rate/${user.id}?startDay=${dataInicio}&endDay=${dataFim}`,
          cancelamentosUrl: `/professionals/number-of-cancelations/${user.id}?startDay=${dataInicio}&endDay=${dataFim}`,
          clientesAgendadosUrl: `/professionals/number-schedulings/${user.id}?startDay=${dataInicio}&endDay=${dataFim}`
        })
        const [profissional, taxaPresenca, cancelamentos, clientesAgendados] = await Promise.all([
          api.get(`/professional/${user.id}`),
          api.get(`/professionals/attendance-rate/${user.id}`, {
            params: { startDay: dataInicio, endDay: dataFim }
          }),
          api.get(`/professionals/number-of-cancelations/${user.id}`, {
            params: { startDay: dataInicio, endDay: dataFim }
          }),
          api.get(`/professionals/number-schedulings/${user.id}`, {
            params: { startDay: dataInicio, endDay: dataFim }
          })
        ])

        // Log responses for debugging
        console.log('API Responses:', {
          profissional: profissional.data,
          taxaPresenca: taxaPresenca.data,
          cancelamentos: cancelamentos.data,
          clientesAgendados: clientesAgendados.data
        })

        if (!profissional.data || !taxaPresenca.data || !cancelamentos.data || !clientesAgendados.data) {
          throw new Error('Missing data in API response')
        }

        return {
          profissional: {
            id: profissional.data.id,
            totalPacientes: profissional.data.totalPatients || 0,
          },
          taxaPresenca: taxaPresenca.data.attendanceRate || 0,
          cancelamentos: cancelamentos.data.cancelations || 0,
          clientesAgendados: clientesAgendados.data.scheduledClients || 0
        }
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error)
        toast.error('Erro ao carregar os dados do dashboard')
        return {
          profissional: {
            id: user.id,
            totalPacientes: 0,
          },
          taxaPresenca: 0,
          cancelamentos: 0,
          clientesAgendados: 0
        }
      }
    },
    enabled: !!user?.id,
    retry: 1, // Tenta apenas uma vez em caso de falha
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    refetchOnWindowFocus: false // Não recarrega ao focar a janela
  })
}
