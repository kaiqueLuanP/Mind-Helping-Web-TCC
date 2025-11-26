import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ProfessionalService, { ProfessionalResponse } from '@/services/professionalService';
import api from '@/api/api';

interface AuthContextData {
  user: ProfessionalResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Criar o contexto com um valor inicial
const initialContext: AuthContextData = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {
    throw new Error('login not implemented');
  },
  logout: () => {
    throw new Error('logout not implemented');
  }
};

const AuthContext = createContext<AuthContextData>(initialContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<ProfessionalResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Iniciando login...');
      const response = await ProfessionalService.login(email, password);
      
      console.log('AuthContext: Login bem-sucedido');
      
      // Garantir que temos todos os dados necessários
      if (!response.token || !response.professional) {
        throw new Error('Dados de autenticação incompletos');
      }

      // Atualizar estado
      setToken(response.token);
      setUser(response.professional);

      // IMPORTANTE: Salvar no localStorage também aqui
      localStorage.setItem('token', response.token);
      localStorage.setItem('professionalId', response.professional.id);

    } catch (error: any) {
      console.error('❌ AuthContext: Erro no login:', error);
      // Limpar estado em caso de erro
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('professionalId');
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext: Fazendo logout...');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('professionalId');
    ProfessionalService.logout();
  };

  useEffect(() => {
    const checkAuth = async () => {
      console.log('AuthContext: Verificando autenticação...');
      
      try {
        const storedToken = localStorage.getItem('token');
        const storedProfessionalId = localStorage.getItem('professionalId');
        const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
        
        console.log('AuthContext: Dados armazenados:', { 
          hasToken: !!storedToken,
          professionalId: storedProfessionalId,
          isAuthenticated: storedIsAuthenticated
        });
        
        if (!storedIsAuthenticated || !storedProfessionalId) {
          console.log('AuthContext: Credenciais não encontradas');
          setIsLoading(false);
          return;
        }

        // Configurar token nas requisições
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        console.log('AuthContext: Buscando perfil do usuário...');
        const profile = await ProfessionalService.getProfile();
        
        console.log('AuthContext: Perfil recebido:', {
          id: profile.id,
          name: profile.name,
          email: profile.email
        });
        
        if (!profile || !profile.id) {
          throw new Error('Perfil não recebido ou inválido');
        }

        setUser(profile);
        setToken(storedToken);
        
        console.log('AuthContext: Autenticação restaurada com sucesso');
      } catch (error: any) {
        console.error('AuthContext: Erro na verificação:', error);
        // Limpar dados em caso de erro
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('professionalId');
        api.defaults.headers.common['Authorization'] = '';
      } finally {
        setIsLoading(false);
        console.log('AuthContext: Verificação de autenticação concluída');
      }
    };

    checkAuth();
  }, []);

  const isAuthenticated = !!token && !!user;

  // Log do estado atual para debug
  useEffect(() => {
    console.log('AuthContext: Estado atual:', {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      isLoading,
      userName: user?.name
    });
  }, [isAuthenticated, user, token, isLoading]);

  const contextValue: AuthContextData = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return React.createElement(AuthContext.Provider, { value: contextValue }, children);
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};