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

    async getSchedulingsByProfessional(professionalId: string) {
        try {
            const response = await api.get(`/schedulings/professional/${professionalId}`);
            return response.data.schedulings || response.data || [];
        } catch (error: any) {
            console.error('Error fetching professional schedulings:', error);
            throw new Error(error.response?.data?.message || 'Erro ao buscar agendamentos dos pacientes');
        }
    },

    async getSchedulingsByDateRange(startDate: string, endDate: string, professionalId: string) {
        try {
            console.log(`📡 Chamando API com:`, { startDate, endDate, professionalId })
            const response = await api.get(`/schedulings/professional/${professionalId}`, {
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            })
            console.log(`📦 Resposta completa da API:`, response.data)
            
            // A API retorna um array direto ou dentro de schedulings
            const schedulings = Array.isArray(response.data) ? response.data : (response.data.schedulings || response.data || []);
            console.log(`✅ Agendamentos extraídos:`, schedulings)
            return schedulings;
        } catch (error: any) {
            console.error('Error fetching schedulings by date range:', error);
            throw new Error(error.response?.data?.message || 'Erro ao buscar agendamentos por período');
        }
    }
};

export default ScheduleService;