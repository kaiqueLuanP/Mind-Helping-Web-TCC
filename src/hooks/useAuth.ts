// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import professionalService, { ProfessionalResponse } from '@/services/professionalService';

export function useAuth() {
  const [user, setUser] = useState<ProfessionalResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const profile = await professionalService.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await professionalService.login(email, password);
      setUser(response.professional);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    professionalService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}