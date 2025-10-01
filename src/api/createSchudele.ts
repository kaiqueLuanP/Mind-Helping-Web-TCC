import { api } from "@/lib/axios";

export interface CreateScheduleRequest{
initialTime: string;
endTime: string;
interval: number;
cancellationPolicy: number;
averageValue: number;
observation: string;
isControlled: boolean;
}

export async function createSchedule({initialTime, endTime, interval, cancellationPolicy, averageValue, observation, isControlled}: CreateScheduleRequest){
    const professionalPersonId = "109a5098-c916-4902-843f-e2d112e51e71"
    await api.post(`/schedules/${professionalPersonId}`, {
        initialTime,
        endTime,
        interval,
        cancellationPolicy,
        averageValue,
        observation,
        isControlled
    })
}