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
            console.log(`🔡 Chamando API com:`, { startDate, endDate, scheduleId })
            
            const response = await api.get(`/schedulings/schedule/${scheduleId}`, {
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            })
            
            console.log(`📦 Resposta completa da API:`, response.data)
            
            const schedulings = Array.isArray(response.data) 
                ? response.data 
                : (response.data?.schedulings || []);
                
            console.log(`✅ Agendamentos extraídos:`, schedulings)
            return schedulings;
            
        } catch (error: any) {
            console.error('Error fetching schedulings by date range:', error);
            
            if (error.response?.status === 404) {
                console.log('⚠️ Nenhum agendamento encontrado (404), retornando array vazio')
                return [];
            }
            
            throw new Error(error.response?.data?.message || 'Erro ao buscar agendamentos por período');
        }
    },

    /**
     * ✅ Marca uma consulta como finalizada
     * PATCH /schedulings/finished-consultation/{schedulingId}
     * @param schedulingId - ID do agendamento
     * @returns Promise com a resposta da API
     */
    async confirmAppointment(schedulingId: string) {
        try {
            console.log('🔄 [API CALL] Confirmando consulta:', schedulingId)
            console.log('🔄 [API CALL] URL:', `/schedulings/finished-consultation/${schedulingId}`)
            console.log('🔄 [API CALL] Método: PATCH')
            
            const response = await api.patch(
                `/schedulings/finished-consultation/${schedulingId}`
            )
            
            console.log('✅ [API RESPONSE] Status:', response.status)
            console.log('✅ [API RESPONSE] Data:', response.data)
            
            return response.data
        } catch (error: any) {
            console.error('❌ [API ERROR] Erro ao confirmar consulta:', error)
            console.error('❌ [API ERROR] Status:', error?.response?.status)
            console.error('❌ [API ERROR] Data:', error?.response?.data)
            
            // Status 204 (No Content) é sucesso
            if (error?.response?.status === 204) {
                console.log('✅ [API SUCCESS] Consulta confirmada (Status 204 - No Content)')
                return { success: true, schedulingId, status: 204 }
            }
            
            throw error
        }
    },

    /**
     * ✅ Marca múltiplas consultas como finalizadas
     * @param schedulingIds - Array de IDs dos agendamentos
     * @returns Promise com todas as confirmações
     */
    async confirmMultipleAppointments(schedulingIds: string[]) {
        try {
            console.log(`🔄 [API BATCH] Confirmando ${schedulingIds.length} consultas...`)
            console.log('🔄 [API BATCH] IDs:', schedulingIds)
            
            const promises = schedulingIds.map((id, index) => {
                console.log(`🔄 [API BATCH ${index + 1}/${schedulingIds.length}] Iniciando para ID:`, id)
                return this.confirmAppointment(id)
            })
            
            const results = await Promise.allSettled(promises)
            
            const successful = results.filter(r => r.status === 'fulfilled').length
            const failed = results.filter(r => r.status === 'rejected').length
            
            console.log(`✅ [API BATCH] Resultado: ${successful} confirmadas, ${failed} falharam`)
            
            if (failed > 0) {
                console.warn(`⚠️ [API BATCH] ${failed} confirmações falharam:`)
                results.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        console.error(`❌ [API BATCH] Falha no ID ${schedulingIds[index]}:`, result.reason)
                    }
                })
            }
            
            return results
        } catch (error: any) {
            console.error('❌ [API BATCH ERROR] Erro ao confirmar múltiplas consultas:', error)
            throw error
        }
    },

    /**
     * ✅ Marca uma consulta como "não compareceu" (falta)
     * Por enquanto usa a mesma rota de finalização
     * @param schedulingId - ID do agendamento
     */
    async markAsNoShow(schedulingId: string) {
        try {
            console.log('🔄 [API CALL] Marcando como falta:', schedulingId)
            console.log('🔄 [API CALL] URL:', `/schedulings/finished-consultation/${schedulingId}`)
            console.log('🔄 [API CALL] Método: PATCH')
            console.log('⚠️ [API CALL] NOTA: Usando mesma rota de finalização (sem distinção de falta)')
            
            // Usando a mesma rota de finalização
            // Se você tiver uma rota específica para marcar falta, substitua aqui
            const response = await api.patch(
                `/schedulings/finished-consultation/${schedulingId}`
            )
            
            console.log('✅ [API RESPONSE] Status:', response.status)
            console.log('✅ [API RESPONSE] Data:', response.data)
            
            return response.data
        } catch (error: any) {
            console.error('❌ [API ERROR] Erro ao marcar como falta:', error)
            console.error('❌ [API ERROR] Status:', error?.response?.status)
            console.error('❌ [API ERROR] Data:', error?.response?.data)
            
            // Status 204 (No Content) é sucesso
            if (error?.response?.status === 204) {
                console.log('✅ [API SUCCESS] Falta registrada (Status 204 - No Content)')
                return { success: true, schedulingId, status: 204 }
            }
            
            throw error
        }
    }
};

export default ScheduleService;