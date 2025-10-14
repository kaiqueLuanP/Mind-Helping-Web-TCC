// src/services/professionalService.ts
import api from '@/api/api'; 

// Interface com os campos do FORMULÁRIO
export interface ProfessionalRegisterData {
  // Dados Pessoais
  name: string;
  birthDate: string; // Data de nascimento
  cpf: string;
  phone: string;
  crp: string;
  
  // Endereço
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state?: string; // UF - adicionar no formulário
  complement?: string;
  
  // Dados de Acesso
  email: string;
  password: string;
  
  // Extras
  isSocialProfessional?: boolean;
  acceptedTerms: boolean;
}

// Interface que a API ESPERA (diferente do formulário!)
interface APIRegisterData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  crp: string;
  birth_date: string; // snake_case e nome diferente!
  address: string; // endereço completo em uma string!
  number: number; // número como NUMBER, não string!
  cepUser: string; // nome diferente!
  uf: string; // sigla do estado (SP, RJ, etc)
  voluntary: boolean; // nome diferente!
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
  address: string;
  number: number;
  cepUser: string;
  uf: string;
  voluntary: boolean;
  createdAt: string;
}

class ProfessionalService {
  // TRANSFORMAR dados do formulário para o formato da API
  private transformToAPIFormat(data: ProfessionalRegisterData): APIRegisterData {
    // Garantir que os campos de endereço tenham pelo menos string vazia
    const street = data.street || '';
    const neighborhood = data.neighborhood || '';
    const city = data.city || '';
    const complement = data.complement || '';
    
    // Construir endereço completo como string
    const addressParts = [
      street,
      neighborhood,
      city,
      complement
    ].filter(part => part.length > 0); // Remove apenas strings vazias
    
    const fullAddress = addressParts.join(', ') || 'Endereço não informado'; // Garante que sempre terá um valor
    
    return {
      name: data.name,
      email: data.email,
      password: data.password,
      cpf: data.cpf,
      phone: data.phone,
      crp: data.crp,
      birth_date: data.birthDate, // birthDate -> birth_date
      address: fullAddress, // Concatena tudo em uma string
      number: parseInt(data.number) || 0, // Garante que será um número
      cepUser: data.cep, // cep -> cepUser
      uf: data.state || 'SP', // Adicionar estado (padrão SP)
      voluntary: data.isSocialProfessional || false, // isSocialProfessional -> voluntary
      city: city, // Campo adicional requerido pela API
      neighborhood: neighborhood, // Campo adicional requerido pela API
      complement: complement, // Campo adicional requerido pela API
    };
  }

  // Cadastrar profissional
  async register(data: ProfessionalRegisterData): Promise<ProfessionalResponse> {
    try {
      console.log('📋 Dados do formulário:', data);
      
      // TRANSFORMAR para o formato da API
      const apiData = this.transformToAPIFormat(data);
      
      console.log('Dados transformados para API:', apiData);
      console.log('Enviando para:', api.defaults.baseURL + '/professional');
      
      // ROTA CORRETA: /professional (sem 's')
      const response = await api.post('/professional', apiData);
      
      console.log('Resposta da API:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(' Erro completo:', error);
      console.error(' Resposta do servidor:', error.response?.data);
      
      if (error.response) {
        // Pegar mensagem de erro da API
        const message = error.response.data.message || 
                       error.response.data.error || 
                       'Erro ao cadastrar profissional';
        throw new Error(message);
      } else if (error.request) {
        throw new Error('Sem resposta do servidor. Verifique sua conexão.');
      } else {
        throw new Error('Erro ao processar requisição');
      }
    }
  }

  // Login do profissional
  async login(email: string, password: string): Promise<{ token: string; professional: ProfessionalResponse }> {
    try {
      console.log('Tentando fazer login com:', { email, password });
      
      const response = await api.post('/persons/authenticate', { email, password });
      console.log('Resposta do servidor:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Erro ao fazer login');
      } else if (error.request) {
        throw new Error('Sem resposta do servidor. Verifique sua conexão.');
      } else {
        throw new Error('Erro ao processar requisição');
      }
    }
  }

  // Obter perfil do profissional
  async getProfile(): Promise<ProfessionalResponse> {
    try {
      const response = await api.get('/professional/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar perfil');
    }
  }

  // Atualizar perfil
  async updateProfile(data: Partial<ProfessionalRegisterData>): Promise<ProfessionalResponse> {
    try {
      const apiData = this.transformToAPIFormat(data as ProfessionalRegisterData);
      const response = await api.put('/professional/profile', apiData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil');
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}

export default new ProfessionalService();