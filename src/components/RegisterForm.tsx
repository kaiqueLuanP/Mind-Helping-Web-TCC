// src/components/RegisterForm.tsx
import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import professionalService, { ProfessionalRegisterData } from '@/services/professionalService';

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState<ProfessionalRegisterData>({
        // Dados Pessoais
        name: '',
        birthDate: '',
        cpf: '',
        phone: '',
        crp: '',
        
        // Endereço
        cep: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: 'SP', // Padrão: São Paulo
        complement: '',
        
        // Dados de Acesso
        email: '',
        password: '',
        
        // Extras
        isSocialProfessional: false,
        acceptedTerms: false,
    });

    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Limpar erro ao digitar
        if (error) setError('');
    };

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            [id]: checked
        }));
    };

    const validateForm = (): boolean => {
        // Validar campos obrigatórios
        if (!formData.name || !formData.birthDate || !formData.cpf || 
            !formData.phone || !formData.crp || !formData.cep || 
            !formData.street || !formData.number || !formData.neighborhood || 
            !formData.city || !formData.state || !formData.email || !formData.password) {
            setError('Por favor, preencha todos os campos obrigatórios (*)');
            return false;
        }

        // Validar senha
        if (formData.password.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres');
            return false;
        }

        // Validar confirmação de senha
        if (formData.password !== confirmPassword) {
            setError('As senhas não coincidem');
            return false;
        }

        // Validar aceite dos termos
        if (!formData.acceptedTerms) {
            setError('Você precisa aceitar os termos de condição');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Fazer cadastro
            const response = await professionalService.register(formData);
            
            console.log('Cadastro realizado com sucesso:', response);
            
            // Redirecionar para login
            navigate({ to: '/login' });
            
        } catch (err: any) {
            setError(err.message || 'Erro ao realizar cadastro');
            console.error('Erro no cadastro:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6 max-w-2xl mx-auto", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Cadastro de Profissional</CardTitle>
                    <CardDescription>
                        Preencha os dados abaixo para criar sua conta profissional
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            {/* Mensagem de Erro */}
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Dados Pessoais */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                                    Dados Pessoais
                                </h3>

                                {/* Nome completo */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nome Completo *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Seu nome completo"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Data de nascimento e CPF */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="birthDate">Data de Nascimento *</Label>
                                        <Input
                                            id="birthDate"
                                            type="date"
                                            value={formData.birthDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="cpf">CPF *</Label>
                                        <Input
                                            id="cpf"
                                            type="text"
                                            placeholder="000.000.000-00"
                                            value={formData.cpf}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Telefone e CRP */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Telefone *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="(11) 99999-9999"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="crp">CRP *</Label>
                                        <Input
                                            id="crp"
                                            type="text"
                                            placeholder="Ex: CRP 06/123456"
                                            value={formData.crp}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Endereço */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                                    Endereço
                                </h3>

                                {/* CEP, Logradouro e Número */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="cep">CEP *</Label>
                                        <Input
                                            id="cep"
                                            type="text"
                                            placeholder="00000-000"
                                            value={formData.cep}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="street">Logradouro *</Label>
                                        <Input
                                            id="street"
                                            type="text"
                                            placeholder="Nome da rua"
                                            value={formData.street}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="number">Número *</Label>
                                        <Input
                                            id="number"
                                            type="text"
                                            placeholder="123"
                                            value={formData.number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Bairro e Cidade */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="neighborhood">Bairro *</Label>
                                        <Input
                                            id="neighborhood"
                                            type="text"
                                            placeholder="Nome do bairro"
                                            value={formData.neighborhood}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="city">Cidade *</Label>
                                        <Input
                                            id="city"
                                            type="text"
                                            placeholder="Nome da cidade"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Estado (UF) */}
                                <div className="grid gap-2">
                                    <Label htmlFor="state">Estado (UF) *</Label>
                                    <select
                                        id="state"
                                        value={formData.state}
                                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="AC">Acre</option>
                                        <option value="AL">Alagoas</option>
                                        <option value="AP">Amapá</option>
                                        <option value="AM">Amazonas</option>
                                        <option value="BA">Bahia</option>
                                        <option value="CE">Ceará</option>
                                        <option value="DF">Distrito Federal</option>
                                        <option value="ES">Espírito Santo</option>
                                        <option value="GO">Goiás</option>
                                        <option value="MA">Maranhão</option>
                                        <option value="MT">Mato Grosso</option>
                                        <option value="MS">Mato Grosso do Sul</option>
                                        <option value="MG">Minas Gerais</option>
                                        <option value="PA">Pará</option>
                                        <option value="PB">Paraíba</option>
                                        <option value="PR">Paraná</option>
                                        <option value="PE">Pernambuco</option>
                                        <option value="PI">Piauí</option>
                                        <option value="RJ">Rio de Janeiro</option>
                                        <option value="RN">Rio Grande do Norte</option>
                                        <option value="RS">Rio Grande do Sul</option>
                                        <option value="RO">Rondônia</option>
                                        <option value="RR">Roraima</option>
                                        <option value="SC">Santa Catarina</option>
                                        <option value="SP">São Paulo</option>
                                        <option value="SE">Sergipe</option>
                                        <option value="TO">Tocantins</option>
                                    </select>
                                </div>

                                {/* Complemento */}
                                <div className="grid gap-2">
                                    <Label htmlFor="complement">Complemento</Label>
                                    <Input
                                        id="complement"
                                        type="text"
                                        placeholder="Apartamento, bloco, etc. (opcional)"
                                        value={formData.complement}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Dados de Acesso */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                                    Dados de Acesso
                                </h3>

                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">E-mail *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Senha */}
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Senha *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Mínimo 8 caracteres"
                                        minLength={8}
                                        
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Confirmar Senha */}
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Repita a senha"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="isSocialProfessional"
                                        checked={formData.isSocialProfessional}
                                        onCheckedChange={(checked) => 
                                            handleCheckboxChange('isSocialProfessional', checked as boolean)
                                        }
                                    />
                                    <Label htmlFor="isSocialProfessional" className="text-sm">
                                        Profissional social?
                                        <span className="text-muted-foreground ml-1">
                                            (Prestação social à saúde que oferece consultas gratuitas para baixa renda)
                                        </span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="acceptedTerms"
                                        checked={formData.acceptedTerms}
                                        onCheckedChange={(checked) => 
                                            handleCheckboxChange('acceptedTerms', checked as boolean)
                                        }
                                    />
                                    <Label htmlFor="acceptedTerms" className="text-sm">
                                        Li e aceito os{" "}
                                        <a
                                            href="#"
                                            className="text-primary underline underline-offset-4 hover:text-primary/80"
                                        >
                                            termos de condição
                                        </a>{" "}
                                        *
                                    </Label>
                                </div>
                            </div>

                            {/* Botão de Cadastro */}
                            <Button 
                                type="submit" 
                                className="w-full text-white bg-primary hover:bg-primary/90"
                                disabled={isLoading}
                            >
                                {isLoading ? 'CADASTRANDO...' : 'CADASTRAR'}
                            </Button>

                            {/* Link para Login */}
                            <div className="text-center text-sm">
                                Já tem uma conta?{" "}
                                <Link to="/login" className="text-primary hover:underline">
                                    Faça login
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Política de Privacidade */}
            <div className="text-muted-foreground text-center text-xs text-balance">
                Ao se cadastrar, você concorda com nossos{" "}
                <a href="#" className="underline underline-offset-4 hover:text-primary">
                    Termos de Serviço
                </a>{" "}
                e{" "}
                <a href="#" className="underline underline-offset-4 hover:text-primary">
                    Política de Privacidade
                </a>.
            </div>
        </div>
    );
}