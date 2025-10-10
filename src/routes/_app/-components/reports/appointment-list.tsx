import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Appointment {
  id: string
  date: string
  time: string
}

const appointments: Appointment[] = [
  { id: "1", date: "20/03/2025 - Quarta-feira", time: "00:45min" },
  { id: "2", date: "20/03/2025 - Quarta-feira", time: "00:45min" },
  { id: "3", date: "20/03/2025 - Quarta-feira", time: "00:45min" },
]

export function AppointmentList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Controle de chamada CVV</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between"
            >
              <span>{appointment.date}</span>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4" />
                <span>{appointment.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}