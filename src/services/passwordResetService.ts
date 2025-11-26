import api from '@/api/api';

export interface RequestPasswordResetData {
  email: string;
}

export interface VerifyResetCodeData {
  email: string;
  code: string;
}

export interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
}

class PasswordResetService {
  // Solicitar código de redefinição de senha
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post('/persons/request-reset-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao solicitar redefinição de senha');
    }
  }

  // Verificar código de redefinição
  async verifyResetCode(email: string, code: string): Promise<void> {
    try {
      await api.post('/persons/verify-reset-password-code', { email, code });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Código inválido ou expirado');
    }
  }

  // Redefinir senha
  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    try {
      await api.post('/persons/reset-password', { 
        email, 
        code, 
        newPassword 
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao redefinir senha');
    }
  }
}

export default new PasswordResetService();