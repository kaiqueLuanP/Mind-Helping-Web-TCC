import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Link } from "@tanstack/react-router"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
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
                    <form>
                        <div className="grid gap-6">
                            {/* Dados Pessoais */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                                    Dados Pessoais
                                </h3>

                                {/* Nome completo */}
                                <div className="grid gap-2">
                                    <Label htmlFor="nome">Nome Completo *</Label>
                                    <Input
                                        id="nome"
                                        type="text"
                                        placeholder="Seu nome completo"
                                        required
                                    />
                                </div>

                                {/* Data de nascimento e CPF */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="nascimento">Data de Nascimento *</Label>
                                        <Input
                                            id="nascimento"
                                            type="date"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="cpf">CPF *</Label>
                                        <Input
                                            id="cpf"
                                            type="text"
                                            placeholder="000.000.000-00"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Telefone e CRP */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="telefone">Telefone *</Label>
                                        <Input
                                            id="telefone"
                                            type="tel"
                                            placeholder="(11) 99999-9999"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="crp">CRP *</Label>
                                        <Input
                                            id="crp"
                                            type="text"
                                            placeholder="Ex: CRP 06/123456"
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
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="logradouro">Logradouro *</Label>
                                        <Input
                                            id="logradouro"
                                            type="text"
                                            placeholder="Nome da rua"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="numero">Número *</Label>
                                        <Input
                                            id="numero"
                                            type="text"
                                            placeholder="123"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Bairro e Cidade */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="bairro">Bairro *</Label>
                                        <Input
                                            id="bairro"
                                            type="text"
                                            placeholder="Nome do bairro"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="cidade">Cidade *</Label>
                                        <Input
                                            id="cidade"
                                            type="text"
                                            placeholder="Nome da cidade"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Complemento */}
                                <div className="grid gap-2">
                                    <Label htmlFor="complemento">Complemento</Label>
                                    <Input
                                        id="complemento"
                                        type="text"
                                        placeholder="Apartamento, bloco, etc. (opcional)"
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
                                        required
                                    />
                                </div>

                                {/* Senha */}
                                <div className="grid gap-2">
                                    <Label htmlFor="senha">Senha *</Label>
                                    <Input
                                        id="senha"
                                        type="password"
                                        placeholder="Mínimo 8 caracteres"
                                        required
                                    />
                                </div>

                                {/* Confirmar Senha */}
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmar-senha">Confirmar Senha *</Label>
                                    <Input
                                        id="confirmar-senha"
                                        type="password"
                                        placeholder="Repita a senha"
                                        required
                                    />
                                </div>
                            </div>
                            {/* Checkboxes */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="profissional-social"/>
                                    <Label htmlFor="profissional-social" className="text-sm">
                                        Profissional social?
                                        <span className="text-muted-foreground ml-1">
                                            (Prestação social à saúde que oferece consultas gratuitas para baixa renda)
                                        </span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="aceita-termos" />
                                    <Label htmlFor="aceita-termos" className="text-sm">
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
                            <Button type="submit" className="w-full text-white bg-primary hover:bg-primary/90">
                                CADASTRAR
                            </Button>

                            {/* Link para Login */}
                            <div className="text-center text-sm">
                                Já tem uma conta?{" "}
                                   <Link to="/login" className="text-primary hover:underline"> Faça login</Link>
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
    )
}