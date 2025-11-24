import { AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PendingConfirmationBadgeProps {
  minutesPassed: number
  onConfirm: () => void
  onMarkAsNoShow: () => void
  loading?: boolean
}

export function PendingConfirmationBadge({
  minutesPassed,
  onConfirm,
  onMarkAsNoShow,
  loading = false,
}: PendingConfirmationBadgeProps) {
  const getUrgencyColor = () => {
    if (minutesPassed < 15) return 'bg-yellow-50 border-yellow-300 text-yellow-800'
    if (minutesPassed < 30) return 'bg-orange-50 border-orange-300 text-orange-800'
    return 'bg-red-50 border-red-300 text-red-800'
  }

  const getIconColor = () => {
    if (minutesPassed < 15) return 'text-yellow-600'
    if (minutesPassed < 30) return 'text-orange-600'
    return 'text-red-600'
  }

  // ✅ Formatar tempo em horas e minutos
  const formatTimePassed = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minuto${minutes !== 1 ? 's' : ''}`
    }
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (remainingMinutes === 0) {
      return `${hours} hora${hours !== 1 ? 's' : ''}`
    }
    
    return `${hours}h ${remainingMinutes}min`
  }

  return (
    <div className={`border rounded-lg p-3 ${getUrgencyColor()}`}>
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className={`w-4 h-4 ${getIconColor()}`} />
        <span className="font-medium text-sm">Aguardando Confirmação</span>
      </div>
      
      <div className="flex items-center gap-1.5 mb-3 text-xs">
        <Clock className="w-3.5 h-3.5" />
        <span>Consulta finalizada há {formatTimePassed(minutesPassed)}</span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAsNoShow}
          disabled={loading}
          className="flex-1 text-xs h-8 bg-white hover:bg-red-50 border-red-200 text-red-700"
        >
          Faltou
        </Button>
        <Button
          size="sm"
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 text-xs h-8 bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? 'Confirmando...' : 'Realizada'}
        </Button>
      </div>
    </div>
  )
}