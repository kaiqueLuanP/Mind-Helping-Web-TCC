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
// chamando api
    async getSchedulingsByDateRange(startDate: string, endDate: string, scheduleId: string) {
    try {
        console.log(`🔡 Chamando API com:`, { startDate, endDate, scheduleId })
        
        // CORRETO: usar /schedulings/schedule/ ao invés de /schedulings/professional/
        const response = await api.get(`/schedulings/schedule/${scheduleId}`, {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        })
        
        console.log(`📦 Resposta completa da API:`, response.data)
        
        // Garantir que sempre retorna um array, mesmo se vazio
        const schedulings = Array.isArray(response.data) 
            ? response.data 
            : (response.data?.schedulings || []);
            
        console.log(`✅ Agendamentos extraídos:`, schedulings)
        return schedulings;
        
    } catch (error: any) {
        console.error('Error fetching schedulings by date range:', error);
        
        // Se for 404, retornar array vazio ao invés de erro
        if (error.response?.status === 404) {
            console.log('⚠️ Nenhum agendamento encontrado (404), retornando array vazio')
            return [];
        }
        
        throw new Error(error.response?.data?.message || 'Erro ao buscar agendamentos por período');
    }
} 
};

export default ScheduleService;