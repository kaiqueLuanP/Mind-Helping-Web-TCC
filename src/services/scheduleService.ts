import api from '@/api/api';

export interface ScheduleCreateData {
    initialTime: string;
    endTime: string;
    interval: number;
    cancellationPolicy: number;
    averageValue: number;
    observation: string;
    isControlled: boolean;
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

    // ✅ NOVO: Buscar agendas do profissional
    async getSchedules(professionalId: string): Promise<ScheduleResponse[]> {
        try {
            const response = await api.get(`/schedules/${professionalId}`);
            return response.data.schedules || response.data || [];
        } catch (error: any) {
            console.error('Error fetching schedules:', error);
            throw new Error(error.response?.data?.message || 'Erro ao buscar agendamentos');
        }
    },

    // ✅ NOVO: Deletar agenda
    async deleteSchedule(scheduleId: string) {
        try {
            const response = await api.delete(`/schedules/${scheduleId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error deleting schedule:', error);
            throw new Error(error.response?.data?.message || 'Erro ao deletar agendamento');
        }
    }
};

export default ScheduleService;