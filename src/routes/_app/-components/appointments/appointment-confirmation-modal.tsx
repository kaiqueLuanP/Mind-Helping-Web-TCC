import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'

interface PendingAppointment {
  id: string
  time: string
  patient: string | null
  minutesPassed: number
  schedulingId?: string
}

interface AppointmentConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pendingAppointments: PendingAppointment[]
  onConfirm: (appointmentId: string) => Promise<boolean>
  onConfirmAll: (appointmentIds: string[]) => Promise<boolean>
  onMarkAsNoShow: (appointmentId: string) => Promise<boolean>
}

export function AppointmentConfirmationModal({
  open,
  onOpenChange,
  pendingAppointments,
  onConfirm,
  onConfirmAll,
  onMarkAsNoShow,
}: AppointmentConfirmationModalProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [confirmingAll, setConfirmingAll] = useState(false)

  const handleConfirm = async (appointmentId: string) => {
    setLoading(appointmentId)
    const success = await onConfirm(appointmentId)
    setLoading(null)
    
    if (success && pendingAppointments.length === 1) {
      onOpenChange(false)
    }
  }

  const handleNoShow = async (appointmentId: string) => {
    setLoading(appointmentId)
    const success = await onMarkAsNoShow(appointmentId)
    setLoading(null)
    
    if (success && pendingAppointments.length === 1) {
      onOpenChange(false)
    }
  }

  const handleConfirmAll = async () => {
    setConfirmingAll(true)
    const ids = pendingAppointments.map(apt => apt.id)
    await onConfirmAll(ids)
    setConfirmingAll(false)
    onOpenChange(false)
  }

  const getTimeColor = (minutesPassed: number) => {
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            <AlertDialogTitle className="text-xl">
              Confirmar Consultas Realizadas
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Você tem {pendingAppointments.length} consulta(s) pendente(s) de confirmação.
            Por favor, confirme se as consultas foram realizadas ou marque como falta.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 my-4">
          {pendingAppointments.map((appointment) => (
            <Card key={appointment.id} className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {appointment.time}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="font-medium text-gray-700">
                        {appointment.patient}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className={`w-4 h-4 ${getTimeColor(appointment.minutesPassed)}`} />
                      <span className={getTimeColor(appointment.minutesPassed)}>
                        Há {appointment.minutesPassed} minutos
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleNoShow(appointment.id)}
                      disabled={loading === appointment.id || confirmingAll}
                      className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Faltou
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleConfirm(appointment.id)}
                      disabled={loading === appointment.id || confirmingAll}
                      className="gap-1.5 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {loading === appointment.id ? 'Confirmando...' : 'Realizada'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={confirmingAll}
            className="w-full sm:w-auto"
          >
            Confirmar Depois
          </Button>
          <Button
            onClick={handleConfirmAll}
            disabled={confirmingAll}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          >
            {confirmingAll ? 'Confirmando...' : 'Confirmar Todas como Realizadas'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}