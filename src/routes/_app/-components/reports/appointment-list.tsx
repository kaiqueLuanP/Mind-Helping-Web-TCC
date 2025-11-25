import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "@/lib/axios"

interface CVVCall {
  id: string
  date: string
  time: string
  duration: string
}

interface AppointmentListProps {
  userId: string | null
}

export function AppointmentList({ userId }: AppointmentListProps) {
  const [calls, setCalls] = useState<CVVCall[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setCalls([])
      return
    }

    const fetchCVVCalls = async () => {
      setIsLoading(true)
      setError(null)

      try {
        console.log('📞 Buscando chamadas CVV para usuário:', userId)
        
        const response = await api.get(
          `/cvv-calls/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )

        console.log('✅ Resposta completa da API:', response)
        console.log('✅ Dados recebidos:', response.data)
        
        // Formatar os dados recebidos
        const formattedCalls = response.data.cvvCalls?.map((call: any) => {
          console.log('🔍 Processando chamada:', call)
          console.log('🔍 Data bruta:', call.dateCalled, 'Tipo:', typeof call.dateCalled)
          
          let formattedDate = 'Data inválida'
          
          if (call.dateCalled) {
            try {
              // Tentar diferentes formatos de data
              const dateObj = new Date(call.dateCalled)
              
              if (isNaN(dateObj.getTime())) {
                console.warn('⚠️ Data inválida, tentando parse manual:', call.dateCalled)
                // Se for string em formato DD/MM/YYYY ou similar, tenta converter
                formattedDate = String(call.dateCalled)
              } else {
                formattedDate = dateObj.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: '2-digit', 
                  day: '2-digit' 
                })
              }
            } catch (e) {
              console.error('❌ Erro ao formatar data:', e, 'Data original:', call.dateCalled)
              formattedDate = String(call.dateCalled)
            }
          }
          
          return {
            id: call.id,
            date: formattedDate,
            time: call.timeCalled || '00:00min',
            duration: call.timeCalled
          }
        }) || []

        console.log('✅ Chamadas formatadas:', formattedCalls)
        setCalls(formattedCalls)
      } catch (err: any) {
        console.error('❌ Erro ao buscar chamadas CVV:')
        console.error('❌ Status:', err.response?.status)
        console.error('❌ Dados do erro:', err.response?.data)
        console.error('❌ Mensagem:', err.message)
        console.error('❌ Stack:', err.stack)
        
        setError(err.response?.data?.message || err.message || 'Erro ao carregar chamadas CVV')
        setCalls([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCVVCalls()
  }, [userId])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Controle de chamada CVV</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
              <p className="text-sm text-gray-500">Carregando...</p>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center text-red-600">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && calls.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center text-gray-400">
              <p className="text-sm">Nenhuma chamada CVV registrada</p>
            </div>
          </div>
        )}

        {!isLoading && !error && calls.length > 0 && (
          <div className="space-y-4">
            {calls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between"
              >
                <span>{call.date}</span>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{call.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}