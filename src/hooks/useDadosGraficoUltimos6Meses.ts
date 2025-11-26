import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

interface MonthData {
  month: number
  count: number
}

// Função para obter os últimos 6 meses no formato apenas número do mês (1-12)
function getUltimos6Meses(): number[] {
  const meses: number[] = []
  const hoje = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    const mes = data.getMonth() + 1 // Retorna 1-12
    meses.push(mes)
  }
  
  return meses
}

// Função para obter dados de um mês específico
async function fetchPacientesAtendidosMes(
  professionalId: string, 
  month: number
): Promise<number> {
  try {
    const response = await api.get(
      `/professionals/number-of-patients-served/${professionalId}`,
      { params: { month } } // Enviando apenas o número do mês (1-12)
    )
    
    console.log(`Pacientes atendidos em mês ${month}:`, response.data)
    
    // Extrai o número de pacientes da resposta da API
    return response.data?.numberPatientsServedByMonth ?? 0
  } catch (error) {
    console.error(`Erro ao buscar dados do mês ${month}:`, error)
    return 0
  }
}

export function useDadosGraficoUltimos6Meses() {
  const { user } = useAuth()
  
  const meses = getUltimos6Meses()
  
  console.log('Meses do gráfico:', meses)

  return useQuery<MonthData[]>({
    queryKey: ['grafico-pacientes-6-meses', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      try {
        console.log('Buscando dados do gráfico para:', {
          professionalId: user.id,
          meses
        })

        // Busca dados de todos os meses em paralelo
        const promises = meses.map(month => 
          fetchPacientesAtendidosMes(user.id, month)
        )
        
        const resultados = await Promise.all(promises)
        
        // Formata os dados para o gráfico
        const dados: MonthData[] = meses.map((month, index) => ({
          month,
          count: resultados[index]
        }))
        
        console.log('Dados do gráfico carregados:', dados)
        
        return dados
      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error)
        toast.error('Erro ao carregar dados do gráfico')
        
        // Retorna dados vazios em caso de erro
        return meses.map(month => ({ month, count: 0 }))
      }
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  })
}