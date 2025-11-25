import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { format, subDays } from 'date-fns'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

interface DadosDashboard {
  profissional: {
    id: string
    numberPatients: number
  }
  taxaPresenca: number
  cancelamentos: number
  clientesAgendados: number
}

export function useDadosDashboard(filtroDataInicio?: string, filtroDataFim?: string) {
  const { user } = useAuth()
  
  // ✅ CORREÇÃO: Invertido e usando subDays (ou filtro customizado)
  const dataFim = filtroDataFim || format(new Date(), 'yyyy-MM-dd')                // Hoje ou data filtrada
  const dataInicio = filtroDataInicio || format(subDays(new Date(), 7), 'yyyy-MM-dd')  // 7 dias atrás ou data filtrada

  console.log('📅 Período da consulta:', {
    dataInicio,  
    dataFim,    
    diasAtras: 7,
    userId: user?.id
  })

  return useQuery<DadosDashboard>({
    queryKey: ['dashboard', user?.id, dataInicio, dataFim], 
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      try {
        // Log das URLs antes de fazer as chamadas
        console.log('🔗 URLs das requisições:', {
          numeroPacientesUrl: `/professionals/number-patients/${user.id}`,
          taxaPresencaUrl: `/professionals/attendance-rate/${user.id}?startDay=${dataInicio}&endDay=${dataFim}`,
          cancelamentosUrl: `/professionals/number-of-cancelations/${user.id}?startDay=${dataInicio}&endDay=${dataFim}`,
          clientesAgendadosUrl: `/professionals/number-schedulings/${user.id}?startDay=${dataInicio}&endDay=${dataFim}`
        })

        const [numeroPacientes, taxaPresenca, cancelamentos, clientesAgendados] = await Promise.all([
          api.get(`/professionals/number-patients/${user.id}`),
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
        console.log('📊 Respostas da API:', {
          numeroPacientes: numeroPacientes.data,
          taxaPresenca: taxaPresenca.data,
          cancelamentos: cancelamentos.data,
          clientesAgendados: clientesAgendados.data
        })

        return {
          profissional: {
            id: user.id,
            numberPatients: numeroPacientes.data?.numberPatients ?? 0
          },
          taxaPresenca: taxaPresenca.data?.attendanceRate ?? 0,
          cancelamentos: cancelamentos.data?.schedulingsCancel ?? 0,
          clientesAgendados: clientesAgendados.data?.schedulingsCount ?? 0
        }
      } catch (error) {
        console.error('❌ Erro ao buscar dados do dashboard:', error)
        toast.error('Erro ao carregar os dados do dashboard')
        
        return {
          profissional: {
            id: user.id,
            numberPatients: 0
          },
          taxaPresenca: 0,
          cancelamentos: 0,
          clientesAgendados: 0
        }
      }
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  })
}