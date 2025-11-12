import { useState, useEffect } from 'react'
import { SimpleCalendar } from './simple-calendar'
import { ScheduleForm } from './schedule-form'
import { TimeSlotsSidebar } from './time-slots-sidebar'
import { SchedulesList } from './schedules-list'
import { Schedule, CustomTime } from '../types'
import { Toast, ToastContainer } from '@/components/ui/toast'
import scheduleService, { ScheduleCreateData } from '@/services/scheduleService'
import { useAuth } from '@/hooks/useAuth'

export function CalendarScheduler() {
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [price, setPrice] = useState('')
  const [cancellationPolicy, setCancellationPolicy] = useState<number | "">("")
  const [observations, setObservations] = useState('')
  const [isControlledByHours, setIsControlledByHours] = useState(false)
  const [intervalMinutes, setIntervalMinutes] = useState(30)
  const [generatedTimes, setGeneratedTimes] = useState<string[]>([])
  const [customTimes, setCustomTimes] = useState<CustomTime[]>([])
  const [createdSchedules, setCreatedSchedules] = useState<Schedule[]>([])
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  
  const [toasts, setToasts] = useState<Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'warning'
  }>>([])

  //  BUSCAR AGENDAS AO CARREGAR
  useEffect(() => {
    const loadSchedules = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        console.log('🔍 Buscando agendas existentes...');
        const schedules = await scheduleService.getSchedules(user.id);
        console.log('📦 Agendas recebidas:', schedules);
        
        if (!schedules || schedules.length === 0) {
          console.log('ℹ️ Nenhuma agenda encontrada');
          setCreatedSchedules([]);
          return;
        }
        
        // Converter para o formato do componente
        const mappedSchedules: Schedule[] = schedules.map(s => {
          // Extrair data e hora SEM conversão de fuso
          const initialDate = new Date(s.initialTime);
          const endDate = new Date(s.endTime);
          
          return {
            id: s.id,
            dates: [s.initialTime.split('T')[0]], // Pegar apenas YYYY-MM-DD
            startTime: `${String(initialDate.getUTCHours()).padStart(2, '0')}:${String(initialDate.getUTCMinutes()).padStart(2, '0')}`,
            endTime: `${String(endDate.getUTCHours()).padStart(2, '0')}:${String(endDate.getUTCMinutes()).padStart(2, '0')}`,
            price: s.averageValue.toString(),
            cancellationPolicy: s.cancellationPolicy,
            observations: s.observation,
            isControlledByHours: s.isControlled,
            generatedTimes: [],
            customTimes: [],
            intervalMinutes: s.interval
          };
        });
        
        setCreatedSchedules(mappedSchedules);
        console.log(`✅ ${mappedSchedules.length} agendas carregadas com sucesso`);
      } catch (error: any) {
        console.error('❌ Erro ao carregar agendas:', error);
        // Não mostrar erro se for 404 (sem agendas)
        if (error.response?.status !== 404) {
          addToast('Não foi possível carregar as agendas existentes', 'warning');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedules();
  }, [user?.id]);

  const addToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (selectedDates.length === 0) {
      errors.push('Selecione pelo menos uma data')
    }

    if (isControlledByHours) {
      if (!startTime) {
        errors.push('A hora inicial é obrigatória')
      }
      if (!endTime) {
        errors.push('A hora final é obrigatória')
      }
      if (startTime && endTime && startTime >= endTime) {
        errors.push('A hora final deve ser maior que a hora inicial')
      }
      if (startTime && endTime && generatedTimes.length === 0) {
        errors.push('Nenhum horário foi gerado. Verifique o intervalo.')
      }
    } else {
      if (customTimes.length === 0) {
        errors.push('Adicione pelo menos um horário de consulta')
      }
      // Quando não é controlado por horário, usa o primeiro customTime como referência
      if (customTimes.length > 0 && !customTimes[0].time) {
        errors.push('Os horários personalizados devem ter hora de início')
      }
    }

    if (cancellationPolicy !== "" && cancellationPolicy < 0) {
      errors.push('A política de cancelamento não pode ser negativa')
    }

    return { isValid: errors.length === 0, errors }
  }

  const handleDateSelect = (date: string) => {
    setSelectedDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    )
  }

  const handleCreateSchedule = async () => {
    const validation = validateForm()

    if (!validation.isValid) {
      validation.errors.forEach(error => {
        addToast(error, 'error')
      })
      return
    }

    if (!user || !user.id) {
      addToast('Usuário não autenticado. Faça login novamente.', 'error')
      return
    }

    setIsLoading(true)

    try {
      const now = new Date();
      const futureSchedules: ScheduleCreateData[] = [];
      const pastDates: string[] = [];
      
      selectedDates.forEach(selectedDate => {
        const [year, month, day] = selectedDate.split('-').map(Number);
        
        // Definir horários baseado no tipo de controle
        let startHour: number, startMinute: number;
        
        if (isControlledByHours) {
          // Usar startTime/endTime do formulário
          [startHour, startMinute] = startTime.split(':').map(Number);
        } else {
          // Usar o primeiro horário customizado
          if (customTimes.length === 0) return;
          [startHour, startMinute] = customTimes[0].time.split(':').map(Number);
        }
        
        // Criar data local
        const initialDate = new Date(year, month - 1, day, startHour, startMinute, 0, 0);
        // Se não for controlado por horário, a data final é igual à inicial
        const endDate = isControlledByHours 
          ? (() => {
              const [endHour, endMinute] = endTime.split(':').map(Number);
              return new Date(year, month - 1, day, endHour, endMinute, 0, 0);
            })()
          : new Date(year, month - 1, day, startHour, startMinute, 0, 0);
        
        if (initialDate < now) {
          console.warn(`⚠️ Data no passado ignorada: ${selectedDate} às ${startHour}:${startMinute}`);
          pastDates.push(selectedDate);
          return;
        }
        
        // ✅ CORREÇÃO DEFINITIVA: Criar string ISO mantendo o horário local
        const pad = (n: number) => String(n).padStart(2, '0');
        
        // Formato: YYYY-MM-DDTHH:mm:ss (SEM o Z no final)
        const initialTimeISO = `${year}-${pad(month)}-${pad(day)}T${pad(startHour)}:${pad(startMinute)}:00`;
        
        // Se não for controlado por horário, endTime é igual ao initialTime
        let endTimeISO: string;
        if (isControlledByHours) {
          const [endHour, endMinute] = endTime.split(':').map(Number);
          endTimeISO = `${year}-${pad(month)}-${pad(day)}T${pad(endHour)}:${pad(endMinute)}:00`;
        } else {
          endTimeISO = initialTimeISO;
        }

        console.log(`✅ Data futura válida: ${selectedDate}`);
        console.log(`   Início: ${pad(startHour)}:${pad(startMinute)} (local) -> ${initialTimeISO}`);
        console.log(`   Fim: ${endTimeISO}`);

        futureSchedules.push({
          initialTime: initialTimeISO,
          endTime: endTimeISO,
          interval: intervalMinutes,
          cancellationPolicy: cancellationPolicy === "" ? 0 : Number(cancellationPolicy),
          averageValue: price ? parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.')) : 0,
          observation: observations || "",
          isControlled: isControlledByHours
        });
      });

      if (futureSchedules.length === 0) {
        addToast('Todas as datas selecionadas estão no passado. Selecione datas futuras.', 'error');
        setIsLoading(false);
        return;
      }

      if (pastDates.length > 0) {
        addToast(`${pastDates.length} data(s) no passado foram ignoradas.`, 'warning');
      }

      console.log('📤 Enviando para API:', JSON.stringify(futureSchedules, null, 2));
      
      const response = await scheduleService.createSchedule(user.id, futureSchedules);
      console.log('✅ Resposta da API:', response);

      // ✅ RECARREGAR AGENDAS APÓS CRIAR
      try {
        const updatedSchedules = await scheduleService.getSchedules(user.id);
        console.log('🔄 Agendas recarregadas:', updatedSchedules);
        
        if (updatedSchedules && updatedSchedules.length > 0) {
          const mappedSchedules: Schedule[] = updatedSchedules.map(s => {
            const initialDate = new Date(s.initialTime);
            const endDate = new Date(s.endTime);
            
            return {
              id: s.id,
              dates: [s.initialTime.split('T')[0]],
              startTime: `${String(initialDate.getUTCHours()).padStart(2, '0')}:${String(initialDate.getUTCMinutes()).padStart(2, '0')}`,
              endTime: `${String(endDate.getUTCHours()).padStart(2, '0')}:${String(endDate.getUTCMinutes()).padStart(2, '0')}`,
              price: s.averageValue.toString(),
              cancellationPolicy: s.cancellationPolicy,
              observations: s.observation,
              isControlledByHours: s.isControlled,
              generatedTimes: [],
              customTimes: [],
              intervalMinutes: s.interval
            };
          });
          
          setCreatedSchedules(mappedSchedules);
        }
      } catch (reloadError) {
        console.warn('⚠️ Não foi possível recarregar agendas, mas criação foi bem-sucedida');
      }
      
      clearForm();
      addToast(`Agenda criada com sucesso para ${futureSchedules.length} dia(s)!`, 'success');

    } catch (error: any) {
      console.error('❌ ERRO COMPLETO:', error);
      console.error('   Response:', error.response);
      console.error('   Data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Erro ao criar agenda. Tente novamente.';
      
      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditSchedule = (schedule: Schedule) => {
    try {
      setEditingSchedule(schedule.id)
      setSelectedDates([...schedule.dates])
      setStartTime(schedule.startTime)
      setEndTime(schedule.endTime)
      setPrice(schedule.price || '')
      setCancellationPolicy(schedule.cancellationPolicy)
      setObservations(schedule.observations)
      setIsControlledByHours(schedule.isControlledByHours)
      setIntervalMinutes(schedule.intervalMinutes)
      setCustomTimes([...schedule.customTimes])
      setGeneratedTimes([...schedule.generatedTimes])

      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      addToast('Erro ao carregar agenda para edição.', 'error')
      console.error('Erro ao editar agenda:', error)
    }
  }

  const handleSaveEdit = () => {
    const validation = validateForm()

    if (!validation.isValid) {
      validation.errors.forEach(error => {
        addToast(error, 'error')
      })
      return
    }

    try {
      if (editingSchedule) {
        setCreatedSchedules(prev =>
          prev.map(schedule =>
            schedule.id === editingSchedule
              ? {
                ...schedule,
                dates: [...selectedDates],
                startTime,
                endTime,
                price,
                cancellationPolicy,
                observations,
                isControlledByHours,
                generatedTimes: isControlledByHours ? generatedTimes : [],
                customTimes: isControlledByHours ? [] : [...customTimes],
                intervalMinutes
              }
              : schedule
          )
        )
        clearForm()
        addToast('Agenda atualizada com sucesso!', 'success')
      }
    } catch (error) {
      addToast('Erro ao atualizar agenda. Tente novamente.', 'error')
      console.error('Erro ao atualizar agenda:', error)
    }
  }

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta agenda?')) {
      return;
    }

    try {
      setIsLoading(true);
      console.log('🗑️ Deletando agenda:', id);
      
      await scheduleService.deleteSchedule(id);
      
      setCreatedSchedules(prev => prev.filter(s => s.id !== id));
      
      if (editingSchedule === id) {
        clearForm();
      }
      
      addToast('Agenda excluída com sucesso!', 'success');
      console.log('✅ Agenda deletada');
    } catch (error: any) {
      console.error('❌ Erro ao deletar:', error);
      addToast('Erro ao excluir agenda. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  const clearForm = () => {
    setEditingSchedule(null)
    setSelectedDates([])
    setStartTime('')
    setEndTime('')
    setPrice('')
    setCancellationPolicy('')
    setObservations('')
    setIsControlledByHours(false)
    setIntervalMinutes(30)
    setGeneratedTimes([])
    setCustomTimes([])
  }

  return (
    <>
      <ToastContainer>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4 flex flex-col items-center w-full">
          <div className="w-full">
           <SimpleCalendar 
              selectedDates={selectedDates}
              onDateSelect={handleDateSelect}
              showHints={true}
            />

            {(isControlledByHours ? generatedTimes.length > 0 : customTimes.length > 0) && (
              <TimeSlotsSidebar
                isControlledByHours={isControlledByHours}
                generatedTimes={generatedTimes}
                customTimes={customTimes}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <ScheduleForm
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            price={price}
            setPrice={setPrice}
            cancellationPolicy={cancellationPolicy}
            setCancellationPolicy={setCancellationPolicy}
            observations={observations}
            setObservations={setObservations}
            isControlledByHours={isControlledByHours}
            setIsControlledByHours={setIsControlledByHours}
            intervalMinutes={intervalMinutes}
            setIntervalMinutes={setIntervalMinutes}
            generatedTimes={generatedTimes}
            setGeneratedTimes={setGeneratedTimes}
            customTimes={customTimes}
            setCustomTimes={setCustomTimes}
            editingSchedule={editingSchedule}
            onCreateSchedule={handleCreateSchedule}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={clearForm}
          />
        </div>
      </div>
      
      {isLoading && createdSchedules.length === 0 && (
        <div className="mt-8 text-center text-gray-500">
          <p>Carregando agendas...</p>
        </div>
      )}
      
      {createdSchedules.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Agendas Criadas</h3>
          <SchedulesList
            schedules={createdSchedules}
            onEdit={handleEditSchedule}
            onDelete={handleDeleteSchedule}
          />
        </div>
      )}
      
      {!isLoading && createdSchedules.length === 0 && (
        <div className="mt-8 text-center text-gray-400">
          <p>Nenhuma agenda criada ainda</p>
        </div>
      )}
    </>
  )
}