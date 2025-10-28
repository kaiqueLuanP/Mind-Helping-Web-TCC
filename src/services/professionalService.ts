import api from '@/api/api';

export interface ProfessionalRegisterData {
  name: string;
  birthDate: string;
  cpf: string;
  phone: string;
  crp: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state?: string;
  complement?: string;
  email: string;
  password: string;
  isSocialProfessional?: boolean;
  acceptedTerms: boolean;
}

interface APIRegisterData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  crp: string;
  birth_date: string;
  address: string;
  number: number;
  cepUser: string;
  uf: string;
  voluntary: boolean;
  city: string;
  neighborhood: string;
  complement: string;
}

export interface ProfessionalResponse {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  crp: string;
  birth_date: string;
  birthDate?: string; 
  address: string;
  number: number;
  cepUser: string;
  cep?: string; 
  uf: string;
  voluntary: boolean;
  city: string;
  neighborhood: string;
  complement?: string;
  createdAt: string;
}

class ProfessionalService {
  private transformToAPIFormat(data: ProfessionalRegisterData): APIRegisterData {
    const addressParts = [
      data.street || '',
      data.neighborhood || '',
      data.city || '',
      data.complement || ''
    ].filter(part => part.length > 0);
    
    return {
      name: data.name,
      email: data.email,
      password: data.password,
      cpf: data.cpf,
      phone: data.phone,
      crp: data.crp,
      birth_date: data.birthDate,
      address: addressParts.join(', ') || 'Endereço não informado',
      number: parseInt(data.number) || 0,
      cepUser: data.cep,
      uf: data.state || 'SP',
      voluntary: data.isSocialProfessional || false,
      city: data.city || '',
      neighborhood: data.neighborhood || '',
      complement: data.complement || ''
    };
  }

  async register(data: ProfessionalRegisterData): Promise<ProfessionalResponse> {
    try {
      const apiData = this.transformToAPIFormat(data);
      console.log('Dados sendo enviados para cadastro:', apiData);
      
      const response = await api.post('/professional', apiData);
      
      console.log('Cadastro bem-sucedido');
      console.log('Resposta do cadastro:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      console.error('Resposta de erro:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Erro ao cadastrar profissional');
    }
  }

  async login(email: string, password: string): Promise<{ token: string; professional: ProfessionalResponse }> {
    try {
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      console.log('Iniciando login...');
      console.log('Email:', email.trim());

      const response = await api.post('/persons/authenticate', {
        email: email.trim(),
        password: password
      });

      console.log('Response.status:', response.status);
      console.log('Response.data:', response.data);

      if (response.status >= 400) {
        console.error('Erro na autenticação:', response.data);
        throw new Error(response.data?.message || 'Email ou senha incorretos');
      }

      const { user } = response.data;
      
      if (!user) {
        console.error('Objeto user não encontrado na resposta:', response.data);
        throw new Error('Resposta inválida do servidor');
      }

      const { userId, isAuthenticated } = user;

      if (!isAuthenticated) {
        console.error('Autenticação falhou - isAuthenticated é false');
        throw new Error('Email ou senha incorretos');
      }

      if (!userId) {
        console.error('userId não encontrado:', user);
        throw new Error('Dados do usuário inválidos');
      }

      console.log('Usuário autenticado com sucesso!');
      console.log('User ID:', userId);

      const authToken = `auth_${userId}_${Date.now()}`;

      console.log('Login bem-sucedido!');

      localStorage.setItem('token', authToken);
      localStorage.setItem('professionalId', userId);
      localStorage.setItem('isAuthenticated', 'true');
      
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      let userData: any = { id: userId };
      try {
        const profileResponse = await api.get(`/professional/${userId}`);
        if (profileResponse.data && profileResponse.data.professional) {
          userData = profileResponse.data.professional;
          console.log('Perfil completo carregado:', userData.name);
        } else if (profileResponse.data) {
          userData = profileResponse.data;
          console.log('Perfil carregado:', userData.name);
        }
      } catch (profileError) {
        console.warn('⚠️ Não foi possível carregar o perfil completo, usando dados básicos');
      }

      return {
        token: authToken,
        professional: userData
      };

    } catch (error: any) {
      console.error('❌ Erro durante login:', error);

      let errorMessage = 'Erro ao tentar fazer login';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Tempo limite excedido. O servidor está demorando para responder.';
      } else if (!error.response && error.message.includes('Network Error')) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
      } 
      else if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Email ou senha incorretos';
            break;
          case 404:
            errorMessage = 'Endpoint de autenticação não encontrado. Verifique a configuração da API.';
            break;
          case 429:
            errorMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Servidor temporariamente indisponível. Tente novamente em alguns minutos.';
            break;
          default:
            errorMessage = error.response.data?.message || 'Erro desconhecido ao tentar fazer login';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  async getProfile(): Promise<ProfessionalResponse> {
    try {
      const id = localStorage.getItem('professionalId');
      const isAuthenticated = localStorage.getItem('isAuthenticated');

      console.log('Buscando perfil:', { id, isAuthenticated });

      if (!id || !isAuthenticated) {
        throw new Error('Usuário não autenticado');
      }

      console.log(`Buscando perfil em: /professionals/profile/${id}`);

      const response = await api.get(`/professionals/profile/${id}`);
      

      if (!response.data) {
        throw new Error('Dados do perfil não encontrados');
      }

      const profileData = response.data.professional || response.data;

      if (!profileData || typeof profileData !== 'object') {
        throw new Error('Dados do perfil inválidos');
      }

      // Normaliza os dados para ter tanto snake_case quanto camelCase
      const normalizedProfile = {
        ...profileData,
        id,
        birthDate: profileData.birth_date || profileData.birthDate || '',
        birth_date: profileData.birth_date || profileData.birthDate || '',
        cep: profileData.cepUser || profileData.cep || '',
        cepUser: profileData.cepUser || profileData.cep || ''
      };

      console.log('Perfil carregado com sucesso');
      console.log('Dados normalizados:', {
        birthDate: normalizedProfile.birthDate,
        birth_date: normalizedProfile.birth_date,
        cep: normalizedProfile.cep,
        cepUser: normalizedProfile.cepUser,
        crp: normalizedProfile.crp
      });
      
      return normalizedProfile;
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar perfil');
    }
  }

  logout(): void {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem('token');
    localStorage.removeItem('professionalId');
    localStorage.removeItem('isAuthenticated');
    api.defaults.headers.common['Authorization'] = '';
    window.location.href = '/login';
  }
}

export default new ProfessionalService();