import api from '@/api/api'

export interface Patient {
  patientId: string
  patientName: string
  patientAge: number
}

export interface PatientsResponse {
  patients: Patient[]
}

const PatientsService = {
  /**
   * Busca todos os pacientes de um profissional
   * GET /professionals/patients/{professionalId}
   * @param professionalId - ID do profissional
   * @returns Promise com a lista de pacientes
   */
  async getPatientsByProfessional(professionalId: string): Promise<Patient[]> {
    try {
      console.log('[API CALL] Buscando pacientes do profissional:', professionalId)
      console.log('[API CALL] URL:', `/professionals/patients/${professionalId}`)
      
      const response = await api.get<PatientsResponse>(
        `/professionals/patients/${professionalId}`
      )
      
      console.log('[API RESPONSE] Pacientes recebidos:', response.data)
      
      // A API retorna { patients: [...] }
      const patients = response.data?.patients || []
      
      console.log('[API RESPONSE] Total de pacientes:', patients.length)
      
      return patients
    } catch (error: any) {
      console.error('[API ERROR] Erro ao buscar pacientes:', error)
      console.error('[API ERROR] Status:', error?.response?.status)
      console.error('[API ERROR] Data:', error?.response?.data)

      // Se for 404 ou não encontrar pacientes, retornar array vazio
      if (error?.response?.status === 404) {
        console.log('[API] Nenhum paciente encontrado (404)')
        return []
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao buscar pacientes')
    }
  }
}

export default PatientsService