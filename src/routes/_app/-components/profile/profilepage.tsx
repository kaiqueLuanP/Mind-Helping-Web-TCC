import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, Camera, Check } from 'lucide-react';
import ProfessionalService from '@/services/professionalService';
import api from '@/api/api';
import { useAuth } from '@/hooks/useAuth';
import professionalService from '@/services/professionalService';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  crp: string;
  birthDate: string;
  address: string;
  number: number;
  cep: string;
  uf: string;
  city: string;
  neighborhood: string;
  complement?: string;
  voluntary: boolean;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await ProfessionalService.getProfile();
      
      console.log('========== DADOS DA API ==========');
      console.log('Dados completos:', JSON.stringify(profile, null, 2));
      console.log('birthDate:', profile.birthDate);
      console.log('cep:', profile.cep);
      console.log('cepUser:', profile.cepUser);
      console.log('crp:', profile.crp);
      console.log('cpf:', profile.cpf);
      console.log('id:', profile.id);
      console.log('idauth:', user?.id);
      console.log('==================================');
      
      // Mapeia os dados da API para o formato do componente
  if (profile) {
  // Define o tipo esperado do endereço
  interface AddressData {
    street?: string;
    neighborhood?: string;
    number?: number;
    complement?: string;
    cep?: string;
    city?: string;
    uf?: string;
  }

  // Corrige caso o backend retorne o endereço como objeto
  const addressData: AddressData =
    profile && typeof profile.address === 'object' && profile.address !== null
      ? (profile.address as AddressData)
      : {};

  // Mapeia os dados, garantindo valores padrão seguros
  const mappedData = {
    id: profile.id ,
    name: profile.name ??  '',
    email: profile.email ?? '',
    cpf: profile.cpf ?? '',
    phone: profile.phone ?? '',
    crp: profile.crp ?? '',
    birthDate: (profile.birthDate || profile.birth_date)
    ? new Date(profile.birthDate || profile.birth_date).toISOString().split('T')[0]
    : '',
    address: addressData.street ?? profile.address ?? '',
    number: addressData.number ?? profile.number ?? 0,
    cep: addressData.cep ?? profile.cep ?? profile.cepUser ?? '',
    uf: addressData.uf ?? profile.uf ?? '',
    city: addressData.city ?? profile.city ?? '',
    neighborhood: addressData.neighborhood ?? profile.neighborhood ?? '',
    complement: addressData.complement ?? profile.complement ?? '',
    voluntary: profile.voluntary ?? false
  };

  console.log('========== DADOS MAPEADOS ==========');
  console.log('birthDate final:', mappedData.birthDate);
  console.log('cep final:', mappedData.cep);
  console.log('crp final:', mappedData.crp);
  console.log('cpf final:', mappedData.cpf);
  console.log('address final:', mappedData.address);
  console.log('====================================');

  setProfileData(mappedData);
}


    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string | number | boolean) => {
    if (!profileData) return;
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handleSave = async () => {
    if (!profileData) return;

    try {
      setIsSaving(true);
      
      // Prepara os dados exatamente como a API espera com snake_case
      const updateData = {
        name: profileData.name,
        birth_date: profileData.birthDate, // snake_case!
        phone: profileData.phone,
        email: profileData.email,
        cpf: profileData.cpf,
        voluntary: profileData.voluntary,
        address: profileData.address,
        neighborhood: profileData.neighborhood,
        number: profileData.number,
        complement: profileData.complement || '',
        cepUser: profileData.cep, 
        city: profileData.city,
        uf: profileData.uf
      };

      console.log('Dados sendo enviados para API:', updateData);

      // Usa PATCH no endpoint correto
      await api.patch(`/professionals/${user.id}`, updateData); 
      

      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
      await loadProfile();
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
      console.error('Detalhes do erro:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Erro ao salvar perfil';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    ProfessionalService.logout();
  };

  const formatCPF = (cpf: string | undefined) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string | undefined) => {
    if (!phone) return '';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatCEP = (cep: string | undefined) => {
    if (!cep) return '';
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  // Memoriza as iniciais para evitar recálculo
  const initials = useMemo(() => {
    if (!profileData?.name) return 'U';
    return profileData.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }, [profileData?.name]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Erro ao carregar perfil</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center pb-8">
            <div className="flex flex-col items-center space-y-4">
              {/* Avatar com badge de verificação */}
              <div className="relative">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <button 
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  disabled={!isEditing}
                  title={isEditing ? "Alterar foto" : "Edite o perfil para alterar a foto"}
                >
                  <Camera className="w-4 h-4" />
                </button>
                <div className="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              <div>
                <CardTitle className="text-2xl">{profileData.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Psicólogo • CRP {profileData.crp}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Seção: Dados Pessoais */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Dados Pessoais</h3>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </Button>
                )}
              </div>
              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-muted-foreground">Nome</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{profileData.name}</p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Data de Nascimento</Label>
                  <Input
                    type="date"
                    value={profileData.birthDate}
                    disabled
                    className="mt-1 bg-gray-100 cursor-not-allowed"
                    title="Este campo não pode ser alterado"
                  />
                </div>

                <div>
                  <Label className="text-muted-foreground">CPF</Label>
                  <Input
                    value={profileData.cpf}
                    disabled
                    className="mt-1 bg-gray-100 cursor-not-allowed"
                    title="Este campo não pode ser alterado"
                  />
                </div>

                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1"
                      maxLength={11}
                    />
                  ) : (
                    <p className="mt-1 font-medium">{formatPhone(profileData.phone)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Seção: Informações Profissionais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Profissionais</h3>
              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">CRP</Label>
                  <Input
                    value={profileData.crp}
                    disabled
                    className="mt-1 bg-gray-100 cursor-not-allowed"
                    title="Este campo não pode ser alterado"
                  />
                </div>

                <div>
                  <Label className="text-muted-foreground">Atuação voluntária</Label>
                  {isEditing ? (
                    <div className="mt-1 flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={profileData.voluntary === true}
                          onChange={() => handleInputChange('voluntary', true)}
                          className="cursor-pointer"
                        />
                        Sim
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={profileData.voluntary === false}
                          onChange={() => handleInputChange('voluntary', false)}
                          className="cursor-pointer"
                        />
                        Não
                      </label>
                    </div>
                  ) : (
                    <p className="mt-1 font-medium">{profileData.voluntary ? 'Sim' : 'Não'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Seção: Localização */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Localização</h3>
              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">CEP</Label>
                  <Input
                    value={profileData.cep}
                    disabled
                    className="mt-1 bg-gray-100 cursor-not-allowed"
                    placeholder="00000-000"
                    title="Este campo não pode ser alterado"
                  />
                </div>

                <div>
                  <Label className="text-muted-foreground">UF</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.uf}
                      onChange={(e) => handleInputChange('uf', e.target.value.toUpperCase())}
                      maxLength={2}
                      className="mt-1"
                      placeholder="SP"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{profileData.uf}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <Label className="text-muted-foreground">Endereço</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{profileData.address}</p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Número</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={profileData.number}
                      onChange={(e) => handleInputChange('number', parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{profileData.number}</p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Bairro</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{profileData.neighborhood}</p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Cidade</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{profileData.city}</p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Complemento</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.complement || ''}
                      onChange={(e) => handleInputChange('complement', e.target.value)}
                      className="mt-1"
                      placeholder="Opcional"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{profileData.complement || '-'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Seção: Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contato</h3>
              <Separator />

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-muted-foreground">E-mail</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Senha</Label>
                  <p className="mt-1 font-medium">••••••••</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Política de Privacidade */}
            <div className="text-sm text-muted-foreground text-center space-y-2">
              <p>Ao clicar em salvar, você concorda com nossos Termos de Serviço e Política de Privacidade.</p>
              <p>Seus dados pessoais são privados e utilizados apenas para melhorar sua experiência no sistema.</p>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      loadProfile();
                    }}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                >
                  Sair
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}