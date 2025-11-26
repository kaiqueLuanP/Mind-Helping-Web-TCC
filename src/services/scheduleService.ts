import api from '@/api/api';

export interface ScheduleCreateData {
    initialTime: string;
    endTime: string;
    interval: number;
    cancellationPolicy: number;
    averageValue: number;
    observation: string;
    isControlled: boolean;
    price?: string;
}

export interface ScheduleResponse {
    id: string;
    initialTime: string;
    endTime: string;
    interval: number;
    cancellationPolicy: number;
    averageValue: number;
    observation: string;
    isControlled: boolean;
}

export interface HourlyCreateData {
    scheduleId: string;
    date: string;
    hour: string;
}

const ScheduleService = {   
    async createSchedule(professionalId: string, schedules: ScheduleCreateData[]) {
        try {
            const response = await api.post(
                `/schedules/${professionalId}`, 
                schedules
            );
            return response.data;
        } catch (error: any) {
            console.error('Error creating schedule:', error);
            throw new Error(error.response?.data?.message || 'Erro ao criar agendamento');
        }
    },

    /**
     * ✅ NOVA FUNÇÃO: Criar horários livres (hourlies)
     * POST /hourlies
     */
    async createHourly(hourly: HourlyCreateData) {
        try {
            console.log('[API CALL] Criando hourly:', hourly);
            
            const response = await api.post('/hourlies', hourly);
            
            console.log('[API RESPONSE] Hourly criado:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('[API ERROR] Erro ao criar hourly:', error);
            console.error('[API ERROR] Status:', error?.response?.status);
            console.error('[API ERROR] Data:', error?.response?.data);
            throw new Error(error.response?.data?.message || 'Erro ao criar horário livre');
        }
    },

    /**
     * Criar múltiplos horários de uma vez
     */
    async createMultipleHourlies(hourlies: HourlyCreateData[]) {
        try {
            console.log(`API BATCH] Criando ${hourlies.length} hourlies...`);
            
            const promises = hourlies.map((hourly, index) => {
                console.log(`[API BATCH ${index + 1}/${hourlies.length}]`, hourly);
                return this.createHourly(hourly);
            });
            
            const results = await Promise.allSettled(promises);
            
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            
            console.log(`[API BATCH] Resultado: ${successful} criados, ${failed} falharam`);
            
            if (failed > 0) {
                console.warn(`API BATCH] ${failed} hourlies falharam:`);
                results.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        console.error(`[API BATCH] Falha no hourly ${index}:`, result.reason);
                    }
                });
            }
            
            return results;
        } catch (error: any) {
            console.error('[API BATCH ERROR] Erro ao criar múltiplos hourlies:', error);
            throw error;
        }
    },

    /**
     * Gerar horários baseado em intervalo (para modo controlado)
     */
    generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number): string[] {
        const slots: string[] = [];
        const start = new Date(`2000-01-01T${startTime}:00`);
        const end = new Date(`2000-01-01T${endTime}:00`);

        let current = new Date(start);

        while (current < end) {
            slots.push(current.toTimeString().slice(0, 5));
            current.setMinutes(current.getMinutes() + intervalMinutes);
        }

        return slots;
    },

    /**
     * Criar schedule + hourlies automaticamente
     * SUPORTA AMBOS OS MODOS:
     * - Controlado por horário (gera slots automáticos)
     * - Livre (usa horários customizados do profissional)
     */
    async createScheduleWithHourlies(
        professionalId: string,
        scheduleData: Omit<ScheduleCreateData, 'initialTime' | 'endTime'>,
        dates: string[],
        startTime: string,
        endTime: string,
        customTimes?: string[] // NOVO: Array de horários customizados (ex: ["09:00", "14:30", "16:00"])
    ) {
        try {
            console.log('[SCHEDULE+HOURLIES] Iniciando criação completa...');
            console.log('[SCHEDULE+HOURLIES] Modo:', scheduleData.isControlled ? 'CONTROLADO' : 'LIVRE');

            // Preparar dados dos schedules
            const schedulesToCreate: ScheduleCreateData[] = dates.map(date => {
                const [year, month, day] = date.split('-').map(Number);
                const [startHour, startMinute] = startTime.split(':').map(Number);
                const [endHour, endMinute] = endTime.split(':').map(Number);
                
                const pad = (n: number) => String(n).padStart(2, '0');
                
                const initialTimeISO = `${year}-${pad(month)}-${pad(day)}T${pad(startHour)}:${pad(startMinute)}:00`;
                const endTimeISO = `${year}-${pad(month)}-${pad(day)}T${pad(endHour)}:${pad(endMinute)}:00`;
                
                return {
                    ...scheduleData,
                    initialTime: initialTimeISO,
                    endTime: endTimeISO
                };
            });
            
            console.log('[SCHEDULE+HOURLIES] Schedules a criar:', schedulesToCreate);
            
            // Criar schedules
            const schedulesResponse = await this.createSchedule(professionalId, schedulesToCreate);
            console.log('[SCHEDULE+HOURLIES] Schedules criados:', schedulesResponse);

            //  CORREÇÃO: API retorna apenas {success: true}, então precisamos buscar os schedules
            console.log('[SCHEDULE+HOURLIES] Buscando schedules criados...');
            
            // Aguardar um pouco para garantir que o banco foi atualizado
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const allSchedules = await this.getSchedules(professionalId);
            console.log('[SCHEDULE+HOURLIES] Todos os schedules do profissional:', allSchedules);
            
            // Filtrar apenas os schedules que acabamos de criar (baseado nas datas)
            const createdDates = dates.map(d => d); // Datas no formato YYYY-MM-DD
            
            const createdSchedules = allSchedules.filter(schedule => {
                const scheduleDate = schedule.initialTime.split('T')[0];
                const wasJustCreated = createdDates.includes(scheduleDate);
                
                if (wasJustCreated) {
                    console.log(`Schedule encontrado para data ${scheduleDate}:`, schedule.id);
                }
                
                return wasJustCreated;
            });
            
            console.log('[SCHEDULE+HOURLIES] Quantidade:', createdSchedules.length);
            
            if (createdSchedules.length === 0) {
                console.warn('[SCHEDULE+HOURLIES] Nenhum schedule foi encontrado após criação');
                console.warn('[SCHEDULE+HOURLIES] Isso pode indicar que a criação falhou silenciosamente');
                return schedulesResponse;
            }
            
            // Criar hourlies baseado no modo
            let timeSlots: string[] = [];
            
            if (scheduleData.isControlled) {
                // MODO CONTROLADO: Gerar slots automáticos
                console.log('[SCHEDULE+HOURLIES] Modo CONTROLADO - Gerando slots automáticos...');
                timeSlots = this.generateTimeSlots(startTime, endTime, scheduleData.interval);
                console.log('[SCHEDULE+HOURLIES] Slots gerados:', timeSlots);
            } else {
                // MODO LIVRE: Usar horários customizados
                console.log('[SCHEDULE+HOURLIES] Modo LIVRE - Usando horários customizados...');
                
                if (!customTimes || customTimes.length === 0) {
                    console.warn('[SCHEDULE+HOURLIES] Nenhum horário customizado fornecido!');
                    return schedulesResponse;
                }
                
                timeSlots = customTimes;
                console.log('[SCHEDULE+HOURLIES] Horários customizados:', timeSlots);
            }

            // Criar hourlies para todos os schedules
            const hourlies: HourlyCreateData[] = [];
            
            createdSchedules.forEach((schedule: any) => {
                const scheduleId = schedule.id;
                const scheduleDate = schedule.initialTime.split('T')[0]; // YYYY-MM-DD
                
                timeSlots.forEach(hour => {
                    hourlies.push({
                        scheduleId,
                        date: scheduleDate,
                        hour
                    });
                });
            });
            
            console.log(`[SCHEDULE+HOURLIES] Total de hourlies a criar: ${hourlies.length}`);
            console.log(`   - ${createdSchedules.length} schedule(s)`);
            console.log(`   - ${timeSlots.length} horário(s) por schedule`);
            
            // 6️⃣ Criar hourlies em batch
            const hourliesResults = await this.createMultipleHourlies(hourlies);
            
            const successfulHourlies = hourliesResults.filter(r => r.status === 'fulfilled').length;
            console.log(`[SCHEDULE+HOURLIES] ${successfulHourlies}/${hourlies.length} hourlies criados com sucesso`);
            
            return schedulesResponse;
            
        } catch (error: any) {
            console.error('[SCHEDULE+HOURLIES] Erro geral:', error);
            throw error;
        }
    },

    async getSchedules(professionalId: string): Promise<ScheduleResponse[]> {
        try {
            const response = await api.get(`/schedules/${professionalId}`);
            return response.data.schedules || response.data || [];
        } catch (error: any) {
            console.error('Error fetching schedules:', error);
            throw new Error(error.response?.data?.message || 'Erro ao buscar agendamentos');
        }
    },

    async getHourlies(scheduleId: string) {
        try {
            const response = await api.get(`/hourlies/${scheduleId}`);
            return response.data.hourlies || response.data || [];
        } catch (error: any) {
            console.error('Error fetching hourlies:', error);
            throw new Error(error.response?.data?.message || 'Erro ao buscar horários');
        }
    },

    async deleteSchedule(scheduleId: string) {
        try {
            const response = await api.delete(`/schedules/${scheduleId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error deleting schedule:', error);
            throw new Error(error.response?.data?.message || 'Erro ao deletar agendamento');
        }
    },

    async getSchedulingsByDateRange(startDate: string, endDate: string, scheduleId: string) {
        try {
            const response = await api.get(`/schedulings/schedule/${scheduleId}`, {
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            })
            
            const schedulings = Array.isArray(response.data) 
                ? response.data 
                : (response.data?.schedulings || []);
                
            return schedulings;
            
        } catch (error: any) {
            if (error.response?.status === 404) {
                return [];
            }
            
            throw new Error(error.response?.data?.message || 'Erro ao buscar agendamentos por período');
        }
    },

    async confirmAppointment(schedulingId: string) {
        try {
            const response = await api.patch(
                `/schedulings/finished-consultation/${schedulingId}`
            )
            
            return response.data
        } catch (error: any) {
            if (error?.response?.status === 204) {
                return { success: true, schedulingId, status: 204 }
            }
            
            throw error
        }
    },

    async confirmMultipleAppointments(schedulingIds: string[]) {
        try {
            const promises = schedulingIds.map(id => this.confirmAppointment(id))
            const results = await Promise.allSettled(promises)
            
            return results
        } catch (error: any) {
            throw error
        }
    },

    async markAsNoShow(schedulingId: string) {
        try {
            const response = await api.patch(
                `/schedulings/finished-consultation/${schedulingId}`
            )
            
            return response.data
        } catch (error: any) {
            if (error?.response?.status === 204) {
                return { success: true, schedulingId, status: 204 }
            }
            
            throw error
        }
    }
};

export default ScheduleService;