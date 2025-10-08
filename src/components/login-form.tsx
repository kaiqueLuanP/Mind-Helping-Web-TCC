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
import { Link } from "@tanstack/react-router"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo de Volta !</CardTitle>
          <CardDescription>
            Login com a sua conta Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
          <div className={cn("login-form flex flex-col gap-6", className)} {...props}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="default" className="w-full text-white s">
                  Login com Google
                </Button>
              </div>
              </div>

              <div className="relative flex items-center text-sm text-center">
                <span className="flex-1 h-px bg-border"></span> 
                <span className="px-2 bg-card text-muted-foreground z-10">
                  Ou Continue Com
                </span>
                <span className="flex-1 h-px bg-border"></span>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Esqueceu sua senha?
                    </a>
                  </div>
                  <Input id="password" type="password" />
                </div>
                <Link to="/principal">
                  <Button type="submit" className="w-full text-white bg-primary hover:bg-primary/90">
                    Login
                  </Button>
                </Link>
              </div>
              <div className="text-center text-sm">
                Não tem uma conta?{" "}
                <Link to="/register" className="text-primary hover:underline">Cadastre-se</Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Ao clicar em continue, você concorda com nossos <a href="#">Termos de Serviço</a>{" "}
        e <a href="#">Política de Privacidade</a>.
      </div>
    </div>
  )
}
