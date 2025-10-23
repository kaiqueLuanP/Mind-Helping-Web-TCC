import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, Camera, Check } from 'lucide-react';
import ProfessionalService from '@/services/professionalService';
import api from '@/api/api';

interface ProfileData {
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
  city: string;
  neighborhood: string;
  complement?: string;
  voluntary: boolean;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await ProfessionalService.getProfile();
      setProfileData(profile as any);
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string | number) => {
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
      
      // Prepara os dados para atualização
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        cpf: profileData.cpf,
        phone: profileData.phone,
        crp: profileData.crp,
        birth_date: profileData.birth_date,
        address: profileData.address,
        number: profileData.number,
        cepUser: profileData.cepUser,
        uf: profileData.uf,
        city: profileData.city,
        neighborhood: profileData.neighborhood,
        complement: profileData.complement || '',
        voluntary: profileData.voluntary
      };

      // Atualiza o perfil
      await api.put(`/professional/${profileData.id}`, updateData);
      
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
      loadProfile();
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil');
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
    return phone.replace(/(\d{2})(\d{3})(\d{3})(\d{2})/, '($1) $2-$3-$4');
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  // Se não tiver dados do perfil, não renderiza nada
  if (!profileData) {
    return null;
  }

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

  const initials = profileData.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center pb-8">
            <div className="flex flex-col items-center space-y-4">
              {/* Avatar com badge de verificação */}
              <div className="relative">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <button 
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                  disabled={!isEditing}
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
                  {isEditing ? (
                    <Input
                      type="date"
                      value={profileData.birth_date}
                      onChange={(e) => handleInputChange('birth_date', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{formatDate(profileData.birth_date)}</p>
                  )}´
                </div>

                <div>
                  <Label className="text-muted-foreground">CPF</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.cpf}
                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{formatCPF(profileData.cpf)}</p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1"
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
                  {isEditing ? (
                    <Input
                      value={profileData.crp}
                      onChange={(e) => handleInputChange('crp', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{profileData.crp}</p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Atuação voluntária</Label>
                  <p className="mt-1 font-medium">{profileData.voluntary ? 'Sim' : 'Não'}</p>
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
                  {isEditing ? (
                    <Input
                      value={profileData.cepUser}
                      onChange={(e) => handleInputChange('cepUser', e.target.value)}
                      className="mt-1"
                      maxLength={8}
                    />
                  ) : (
                    <p className="mt-1 font-medium">{profileData.cepUser}</p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">UF</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.uf}
                      onChange={(e) => handleInputChange('uf', e.target.value)}
                      maxLength={2}
                      className="mt-1"
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
                      onChange={(e) => handleInputChange('number', e.target.value)}
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
                  <Label className="text-muted-foreground">Número</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={profileData.number}
                      onChange={(e) => handleInputChange('number', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 font-medium">{profileData.number}</p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Complemento</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.complement || ''}
                      onChange={(e) => handleInputChange('complement', e.target.value)}
                      className="mt-1"
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