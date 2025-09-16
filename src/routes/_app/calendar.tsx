import { createFileRoute } from '@tanstack/react-router'
import Layout from '../../components/Layout'

export const Route = createFileRoute('/_app/calendar')({
  component: CalendarComponent,
})

function CalendarComponent() {
  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Agenda</h2>

        <div className="grid grid-cols-12 gap-6">
          {/* Left column - calendar + period */}
          <div className="col-span-3">
            <div className="bg-white border rounded shadow p-4">
              <h3 className="font-medium mb-2">Calendário</h3>
              <div className="text-sm text-gray-500">[=]</div> {/* // nao posso esquecer de inserir o componente de calendario aqui */}
              <div className="mt-4">
                <label className="block text-xs text-gray-600">Informar período</label>
                <input type="date" className="mt-1 block w-full border rounded px-2 py-1 text-sm" />
                <input type="date" className="mt-2 block w-full border rounded px-2 py-1 text-sm" />
              </div>
            </div>

            <div className="mt-4 bg-white border rounded shadow p-4">
              <h4 className="font-medium mb-2">Editar agendas criadas</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="h-24 border bg-gray-50" />
                <div className="h-24 border bg-gray-50" />
                <div className="h-24 border bg-gray-50" />
              </div>
            </div>
          </div>

          {/* Middle column - form */}
          <div className="col-span-7">
            <div className="bg-white border rounded shadow p-6">
              <h3 className="font-semibold mb-4">Informe os horários</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Hora inicial</label>
                  <input type="time" className="mt-1 block w-full border rounded px-2 py-1 text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Hora final</label>
                  <input type="time" className="mt-1 block w-full border rounded px-2 py-1 text-sm" />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm text-gray-600">Valor médio da consulta (opcional)</label>
                <input type="text" placeholder="R$ 100,00" className="mt-1 block w-1/2 border rounded px-2 py-1 text-sm" />
              </div>

              <div className="mt-4">
                <label className="text-sm text-gray-600">Informar a política de cancelamento da consulta</label>
                <textarea className="mt-1 block w-full border rounded px-2 py-1 text-sm" rows={3} placeholder="Ex: o paciente poderá cancelar..." />
              </div>

              <div className="mt-4">
                <label className="text-sm text-gray-600">Deseja adicionar alguma observação?</label>
                <textarea className="mt-1 block w-full border rounded px-2 py-1 text-sm" rows={4} />
              </div>

              <div className="mt-6 text-center">
                <button className="bg-black text-white px-6 py-2 rounded">Criar Agenda</button>
              </div>
            </div>
          </div>

          {/* Right column - generated hours */}
          <div className="col-span-2">
            <div className="bg-white border rounded shadow p-4">
              <h4 className="font-medium mb-2">Horários gerados</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-2 border rounded">08:00</div>
                <div className="p-2 border rounded">08:30</div>
                <div className="p-2 border rounded">09:00</div>
                <div className="p-2 border rounded">09:30</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}